/*
 * Este contexto representa a coleção do treinador autenticado.
 * Ele é consumido pelas telas de captura, Pokédex e equipe.
 * Ele carrega, atualiza e expõe capturas e integrantes do time.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Platform } from 'react-native';
import {
  AddToTeamResult,
  CaptureLocation,
  CaptureResult,
  CapturedPokemon,
  MAX_TEAM_SIZE,
  PokemonCollection,
} from '@/@types/collection';
import { Pokemon } from '@/@types/pokemon';
import { DEMO_COLLECTION } from '@/constants/demoCollection';
import { useAuth } from '@/context/AuthContext';
import {
  addToTeam as addPokemonToTeam,
  discardPokemon,
  getCollection,
  removeFromTeam as removePokemonFromTeam,
  saveCapturedPokemon,
} from '@/integration/capturedPokemonStorage';

// Estado neutro compartilhado enquanto não há usuário autenticado ou nenhum dado
// foi carregado. Como o provider nunca muta este objeto, ele pode ser reutilizado
// com segurança para limpar a interface durante login, logout e falhas de leitura.
const EMPTY_COLLECTION: PokemonCollection = { captures: [], teamIds: [] };
const USE_DEMO_COLLECTION = Platform.OS === 'web';

function cloneCollection(collection: PokemonCollection): PokemonCollection {
  return {
    captures: collection.captures.map((capture) => ({
      ...capture,
      poderes: [...capture.poderes],
      tipos: [...capture.tipos],
      habilidades: capture.habilidades ? [...capture.habilidades] : undefined,
      location: capture.location ? { ...capture.location } : undefined,
    })),
    teamIds: [...collection.teamIds],
  };
}

function collectionForPlatform(collection: PokemonCollection): PokemonCollection {
  if (!USE_DEMO_COLLECTION || collection.captures.length) return collection;
  return cloneCollection(DEMO_COLLECTION);
}

// Contrato entregue às telas: oferece o documento completo, recortes convenientes,
// estado de carregamento, operações persistentes e consultas síncronas. Assim os
// consumidores não precisam conhecer AsyncStorage nem reconstruir o time por ids.
type CollectionContextData = {
  collection: PokemonCollection;
  captures: CapturedPokemon[];
  team: CapturedPokemon[];
  loading: boolean;
  capture: (
    pokemon: Pokemon,
    location?: CaptureLocation
  ) => Promise<CaptureResult>;
  discard: (id: string | number) => Promise<boolean>;
  addToTeam: (id: string | number) => Promise<AddToTeamResult>;
  removeFromTeam: (id: string | number) => Promise<boolean>;
  isCaptured: (id: string | number) => boolean;
  isInTeam: (id: string | number) => boolean;
  refresh: () => Promise<void>;
};

// `null` distingue corretamente a ausência do provider de uma coleção vazia válida
// e permite ao hook emitir um erro claro quando a árvore foi configurada incorretamente.
const CollectionContext = createContext<CollectionContextData | null>(null);

// Faz a ponte reativa entre autenticação, AsyncStorage e interface. O `userId` do
// AuthContext seleciona o documento; leituras alimentam `collection`; mutações são
// delegadas à integração e seguidas de nova leitura; por fim, valores derivados e
// ações estáveis são distribuídos para todas as telas descendentes.
export function CollectionProvider({ children }: { children: React.ReactNode }) {
  // Mudanças de autenticação são a entrada do fluxo e determinam qual coleção pode
  // ser lida ou alterada em cada momento.
  const { userId } = useAuth();
  // Conserva a identidade atual fora do fechamento de Promises. Se login, logout ou
  // troca de conta ocorrer durante uma leitura, respostas antigas não podem sobrescrever
  // a coleção do novo usuário nem desligar indevidamente seu indicador de loading.
  const activeUserId = useRef(userId);
  // É a fonte em memória para capturas, time derivado e consultas instantâneas da UI.
  const [collection, setCollection] = useState<PokemonCollection>(EMPTY_COLLECTION);
  // O primeiro render já sinaliza carregamento quando existe usuário; sem usuário,
  // não há operação pendente e o estado neutro pode ser exibido imediatamente.
  const [loading, setLoading] = useState(Boolean(userId));
  // A ref é sincronizada em cada render antes dos callbacks assíncronos consultá-la.
  activeUserId.current = userId;

  // Carrega o documento de uma identidade capturada pelo chamador. A ausência de id
  // limpa coleção e loading; para um id válido, só publica o resultado se aquela
  // identidade ainda for ativa ao fim da leitura, bloqueando respostas obsoletas.
  const loadCollection = useCallback(async (targetUserId: string | null) => {
    if (!targetUserId) {
      setCollection(EMPTY_COLLECTION);
      setLoading(false);
      return;
    }

    const nextCollection = collectionForPlatform(await getCollection(targetUserId));
    if (activeUserId.current === targetUserId) setCollection(nextCollection);
  }, []);

  // Permite recarregamento explícito pelas telas. A identidade é fotografada antes
  // da operação para que o bloco `finally` não desligue o loading de outra conta que
  // tenha assumido o provider enquanto a Promise anterior estava pendente.
  const refresh = useCallback(async () => {
    const targetUserId = activeUserId.current;
    setLoading(true);

    try {
      await loadCollection(targetUserId);
    } finally {
      if (activeUserId.current === targetUserId) setLoading(false);
    }
  }, [loadCollection]);

  // Este efeito conecta o ciclo de autenticação ao ciclo da coleção. Cada mudança de
  // `userId` inicia o estado correto: login carrega o treinador, logout limpa tudo e
  // troca de conta descarta resultados atrasados por meio da verificação da ref.
  useEffect(() => {
    setLoading(Boolean(userId));
    void loadCollection(userId)
      .catch((error) => {
        // Falhas são registradas para diagnóstico e convertem a conta ainda ativa em
        // estado vazio, evitando deixar na tela dados antigos como se fossem atuais.
        console.error('Erro ao carregar coleção:', error);
        if (activeUserId.current === userId) setCollection(EMPTY_COLLECTION);
      })
      .finally(() => {
        // Apenas a requisição pertencente ao usuário atual pode concluir o loading.
        if (activeUserId.current === userId) setLoading(false);
      });
  }, [loadCollection, userId]);

  // Centraliza o fluxo comum de todas as mutações: captura a conta ativa, rejeita a
  // ação sem autenticação, aguarda a gravação serializada no storage e então relê o
  // documento para atualizar a fonte em memória antes de devolver o resultado.
  const updateAfter = useCallback(
    async <T,>(operation: (targetUserId: string) => Promise<T>) => {
      const targetUserId = activeUserId.current;
      if (!targetUserId) throw new Error('Authentication is required.');

      const result = await operation(targetUserId);
      await loadCollection(targetUserId);
      return result;
    },
    [loadCollection]
  );

  const updateDemoAfter = useCallback(
    async <T,>(operation: (draft: PokemonCollection) => T) => {
      const draft = cloneCollection(collection);
      const result = operation(draft);
      setCollection(draft);
      return result;
    },
    [collection]
  );

  // Adapta a operação de captura ao fluxo comum, repassando Pokémon e localização
  // enquanto `updateAfter` injeta a identidade autenticada e sincroniza o estado.
  const capture = useCallback(
    (pokemon: Pokemon, location?: CaptureLocation) =>
      USE_DEMO_COLLECTION
        ? updateDemoAfter((draft) => {
            if (draft.captures.some((capture) => capture.index === pokemon.index)) {
              return 'duplicate' as CaptureResult;
            }

            draft.captures.push({
              ...pokemon,
              capturedAt: new Date().toISOString(),
              ...(location ? { location } : {}),
            });
            return 'created' as CaptureResult;
          })
        : updateAfter((targetUserId) =>
            saveCapturedPokemon(targetUserId, pokemon, location)
          ),
    [updateAfter, updateDemoAfter]
  );

  // Descarta pelo id e atualiza a coleção em memória com o documento já coerente,
  // incluindo a eventual remoção automática do integrante do time.
  const discard = useCallback(
    (id: string | number) =>
      USE_DEMO_COLLECTION
        ? updateDemoAfter((draft) => {
            const normalizedId = String(Number(id));
            const before = draft.captures.length;
            draft.captures = draft.captures.filter(
              (capture) => capture.index !== normalizedId
            );
            draft.teamIds = draft.teamIds.filter((teamId) => teamId !== normalizedId);
            return draft.captures.length !== before;
          })
        : updateAfter((targetUserId) => discardPokemon(targetUserId, id)),
    [updateAfter, updateDemoAfter]
  );

  // Adiciona uma captura ao time e preserva para o chamador o resultado detalhado
  // produzido pela integração, como time cheio ou integrante duplicado.
  const addToTeam = useCallback(
    (id: string | number) =>
      USE_DEMO_COLLECTION
        ? updateDemoAfter((draft) => {
            const normalizedId = String(Number(id));
            if (!draft.captures.some((capture) => capture.index === normalizedId)) {
              return 'not-captured' as AddToTeamResult;
            }
            if (draft.teamIds.includes(normalizedId)) {
              return 'duplicate' as AddToTeamResult;
            }
            if (draft.teamIds.length >= MAX_TEAM_SIZE) {
              return 'full' as AddToTeamResult;
            }

            draft.teamIds.push(normalizedId);
            return 'added' as AddToTeamResult;
          })
        : updateAfter((targetUserId) => addPokemonToTeam(targetUserId, id)),
    [updateAfter, updateDemoAfter]
  );

  // Remove somente a vaga no time e recarrega o documento, mantendo a captura na
  // Pokédex do treinador.
  const removeFromTeam = useCallback(
    (id: string | number) =>
      USE_DEMO_COLLECTION
        ? updateDemoAfter((draft) => {
            const normalizedId = String(Number(id));
            const before = draft.teamIds.length;
            draft.teamIds = draft.teamIds.filter((teamId) => teamId !== normalizedId);
            return draft.teamIds.length !== before;
          })
        : updateAfter((targetUserId) => removePokemonFromTeam(targetUserId, id)),
    [updateAfter, updateDemoAfter]
  );

  // Consulta síncrona usada pela UI para estados de botões e indicadores. A
  // conversão numérica aceita tanto ids canônicos do storage quanto ids de tela.
  const isCaptured = useCallback(
    (id: string | number) =>
      collection.captures.some((pokemon) => Number(pokemon.index) === Number(id)),
    [collection.captures]
  );

  // Verifica pertencimento ao time com a mesma equivalência numérica dos ids de
  // captura e só é recriada quando a lista persistida de vagas muda.
  const isInTeam = useCallback(
    (id: string | number) =>
      collection.teamIds.some((teamId) => Number(teamId) === Number(id)),
    [collection.teamIds]
  );

  // Indexa as capturas uma vez neste render para reconstruir os objetos do time sem
  // procurar linearmente a coleção para cada vaga.
  const capturesById = new Map(
    collection.captures.map((pokemon) => [pokemon.index, pokemon])
  );
  // O storage conserva somente ids para não duplicar dados. Aqui cada vaga é
  // substituída pela captura correspondente na mesma ordem; referências órfãs são
  // ignoradas defensivamente, embora o normalizador normalmente já as remova.
  const team = collection.teamIds.flatMap((id) => {
    const pokemon = capturesById.get(id);
    return pokemon ? [pokemon] : [];
  });

  // Publica estado persistido, projeções derivadas e ações como uma única interface.
  // Qualquer `setCollection` ou mudança de loading provoca novo valor e atualiza os
  // consumidores com uma visão coerente do usuário atualmente autenticado.
  return (
    <CollectionContext.Provider
      value={{
        collection,
        captures: collection.captures,
        team,
        loading,
        capture,
        discard,
        addToTeam,
        removeFromTeam,
        isCaptured,
        isInTeam,
        refresh,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

// Recupera a interface da coleção e falha cedo fora do provider. Isso transforma
// um erro de composição do layout em mensagem explícita, em vez de acessos nulos
// surgirem mais tarde em alguma tela consumidora.
export function useCollection() {
  const context = useContext(CollectionContext);
  if (!context) throw new Error('useCollection must be used within CollectionProvider.');
  return context;
}
