import {
  documentDirectory,
  getInfoAsync,
  makeDirectoryAsync,
  readAsStringAsync,
  writeAsStringAsync,
} from 'expo-file-system/legacy';
import { Pokemon } from '@/@types/pokemon';

const DATA_DIR = `${documentDirectory ?? ''}data`;
const CAPTURED_FILE = `${DATA_DIR}/captured_pokemons.json`;

async function ensureDataFile() {
  const directory = await getInfoAsync(DATA_DIR);

  if (!directory.exists) {
    await makeDirectoryAsync(DATA_DIR, { intermediates: true });
  }

  const file = await getInfoAsync(CAPTURED_FILE);

  if (!file.exists) {
    await writeAsStringAsync(CAPTURED_FILE, '[]');
  }
}

export async function getCapturedPokemons(): Promise<Pokemon[]> {
  await ensureDataFile();

  const raw = await readAsStringAsync(CAPTURED_FILE);

  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    await writeAsStringAsync(CAPTURED_FILE, '[]');
    return [];
  }
}

export async function saveCapturedPokemon(
  pokemon: Pokemon
): Promise<'created' | 'duplicate'> {
  const captured = await getCapturedPokemons();
  const alreadyCaptured = captured.some(
    (item) => Number(item.index) === Number(pokemon.index)
  );

  if (alreadyCaptured) {
    return 'duplicate';
  }

  const nextCaptured = [...captured, pokemon].sort(
    (first, second) => Number(first.index) - Number(second.index)
  );

  await writeAsStringAsync(
    CAPTURED_FILE,
    JSON.stringify(nextCaptured, null, 2)
  );

  return 'created';
}
