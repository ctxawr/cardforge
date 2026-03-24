// v1.0 — ctxAWR: IndexedDB persistence for saved cards via idb
// Purpose: Save/load/delete CardData objects across sessions
// Context: Cards have large base64 image fields; IndexedDB handles binary data natively
import { openDB } from 'idb';
import type { CardData } from '../types/card';

const DB_NAME = 'cardforge';
const STORE = 'cards';
const VERSION = 1;

async function getDB() {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    },
  });
}

export async function saveCard(card: CardData): Promise<void> {
  const db = await getDB();
  await db.put(STORE, card);
}

export async function loadCards(): Promise<CardData[]> {
  const db = await getDB();
  return db.getAll(STORE);
}

export async function deleteCard(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE, id);
}
