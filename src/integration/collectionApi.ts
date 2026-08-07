import axios from 'axios';
import { Pokemon } from '../@types/pokemon';

const DEFAULT_POKEMON_API_URL =
  'https://lnh1dhp1mj.execute-api.us-east-1.amazonaws.com/api-pokemon';

const collectionApi = axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_POKEMON_API_URL?.replace(/\/$/, '') ||
    DEFAULT_POKEMON_API_URL,
});

export type PokemonProfileResponse = {
  userId: string;
};

export type ProfileStats = {
  userId: string;
  username: string;
  level: number;
  vitorias: number;
  derrotas: number;
};

type ApiPokemon = {
  index: string;
  name: string;
  image: string;
  types: string[];
  abilities: {
    name: string;
    strength: number;
  }[];
};

type TeamResponse = {
  id: string;
  userId: string;
  team: ApiPokemon[];
  capture: ApiPokemon[];
};

const mapApiPokemon = (pokemon: ApiPokemon): Pokemon => ({
  nome: pokemon.name,
  index: String(pokemon.index).padStart(3, '0'),
  tipos: pokemon.types,
  imagem: pokemon.image,
  poderes: pokemon.abilities.map((ability) => ({
    nome: ability.name,
    forca: ability.strength,
  })),
});

export const createPokemonProfile = async (
  username: string,
  password: string
): Promise<PokemonProfileResponse> => {
  const response = await collectionApi.post('/auth/v1/register', {
    username,
    password,
  });

  return response.data;
};

export const getPokemonProfileId = async (
  username: string,
  password: string
): Promise<PokemonProfileResponse> => {
  const response = await collectionApi.post('/auth/v1/login', {
    username,
    password,
  });

  return response.data;
};

export const getProfileStats = async (
  userId: string
): Promise<ProfileStats> => {
  const response = await collectionApi.get(`/auth/v1/stats/${userId}`);

  return response.data;
};

export const updateProfileStats = async (
  userId: string,
  stats: Pick<ProfileStats, 'level' | 'vitorias' | 'derrotas'>
): Promise<ProfileStats> => {
  const response = await collectionApi.put(`/auth/v1/stats/${userId}`, {
    level: String(stats.level),
    vitorias: String(stats.vitorias),
    derrotas: String(stats.derrotas),
  });

  return response.data;
};

export const getUserTeam = async (
  userId: string
): Promise<{ team: Pokemon[]; capture: Pokemon[] }> => {
  const response = await collectionApi.get<TeamResponse>('/pokemon/v1/team', {
    params: {
      'user-id': userId,
    },
  });

  return {
    team: response.data.team.map(mapApiPokemon),
    capture: response.data.capture.map(mapApiPokemon),
  };
};

export const updateUserTeam = async (
  userId: string,
  removedPokemon: number,
  newPokemon: number
) => {
  await collectionApi.put(
    '/pokemon/v1/team',
    {
      removedPokemon,
      newPokemon,
    },
    {
      params: {
        'user-id': userId,
      },
    }
  );
};

export const addCapturedPokemon = async (
  userId: string,
  pokemonId: number
) => {
  await collectionApi.put('/pokemon/v1/captured', null, {
    params: {
      'user-id': userId,
      'pokemon-id': pokemonId,
    },
  });
};

export const deleteCapturedPokemon = async (
  userId: string,
  pokemonId: number
) => {
  await collectionApi.delete('/pokemon/v1/captured', {
    params: {
      'user-id': userId,
      'pokemon-id': pokemonId,
    },
  });
};
