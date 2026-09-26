import axios from 'axios';
import { Pokemon } from '../@types/pokemon';

const pokeApi = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
});

const pokemonCache = new Map<number, Pokemon[]>();

const mapPokeApiPokemon = (data: any): Pokemon => ({
  nome: data.name,
  index: data.id.toString().padStart(3, '0'),
  tipos: data.types.map((t: any) => t.type.name),
  imagem:
    data.sprites?.other?.['official-artwork']?.front_default ||
    data.sprites?.front_default,
  altura: data.height,
  peso: data.weight,
  habilidades: data.abilities.map((ability: any) => ability.ability.name),
  poderes: data.stats.map((s: any) => ({
    nome: s.stat.name,
    forca: s.base_stat,
  })),
});

export const getPokemons = async (limit = 151): Promise<Pokemon[]> => {
  const cached = pokemonCache.get(limit);

  if (cached) {
    return cached;
  }

  const response = await pokeApi.get(`/pokemon?limit=${limit}`);
  const list = response.data.results;

  const detailedList = await Promise.all(
    list.map(async (pokemon: { url: string }) => {
      const detailRes = await axios.get(pokemon.url);
      const data = detailRes.data;

      return mapPokeApiPokemon(data);
    })
  );

  pokemonCache.set(limit, detailedList);

  return detailedList;
};

export const getPokemonById = async (id: number): Promise<Pokemon> => {
  const response = await pokeApi.get(`/pokemon/${id}`);

  return mapPokeApiPokemon(response.data);
};
