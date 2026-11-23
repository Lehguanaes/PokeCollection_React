import { readCollectionData, writeCollectionData } from './sqlite';
import {
  AddToTeamResult,
  CaptureLocation,
  CaptureResult,
  MAX_TEAM_SIZE,
  PokemonCollection,
} from '@/@types/collection';
import { Pokemon } from '@/@types/pokemon';

// Executa uma operação por vez para duas gravações não sobrescreverem os dados.
let pending = Promise.resolve();

function runInOrder<T>(operation: () => Promise<T>): Promise<T> {
  const result = pending.then(operation);
  pending = result.then(() => undefined, () => undefined);
  return result;
}

async function readCollection(userId: string): Promise<PokemonCollection> {
  if (!userId.trim()) throw new Error('É necessário informar o usuário.');
  const data = await readCollectionData(userId.trim());
  return data ? JSON.parse(data) : { captures: [], teamIds: [] };
}

// Lê a coleção, aplica a alteração e salva o resultado no SQLite.
function updateCollection<T>(
  userId: string,
  update: (collection: PokemonCollection) => T
): Promise<T> {
  return runInOrder(async () => {
    const collection = await readCollection(userId);
    const result = update(collection);
    await writeCollectionData(userId.trim(), JSON.stringify(collection));
    return result;
  });
}

export function getCollection(userId: string): Promise<PokemonCollection> {
  return runInOrder(() => readCollection(userId));
}

export function saveCapturedPokemon(
  userId: string,
  pokemon: Pokemon,
  location?: CaptureLocation
): Promise<CaptureResult> {
  return updateCollection(userId, (collection) => {
    const number = Number(pokemon.index);
    if (!Number.isInteger(number) || number < 1 || number > 151) {
      throw new Error('O Pokémon deve ter um número entre 1 e 151.');
    }
    const id = String(number);
    if (collection.captures.some((capture) => capture.index === id)) {
      return 'duplicate';
    }
    collection.captures.push({
      ...pokemon,
      index: id,
      capturedAt: new Date().toISOString(),
      ...(location ? { location } : {}),
    });
    return 'created';
  });
}

export function discardPokemon(userId: string, id: string | number): Promise<boolean> {
  return updateCollection(userId, (collection) => {
    const pokemonId = String(Number(id));
    if (!collection.captures.some((capture) => capture.index === pokemonId)) {
      return false;
    }
    collection.captures = collection.captures.filter((capture) => capture.index !== pokemonId);
    collection.teamIds = collection.teamIds.filter((teamId) => teamId !== pokemonId);
    return true;
  });
}

export function addToTeam(userId: string, id: string | number): Promise<AddToTeamResult> {
  return updateCollection(userId, (collection) => {
    const pokemonId = String(Number(id));
    if (!collection.captures.some((capture) => capture.index === pokemonId)) {
      return 'not-captured';
    }
    if (collection.teamIds.includes(pokemonId)) return 'duplicate';
    if (collection.teamIds.length >= MAX_TEAM_SIZE) return 'full';
    collection.teamIds.push(pokemonId);
    return 'added';
  });
}

export function removeFromTeam(userId: string, id: string | number): Promise<boolean> {
  return updateCollection(userId, (collection) => {
    const pokemonId = String(Number(id));
    if (!collection.teamIds.includes(pokemonId)) return false;
    collection.teamIds = collection.teamIds.filter((teamId) => teamId !== pokemonId);
    return true;
  });
}
