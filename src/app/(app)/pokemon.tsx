/*
 * Esta tela apresenta o catálogo completo da primeira geração.
 * Ela aparece na rota autenticada /pokemon do layout principal.
 * Busca, filtra e pagina Pokémon, exibindo detalhes e status de captura.
 */
// Hooks controlam carregamentos, filtros derivados e adaptação da grade à tela.
import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

// Tipos e componentes compartilhados compõem cartões, estados de conteúdo e navegação visual.
import { Pokemon } from '@/@types/pokemon';
import { Screen } from '@/components/screen';
import { Card } from '@/components/card';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { List } from '@/components/list';
import { DetailsModal } from '@/components/detailsModal';
import { Heading } from '@/components/heading';
import { StateCard } from '@/components/stateCard';
import { Colors } from '@/constants/colors';
import { TYPE_MAP } from '@/constants/pokemon';
// A coleção identifica quais itens do catálogo já pertencem ao usuário.
import { useCollection } from '@/context/CollectionContext';
// A integração separa o índice leve, o filtro por tipo e os detalhes completos da API.
import {
  getPokemonCatalog,
  getPokemonIdsByType,
  getPokemonsByIds,
  PokemonCatalogEntry,
} from '@/integration/pokemonIntegration';

// O tamanho fixo limita chamadas de detalhes e mantém a grade previsível por página.
const PAGE_SIZE = 12;
const GRID_CARD_WIDTH = 320;
const GRID_GAP = 16;
// A lista canônica permite oferecer todos os filtros com ordem estável e nomes traduzíveis.
const ALL_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
] as const;

export default function PokemonCatalog() {
  const { width } = useWindowDimensions();
  const { isCaptured } = useCollection();
  // Mais colunas são usadas somente quando cada cartão continua com espaço suficiente.
  const columns = width >= 1120 ? 3 : width >= 760 ? 2 : 1;
  const gridContentWidth = columns * GRID_CARD_WIDTH + (columns - 1) * GRID_GAP;

  // Primeiro grupo: índice geral e seu ciclo independente de carregamento/repetição.
  const [catalog, setCatalog] = useState<PokemonCatalogEntry[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(false);
  const [catalogRetry, setCatalogRetry] = useState(0);

  // Segundo grupo: escolhas de filtro e ids retornados pela consulta do tipo selecionado.
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [typeIds, setTypeIds] = useState<Set<number> | null>(null);
  const [typeLoading, setTypeLoading] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [typeRetry, setTypeRetry] = useState(0);

  // Terceiro grupo: página atual, detalhes exibidos e Pokémon aberto no modal.
  const [page, setPage] = useState(1);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState(false);
  const [pageRetry, setPageRetry] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  // Carrega o índice uma vez e novamente sob pedido; a flag evita atualizar uma tela desmontada.
  useEffect(() => {
    let active = true;
    setCatalogLoading(true);
    setCatalogError(false);

    void getPokemonCatalog()
      .then((entries) => {
        if (active) setCatalog(entries);
      })
      .catch(() => {
        if (active) setCatalogError(true);
      })
      .finally(() => {
        if (active) setCatalogLoading(false);
      });

    return () => {
      active = false;
    };
  }, [catalogRetry]);

  // Busca ids do tipo apenas quando há filtro, pois "todos" já usa diretamente o catálogo.
  useEffect(() => {
    let active = true;

    if (selectedType === 'all') {
      setTypeIds(null);
      setTypeLoading(false);
      setTypeError(false);
      return () => {
        active = false;
      };
    }

    setTypeIds(null);
    setTypeLoading(true);
    setTypeError(false);

    void getPokemonIdsByType(selectedType)
      .then((ids) => {
        if (active) setTypeIds(ids);
      })
      .catch(() => {
        if (active) setTypeError(true);
      })
      .finally(() => {
        if (active) setTypeLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedType, typeRetry]);

  // Combina busca textual/numérica e tipo antes de paginar, garantindo contagens corretas.
  const filteredCatalog = useMemo(() => {
    const query = search.trim().toLowerCase();
    const numericQuery = /^\d+$/.test(query) ? Number(query) : null;

    return catalog.filter((entry) => {
      const matchesType = selectedType === 'all' || typeIds?.has(entry.id);
      const matchesSearch = !query
        ? true
        : numericQuery !== null
          ? entry.id === numericQuery
          : entry.name.toLowerCase().includes(query);
      return matchesType && matchesSearch;
    });
  }, [catalog, search, selectedType, typeIds]);

  // Estes valores derivados recortam a página e criam uma chave estável para buscar detalhes.
  const pageCount = Math.ceil(filteredCatalog.length / PAGE_SIZE);
  const pageEntries = useMemo(
    () => filteredCatalog.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredCatalog, page]
  );
  const pageIds = useMemo(() => pageEntries.map((entry) => entry.id), [pageEntries]);
  const pageIdsKey = pageIds.join(',');

  // Só busca objetos completos para os ids visíveis, reduzindo tráfego e tempo de renderização.
  useEffect(() => {
    let active = true;

    // Sem uma página válida, limpa resultados antigos para não exibir dados incompatíveis com o filtro.
    if (!pageIds.length || catalogLoading || typeLoading || catalogError || typeError) {
      setPokemons([]);
      setPageLoading(false);
      setPageError(false);
      return () => {
        active = false;
      };
    }

    setPokemons([]);
    setPageLoading(true);
    setPageError(false);

    void getPokemonsByIds(pageIds)
      .then((details) => {
        if (active) setPokemons(details);
      })
      .catch(() => {
        if (active) setPageError(true);
      })
      .finally(() => {
        if (active) setPageLoading(false);
      });

    return () => {
      active = false;
    };
  }, [pageIdsKey, pageRetry, catalogLoading, typeLoading, catalogError, typeError]);

  // Alterar qualquer filtro volta à primeira página para impedir uma página fora do novo resultado.
  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const changeType = (type: string) => {
    setSelectedType(type);
    setPage(1);
  };

  // O selo acrescenta contexto de coleção sem alterar o componente genérico de cartão.
  const renderPokemonCard = (pokemon: Pokemon) => {
    const captured = isCaptured(pokemon.index);

    return (
      <View style={styles.cardShell}>
        {captured ? (
          <View style={styles.capturedBadge}>
            <Text style={styles.capturedBadgeText}>Capturado</Text>
          </View>
        ) : null}
        <Card
          pokemon={pokemon}
          onPressDetails={setSelectedPokemon}
        />
      </View>
    );
  };

  // Estados derivados consolidam as três etapas assíncronas para simplificar as decisões do JSX.
  const waiting = catalogLoading || typeLoading || pageLoading;
  const requestFailed = catalogError || typeError || pageError;
  const empty = !waiting && !requestFailed && filteredCatalog.length === 0;
  const firstResult = filteredCatalog.length ? (page - 1) * PAGE_SIZE + 1 : 0;
  const lastResult = Math.min(page * PAGE_SIZE, filteredCatalog.length);

  // Repete somente a etapa que falhou, evitando refazer chamadas anteriores bem-sucedidas.
  const retry = () => {
    if (catalogError) setCatalogRetry((value) => value + 1);
    else if (typeError) setTypeRetry((value) => value + 1);
    else setPageRetry((value) => value + 1);
  };

  return (
    <Screen>
      <Header />

      <List
        data={pokemons}
        columns={columns}
        renderItemContent={renderPokemonCard}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <View style={styles.catalogHeader}>
            <Heading
              title="Catálogo"
              subtitle="Explore os 151 Pokémon da primeira geração"
              style={styles.heading}
            />

            {/* Busca e tipo trabalham juntos e alimentam o mesmo catálogo filtrado. */}
            <View style={[styles.filtersCard, { maxWidth: gridContentWidth }]}>
              <Text style={styles.filterLabel}>Buscar por nome ou número</Text>
              <TextInput
                value={search}
                onChangeText={changeSearch}
                placeholder="Ex.: pikachu ou 25"
                placeholderTextColor={Colors.placeholder}
                style={styles.searchInput}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                accessibilityLabel="Buscar Pokémon por nome ou número"
              />

              <Text style={[styles.filterLabel, styles.typeLabel]}>Filtrar por tipo</Text>
              {/* Cada opção informa também seu estado selecionado para tecnologias assistivas. */}
              <View style={styles.typeFilters}>
                {['all', ...ALL_TYPES].map((type) => {
                  const active = selectedType === type;
                  return (
                    <Pressable
                      key={type}
                      onPress={() => changeType(type)}
                      style={({ pressed }) => [
                        styles.typeButton,
                        active && styles.typeButtonActive,
                        pressed && styles.pressed,
                      ]}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                    >
                      <Text style={[styles.typeButtonText, active && styles.typeButtonTextActive]}>
                        {type === 'all' ? 'Todos' : TYPE_MAP[type] ?? type}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* O resumo só aparece quando há um conjunto confiável de resultados para contar. */}
            {!catalogLoading && !typeLoading && !requestFailed && !empty ? (
              <Text style={styles.resultSummary}>
                Exibindo {firstResult}-{lastResult} de {filteredCatalog.length}
              </Text>
            ) : null}

            {/* Carregamento, falha e vazio são estados exclusivos que orientam a próxima ação. */}
            {waiting ? (
              <StateCard
                message={pageLoading ? 'Carregando esta página...' : 'Preparando o catálogo...'}
                loading
                style={styles.stateCard}
              />
            ) : null}

            {requestFailed ? (
              <StateCard
                title="Não foi possível carregar o catálogo"
                message="Confira sua conexão e tente novamente."
                tone="error"
                action={{ title: 'Tentar novamente', onPress: retry }}
                style={styles.stateCard}
              />
            ) : null}

            {empty ? (
              <StateCard
                title="Nenhum Pokémon encontrado"
                message="Tente outro nome, número ou combinação de tipo."
                style={styles.stateCard}
              />
            ) : null}
          </View>
        }
        ListFooterComponent={
          <>
            {/* A paginação só é necessária quando existe mais de uma página utilizável. */}
            {pageCount > 1 && !waiting && !requestFailed ? (
              <View style={styles.pagination}>
                <Pressable
                  onPress={() => setPage((value) => Math.max(1, value - 1))}
                  disabled={page === 1}
                  style={({ pressed }) => [
                    styles.pageDirection,
                    page === 1 && styles.pageButtonDisabled,
                    pressed && page !== 1 && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: page === 1 }}
                >
                  <Text style={styles.pageDirectionText}>Anterior</Text>
                </Pressable>

                <View style={styles.pageNumbers}>
                  {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                    (pageNumber) => (
                      <Pressable
                        key={pageNumber}
                        onPress={() => setPage(pageNumber)}
                        style={({ pressed }) => [
                          styles.pageNumber,
                          pageNumber === page && styles.pageNumberActive,
                          pressed && styles.pressed,
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={`Página ${pageNumber}`}
                        accessibilityState={{ selected: pageNumber === page }}
                      >
                        <Text
                          style={[
                            styles.pageNumberText,
                            pageNumber === page && styles.pageNumberTextActive,
                          ]}
                        >
                          {pageNumber}
                        </Text>
                      </Pressable>
                    )
                  )}
                </View>

                <Pressable
                  onPress={() => setPage((value) => Math.min(pageCount, value + 1))}
                  disabled={page === pageCount}
                  style={({ pressed }) => [
                    styles.pageDirection,
                    page === pageCount && styles.pageButtonDisabled,
                    pressed && page !== pageCount && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: page === pageCount }}
                >
                  <Text style={styles.pageDirectionText}>Próxima</Text>
                </Pressable>
              </View>
            ) : null}
            <Footer />
          </>
        }
      />

      {/* O modal mantém o catálogo ao fundo e adapta a ação ao status de captura. */}
      <DetailsModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
        actions={
          selectedPokemon && isCaptured(selectedPokemon.index)
            ? [{ label: 'Pokémon capturado', onPress: () => undefined, disabled: true }]
            : []
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  // Cabeçalho da lista e painel que agrupa os controles de busca e tipo.
  scrollContent: {
    paddingBottom: 0,
  },
  catalogHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 22,
  },
  heading: {
    marginBottom: 22,
  },
  filtersCard: {
    width: '100%',
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    borderRadius: 24,
    backgroundColor: Colors.alpha.white94,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 3,
  },
  // Rótulos e entrada de pesquisa estabelecem a hierarquia do formulário de filtro.
  filterLabel: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  typeLabel: {
    marginTop: 18,
  },
  searchInput: {
    width: '100%',
    minHeight: 48,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    borderRadius: 14,
    backgroundColor: Colors.inputBackground,
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  // Filtros em formato de pílula quebram linha e destacam somente a seleção ativa.
  typeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 999,
    backgroundColor: Colors.inputBackground,
  },
  typeButtonActive: {
    borderColor: Colors.title,
    backgroundColor: Colors.title,
  },
  typeButtonText: {
    color: Colors.label,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  typeButtonTextActive: {
    color: Colors.white,
  },
  // Resumo e cartões de estado ficam separados dos controles para leitura imediata.
  resultSummary: {
    marginTop: 18,
    color: Colors.subtitle,
    fontSize: 14,
    fontWeight: '800',
  },
  stateCard: {
    marginTop: 24,
  },
  // Invólucro e selo posicionam o status de captura sobre cada cartão sem alterar seu layout interno.
  cardShell: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  capturedBadge: {
    position: 'absolute',
    top: 10,
    right: 8,
    zIndex: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: Colors.semantic.success.border,
    borderRadius: 999,
    backgroundColor: Colors.semantic.success.bg,
  },
  capturedBadgeText: {
    color: Colors.semantic.success.text,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  // Paginação agrupa direções e números, permitindo quebra de linha em telas menores.
  pagination: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  pageNumbers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  pageDirection: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
    backgroundColor: Colors.white,
  },
  pageDirectionText: {
    color: Colors.label,
    fontSize: 13,
    fontWeight: '900',
  },
  pageNumber: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 12,
    backgroundColor: Colors.white,
  },
  pageNumberActive: {
    borderColor: Colors.title,
    backgroundColor: Colors.title,
  },
  pageNumberText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  pageNumberTextActive: {
    color: Colors.white,
  },
  pageButtonDisabled: {
    opacity: 0.4,
  },
  // Opacidade fornece retorno de toque comum a todos os controles pressionáveis.
  pressed: {
    opacity: 0.72,
  },
});
