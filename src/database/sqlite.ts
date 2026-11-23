import { Platform } from 'react-native';
import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';

let database: Promise<SQLiteDatabase> | undefined;

async function createDatabase() {
  const db = await openDatabaseAsync('pokecollection.db');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS collections (
      user_id TEXT PRIMARY KEY NOT NULL,
      data TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS notification_preferences (
      user_id TEXT PRIMARY KEY NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 0 CHECK (enabled IN (0, 1))
    );
  `);
  return db;
}

export function getDatabase() {
  if (Platform.OS !== 'android') throw new Error('O SQLite é usado somente no Android.');
  if (!database) {
    database = createDatabase().catch((error) => {
      database = undefined;
      throw error;
    });
  }
  return database;
}

export async function readCollectionData(userId: string): Promise<string | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ data: string }>(
    'SELECT data FROM collections WHERE user_id = ?', userId
  );
  return row?.data ?? null;
}

export async function writeCollectionData(userId: string, data: string) {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT OR REPLACE INTO collections (user_id, data) VALUES (?, ?)',
    userId, data
  );
}

export async function getReminderEnabled(userId: string) {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ enabled: number }>(
    'SELECT enabled FROM notification_preferences WHERE user_id = ?', userId
  );
  return row?.enabled === 1;
}

export async function setReminderEnabled(userId: string, enabled: boolean) {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT OR REPLACE INTO notification_preferences (user_id, enabled) VALUES (?, ?)',
    userId, enabled ? 1 : 0
  );
}

export async function readStoredEntries() {
  const db = await getDatabase();
  const collections = await db.getAllAsync<{ user_id: string; data: string }>(
    'SELECT user_id, data FROM collections ORDER BY user_id'
  );
  const preferences = await db.getAllAsync<{ user_id: string; enabled: number }>(
    'SELECT user_id, enabled FROM notification_preferences ORDER BY user_id'
  );
  return [
    ...collections.map((row) => ({ key: `collections/${row.user_id}`, value: row.data })),
    ...preferences.map((row) => ({
      key: `notification_preferences/${row.user_id}`,
      value: JSON.stringify({ enabled: row.enabled === 1 }),
    })),
  ];
}
