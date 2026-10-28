/*
 * Esta integração fornece os dados de Pokémon da primeira geração.
 * Ela é consumida pelas telas de catálogo, detalhes e filtros.
 * Ela consulta a PokeAPI, normaliza respostas e reutiliza dados em cache.
 */
import axios from 'axios';
import { Pokemon } from '@/@types/pokemon';

// Delimita o catálogo à primeira geração e serve também como limite comum das
// validações, consultas e filtros feitos neste módulo.
const KANTO_LIMIT = 151;

// Cliente dedicado às requisições de catálogo, detalhes e filtro por tipo. A URL
// base evita repetição e deixa explícito que esta integração consulta a PokeAPI,
// sem qualquer relação com a coleção persistida localmente.
const pokeApi = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
});

// Entrada mínima do catálogo, suficiente para montar listas antes de baixar os
// detalhes mais pesados de cada Pokémon.
export type PokemonCatalogEntry = {
  id: number;
  name: string;
};

// Descreve somente os campos da resposta externa usados pelo normalizador. Essa
// fronteira conserva os nomes originais da PokeAPI até sua conversão para `Pokemon`.
type PokeApiPokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
  sprites: {
    front_default: string | null;
    other?: { 'official-artwork'?: { front_default: string | null } };
  };
  stats: { base_stat: number; stat: { name: string } }[];
  types: { type: { name: string } }[];
};

// Cacheia o catálogo concluído durante a vida do processo, evitando repetir a
// mesma requisição quando mais de uma tela precisa listar a primeira geração.
let catalogCache: PokemonCatalogEntry[] | null = null;
// Guarda também a Promise em andamento: chamadas concorrentes compartilham uma
// única requisição em vez de iniciarem downloads idênticos antes do cache existir.
let catalogRequest: Promise<PokemonCatalogEntry[]> | null = null;
// Os detalhes concluídos são indexados pelo id numérico para reaproveitamento
// imediato em listas, modais e telas visitadas posteriormente.
const pokemonCache = new Map<number, Pokemon>();
// Requisições de detalhes ainda pendentes são separadas por id, deduplicando só
// chamadas ao mesmo Pokémon sem bloquear downloads de espécies diferentes.
const pokemonRequests = new Map<number, Promise<Pokemon>>();
// Cada tipo consultado guarda o conjunto de ids de Kanto associado a ele. `Set`
// oferece testes de pertencimento eficientes durante a filtragem do catálogo.
const typeCache = new Map<string, Set<number>>();

// Normaliza a resposta detalhada da PokeAPI para o modelo interno em português.
// Além de remodelar listas aninhadas, prioriza a arte oficial, usa o sprite comum
// como fallback e padroniza o índice com três dígitos para apresentação nas telas.
const mapPokeApiPokemon = (data: PokeApiPokemon): Pokemon => ({
  nome: data.name,
  index: data.id.toString().padStart(3, '0'),
  tipos: data.types.map((item) => item.type.name),
  imagem:
    data.sprites.other?.['official-artwork']?.front_default ||
    data.sprites.front_default ||
    '',
  altura: data.height,
  peso: data.weight,
  habilidades: data.abilities.map((ability) => ability.ability.name),
  poderes: data.stats.map((stat) => ({
    nome: stat.stat.name,
    forca: stat.base_stat,
  })),
});

// Obtém a relação leve dos 151 Pokémon. Primeiro atende pelo cache concluído e,
// depois, pela Promise compartilhada; somente a primeira chamada efetivamente faz
// a requisição de rede e transforma a posição da resposta no id sequencial de Kanto.
export async function getPokemonCatalog(): Promise<PokemonCatalogEntry[]> {
  if (catalogCache) return catalogCache;
  // Enquanto a lista está sendo baixada, outras telas aguardam a mesma Promise.
  if (catalogRequest) return catalogRequest;

  catalogRequest = pokeApi
    .get<{ results: { name: string; url: string }[] }>(
      `/pokemon?limit=${KANTO_LIMIT}`
    )
    .then((response) =>
      response.data.results.map((pokemon, index) => ({
        id: index + 1,
        name: pokemon.name,
      }))
    )
    .then((catalog) => {
      // O cache só recebe uma resposta transformada com sucesso; falhas continuam
      // disponíveis para nova tentativa em uma chamada futura.
      catalogCache = catalog;
      return catalog;
    })
    .finally(() => {
      // Libera a referência pendente tanto em sucesso quanto em erro. O catálogo
      // concluído permanece no cache separado quando a operação foi bem-sucedida.
      catalogRequest = null;
    });

  return catalogRequest;
}

// Busca e normaliza os detalhes de uma espécie. A validação impede URLs fora do
// recorte do projeto; os dois níveis de cache evitam tanto chamadas já concluídas
// quanto chamadas concorrentes duplicadas para o mesmo id.
export async function getPokemonById(id: number): Promise<Pokemon> {
  if (!Number.isInteger(id) || id < 1 || id > KANTO_LIMIT) {
    throw new Error('O Pokémon deve pertencer à primeira geração.');
  }

  const cached = pokemonCache.get(id);
  if (cached) return cached;

  const pending = pokemonRequests.get(id);
  if (pending) return pending;

  const request = pokeApi
    .get<PokeApiPokemon>(`/pokemon/${id}`)
    .then((response) => mapPokeApiPokemon(response.data))
    .then((pokemon) => {
      // Só publica no cache permanente o modelo interno produzido com sucesso.
      pokemonCache.set(id, pokemon);
      return pokemon;
    })
    .finally(() => {
      // A Promise deixa de ser considerada pendente mesmo se a rede falhar, o que
      // permite que uma próxima ação do usuário tente novamente.
      pokemonRequests.delete(id);
    });

  pokemonRequests.set(id, request);
  return request;
}

// Resolve vários detalhes em paralelo e preserva a ordem recebida, delegando a
// cada id toda a validação e deduplicação já implementada em `getPokemonById`.
export async function getPokemonsByIds(ids: number[]): Promise<Pokemon[]> {
  return Promise.all(ids.map(getPokemonById));
}

// Consulta as espécies relacionadas a um tipo e extrai seus ids das URLs da API.
// O resultado é restrito a Kanto antes de ser cacheado, pois a PokeAPI também
// devolve gerações posteriores e essas espécies não pertencem ao catálogo do app.
export async function getPokemonIdsByType(type: string): Promise<Set<number>> {
  const cached = typeCache.get(type);
  if (cached) return cached;

  const response = await pokeApi.get<{
    pokemon: { pokemon: { url: string } }[];
  }>(`/type/${type}`);
  // A expressão regular lê apenas URLs canônicas de Pokémon; conversões inválidas
  // viram `NaN` e são removidas junto com ids fora do intervalo permitido.
  const ids = new Set(
    response.data.pokemon
      .map(({ pokemon }) => Number(pokemon.url.match(/\/pokemon\/(\d+)\/?$/)?.[1]))
      .filter((id) => Number.isInteger(id) && id >= 1 && id <= KANTO_LIMIT)
  );

  typeCache.set(type, ids);
  return ids;
}

// Atalho para carregar uma faixa inicial do catálogo detalhado. O limite é
// restringido entre 1 e 151 e a sequência gerada começa em 1, nunca no índice zero.
export async function getPokemons(limit = KANTO_LIMIT): Promise<Pokemon[]> {
  const size = Math.min(Math.max(limit, 1), KANTO_LIMIT);
  return getPokemonsByIds(Array.from({ length: size }, (_, index) => index + 1));
}
