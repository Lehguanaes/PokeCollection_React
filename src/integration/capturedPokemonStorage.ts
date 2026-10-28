/*
 * Esta integração persiste a coleção individual de cada treinador.
 * Ela é consumida pelo CollectionContext e por consultas de capturas.
 * Ela valida, serializa e atualiza capturas e equipes no armazenamento local.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AddToTeamResult,
  CaptureLocation,
  CaptureResult,
  CapturedPokemon,
  MAX_TEAM_SIZE,
  PokemonCollection,
} from '@/@types/collection';
import { Pokemon } from '@/@types/pokemon';

// Namespace estável das coleções no AsyncStorage. O id do usuário é anexado a
// este prefixo por `storageKey`, produzindo um documento independente por conta.
const STORAGE_KEY_PREFIX = '@poke-collection/collection/';
// Mantém uma fila de Promises para cada chave de armazenamento. Como toda mutação
// faz leitura, alteração e escrita, duas operações simultâneas poderiam ler o
// mesmo JSON e a última escrita apagar a primeira; o encadeamento evita essa corrida.
const mutationQueues = new Map<string, Promise<void>>();

// Cria um novo documento sem compartilhar arrays mutáveis entre chamadas. É o
// estado seguro para usuários sem dados e para documentos ilegíveis ou inválidos.
function emptyCollection(): PokemonCollection {
  return { captures: [], teamIds: [] };
}

// Constrói a chave exclusiva de um treinador. O `trim` impede que diferenças
// acidentais de espaços criem coleções distintas; a rejeição do valor vazio evita
// uma chave global sem dono; e `encodeURIComponent` neutraliza barras e caracteres
// especiais para que o id permaneça apenas o segmento final do namespace.
function storageKey(userId: string) {
  const normalizedUserId = userId.trim();

  if (!normalizedUserId) {
    throw new Error('A userId is required to access a collection.');
  }

  return `${STORAGE_KEY_PREFIX}${encodeURIComponent(normalizedUserId)}`;
}

// Valida e canoniza qualquer candidato a id. Strings e números são convertidos
// para número inteiro, limitados à primeira geração e devolvidos como string sem
// zeros à esquerda, garantindo comparações estáveis entre API, coleção e time.
function pokemonId(value: unknown): string | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null;

  const id = Number(value);
  return Number.isInteger(id) && id >= 1 && id <= 151 ? String(id) : null;
}

// Trata localização persistida como dado não confiável. O objeto só é mantido
// quando latitude, longitude e timestamp são números finitos e `accuracy` é um
// número finito ou `null`; qualquer estrutura parcial ou corrompida é descartada
// por inteiro para não expor coordenadas incoerentes às telas.
function normalizeLocation(value: unknown): CaptureLocation | undefined {
  if (!value || typeof value !== 'object') return undefined;

  const location = value as Partial<CaptureLocation>;
  // Agrupa os campos numéricos obrigatórios para aplicar a mesma regra de
  // finitude, rejeitando inclusive `NaN` e infinitos aceitos pelo tipo `number`.
  const fields = [location.latitude, location.longitude, location.timestamp];

  if (
    !fields.every((field) => typeof field === 'number' && Number.isFinite(field)) ||
    (location.accuracy !== null &&
      (typeof location.accuracy !== 'number' || !Number.isFinite(location.accuracy)))
  ) {
    return undefined;
  }

  return {
    // Após a guarda acima, as asserções apenas comunicam ao TypeScript que estes
    // membros opcionais do `Partial` já foram comprovados como números válidos.
    latitude: location.latitude as number,
    longitude: location.longitude as number,
    accuracy: location.accuracy ?? null,
    timestamp: location.timestamp as number,
  };
}

// Converte uma entrada arbitrária do array persistido em uma captura confiável.
// Campos estruturais inválidos eliminam a entrada inteira; listas e campos
// opcionais são saneados separadamente para recuperar o máximo seguro de JSONs
// antigos sem deixar formatos inesperados atravessarem a fronteira do storage.
function normalizeCapture(value: unknown): CapturedPokemon | null {
  if (!value || typeof value !== 'object') return null;

  const capture = value as Partial<CapturedPokemon>;
  const id = pokemonId(capture.index);
  // Datas parseáveis são reemitidas em ISO, tornando comparações e exibição
  // consistentes mesmo que uma versão anterior tenha salvo outro formato válido.
  const capturedAt =
    typeof capture.capturedAt === 'string' &&
    !Number.isNaN(Date.parse(capture.capturedAt))
      ? new Date(capture.capturedAt).toISOString()
      : null;

  if (
    !id ||
    !capturedAt ||
    typeof capture.nome !== 'string' ||
    typeof capture.imagem !== 'string' ||
    !Array.isArray(capture.tipos) ||
    !Array.isArray(capture.poderes)
  ) {
    // Identidade, data e conteúdo visual básico são indispensáveis para uma
    // captura utilizável; a ausência deles faz a entrada ser ignorada.
    return null;
  }

  const location = normalizeLocation(capture.location);
  // Reconstrói o objeto em vez de espalhar o valor original, garantindo que
  // propriedades desconhecidas ou valores não validados não voltem ao documento.
  const normalized: CapturedPokemon = {
    index: id,
    nome: capture.nome,
    imagem: capture.imagem,
    tipos: capture.tipos.filter((type): type is string => typeof type === 'string'),
    // Cada poder precisa ter nome textual e força numérica finita. `flatMap`
    // simultaneamente descarta entradas ruins e remodela as aprovadas.
    poderes: capture.poderes.flatMap((power) => {
      if (
        !power ||
        typeof power !== 'object' ||
        typeof power.nome !== 'string' ||
        typeof power.forca !== 'number' ||
        !Number.isFinite(power.forca)
      ) {
        return [];
      }

      return [{ nome: power.nome, forca: power.forca }];
    }),
    capturedAt,
  };

  // Medidas são opcionais no domínio, mas, quando presentes no JSON, só entram no
  // modelo se forem números finitos para impedir `NaN` e infinitos persistidos.
  if (typeof capture.altura === 'number' && Number.isFinite(capture.altura)) {
    normalized.altura = capture.altura;
  }
  if (typeof capture.peso === 'number' && Number.isFinite(capture.peso)) {
    normalized.peso = capture.peso;
  }
  // A lista opcional de habilidades é preservada, removendo elementos que não
  // sejam texto em vez de invalidar toda a captura por um item isolado.
  if (Array.isArray(capture.habilidades)) {
    normalized.habilidades = capture.habilidades.filter(
      (ability): ability is string => typeof ability === 'string'
    );
  }

  // A localização só é anexada quando passou integralmente por sua validação;
  // capturas continuam válidas sem ela porque geolocalização não é obrigatória.
  if (location) normalized.location = location;

  return normalized;
}

// Normaliza o documento completo e restabelece suas invariantes: capturas válidas
// e únicas, ids canônicos, time composto somente por capturados, sem repetições e
// limitado a seis vagas. Qualquer raiz que não seja objeto vira coleção vazia.
function normalizeCollection(value: unknown): PokemonCollection {
  if (!value || typeof value !== 'object') return emptyCollection();

  const document = value as Partial<PokemonCollection>;
  const captures: CapturedPokemon[] = [];
  // O conjunto acompanha ids já aceitos para eliminar duplicatas sem alterar a
  // ordem da primeira ocorrência válida no documento original.
  const capturedIds = new Set<string>();

  if (Array.isArray(document.captures)) {
    for (const value of document.captures) {
      const capture = normalizeCapture(value);
      if (!capture || capturedIds.has(capture.index)) continue;

      capturedIds.add(capture.index);
      captures.push(capture);
    }
  }

  const teamIds: string[] = [];
  // Um segundo conjunto preserva a ordem das vagas enquanto impede que a mesma
  // espécie ocupe mais de uma posição no time.
  const teamIdSet = new Set<string>();

  if (Array.isArray(document.teamIds)) {
    for (const value of document.teamIds) {
      const id = pokemonId(value);
      if (
        !id ||
        !capturedIds.has(id) ||
        teamIdSet.has(id) ||
        teamIds.length >= MAX_TEAM_SIZE
      ) {
        // Entradas inválidas, não capturadas, repetidas ou além da capacidade são
        // ignoradas individualmente para que as demais vagas ainda sejam recuperadas.
        continue;
      }

      teamIdSet.add(id);
      teamIds.push(id);
    }
  }

  return { captures, teamIds };
}

// Lê e saneia uma coleção pela chave já construída. A ausência de valor equivale
// ao estado inicial; JSON malformado é tratado como documento inválido em vez de
// lançar durante a inicialização da interface.
async function readCollection(key: string): Promise<PokemonCollection> {
  // Esta é a leitura de rede local do AsyncStorage; ela ocorre dentro da mesma
  // fila das escritas para nunca observar uma mutação parcialmente encadeada.
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) return emptyCollection();

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // O normalizador abaixo converte `null` na coleção vazia e a regrava, reparando
    // automaticamente conteúdo que deixou de ser JSON válido.
    parsed = null;
  }

  const collection = normalizeCollection(parsed);
  const normalizedRaw = JSON.stringify(collection);

  // Regrava apenas quando a representação normalizada difere da original. Isso
  // migra e limpa dados antigos uma vez, para que leituras seguintes já encontrem
  // o documento canônico, sem escritas desnecessárias quando nada mudou.
  if (normalizedRaw !== raw) {
    await AsyncStorage.setItem(key, normalizedRaw);
  }

  return collection;
}

// Serializa leituras reparadoras e mutações que apontam para a mesma chave, mas
// permite paralelismo entre usuários diferentes. A Promise anterior é convertida
// em sucesso mesmo quando falhou, pois uma operação antiga não deve bloquear para
// sempre as seguintes; o resultado original ainda é devolvido ao seu chamador.
function serialize<T>(key: string, operation: () => Promise<T>): Promise<T> {
  const previous = mutationQueues.get(key) ?? Promise.resolve();
  const result = previous.catch(() => undefined).then(operation);
  // A fila guarda uma Promise sem valor e sem rejeição: ela representa somente o
  // término da vaga atual, enquanto `result` conserva valor ou erro da operação.
  const queue = result.then(
    () => undefined,
    () => undefined
  );

  mutationQueues.set(key, queue);
  // Remove filas ociosas para o mapa não crescer indefinidamente. A comparação
  // protege contra apagar uma fila mais nova que tenha sido anexada nesse intervalo.
  void queue.finally(() => {
    if (mutationQueues.get(key) === queue) mutationQueues.delete(key);
  });

  return result;
}

// Implementa a transação local comum a captura, descarte e gestão do time: cria a
// chave isolada do usuário, espera sua fila, lê o documento normalizado, aplica a
// alteração síncrona no objeto e persiste o estado completo antes de devolver o
// resultado. Assim, o chamador só recebe sucesso depois de a escrita terminar.
async function mutateCollection<T>(
  userId: string,
  mutation: (collection: PokemonCollection) => T
): Promise<T> {
  const key = storageKey(userId);

  return serialize(key, async () => {
    const collection = await readCollection(key);
    const result = mutation(collection);
    await AsyncStorage.setItem(key, JSON.stringify(collection));
    return result;
  });
}

// Recupera a coleção integral de um usuário. A leitura entra na fila porque pode
// reparar o JSON e porque deve esperar mutações anteriores da mesma conta.
export async function getCollection(userId: string): Promise<PokemonCollection> {
  const key = storageKey(userId);
  return serialize(key, () => readCollection(key));
}

// Oferece às telas interessadas apenas nas capturas um recorte da coleção já
// validada, reutilizando todas as garantias de chave, fila e normalização.
export async function getCapturedPokemons(
  userId: string
): Promise<CapturedPokemon[]> {
  return (await getCollection(userId)).captures;
}

// Registra uma espécie na coleção do treinador. A operação valida novamente o id
// vindo do modelo externo, impede duplicação e grava o instante atual; localização
// inválida é simplesmente omitida, mantendo a captura funcional e consistente.
export async function saveCapturedPokemon(
  userId: string,
  pokemon: Pokemon,
  location?: CaptureLocation
): Promise<CaptureResult> {
  return mutateCollection(userId, (collection) => {
    const id = pokemonId(pokemon.index);
    if (!id) throw new Error('The Pokemon must have a valid index.');

    // A coleção representa espécies conquistadas, portanto uma segunda captura do
    // mesmo id retorna um desfecho esperado sem modificar data ou dados existentes.
    if (collection.captures.some((capture) => capture.index === id)) {
      return 'duplicate';
    }

    const normalizedLocation = normalizeLocation(location);
    // O spread conserva os dados já normalizados pela integração da PokeAPI, mas o
    // id canônico, o instante da captura e a localização validada são controlados aqui.
    collection.captures.push({
      ...pokemon,
      index: id,
      capturedAt: new Date().toISOString(),
      ...(normalizedLocation ? { location: normalizedLocation } : {}),
    });

    return 'created';
  });
}

// Descarta uma captura pelo id flexível usado pelas telas. Id inválido ou espécie
// ausente retorna `false` sem alterar o documento; uma remoção efetiva também limpa
// sua vaga no time para preservar a regra de que todo integrante deve estar capturado.
export async function discardPokemon(
  userId: string,
  id: string | number
): Promise<boolean> {
  return mutateCollection(userId, (collection) => {
    const normalizedId = pokemonId(id);
    if (!normalizedId) return false;

    const captureIndex = collection.captures.findIndex(
      (capture) => capture.index === normalizedId
    );
    if (captureIndex === -1) return false;

    collection.captures.splice(captureIndex, 1);
    // A filtragem também seria segura diante de dados antigos repetidos, removendo
    // todas as referências e mantendo o time coerente com a coleção restante.
    collection.teamIds = collection.teamIds.filter(
      (teamId) => teamId !== normalizedId
    );
    return true;
  });
}

// Adiciona ao final do time, preservando a ordem das vagas. A sequência de guardas
// diferencia os resultados que a interface precisa explicar: captura inexistente,
// integrante repetido e capacidade máxima antes de efetivar a inclusão.
export async function addToTeam(
  userId: string,
  id: string | number
): Promise<AddToTeamResult> {
  return mutateCollection(userId, (collection) => {
    const normalizedId = pokemonId(id);

    if (
      !normalizedId ||
      !collection.captures.some((capture) => capture.index === normalizedId)
    ) {
      return 'not-captured';
    }
    if (collection.teamIds.includes(normalizedId)) return 'duplicate';
    // O limite compartilhado impede um sétimo integrante conforme as regras
    // clássicas e permanece alinhado ao saneamento executado durante as leituras.
    if (collection.teamIds.length >= MAX_TEAM_SIZE) return 'full';

    collection.teamIds.push(normalizedId);
    return 'added';
  });
}

// Remove uma espécie do time sem descartá-la da coleção. A função é idempotente do
// ponto de vista dos dados: ids inválidos ou ausentes retornam `false`, enquanto uma
// remoção real persiste o novo array e informa `true` ao chamador.
export async function removeFromTeam(
  userId: string,
  id: string | number
): Promise<boolean> {
  return mutateCollection(userId, (collection) => {
    const normalizedId = pokemonId(id);
    if (!normalizedId || !collection.teamIds.includes(normalizedId)) return false;

    collection.teamIds = collection.teamIds.filter(
      (teamId) => teamId !== normalizedId
    );
    return true;
  });
}
