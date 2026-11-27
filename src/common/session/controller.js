import { initial } from './seed.js';

const storageKey = 'ara-workspace-session-v1';

export function loadData() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey));
    return Object.keys(initial).every(key => Array.isArray(saved?.[key])) ? saved : initial;
  } catch {
    return initial;
  }
}

export function saveData(data) {
  sessionStorage.setItem(storageKey, JSON.stringify(data));
}

export function upsert(rows, item) {
  if (rows.some(row => row.id === item.id)) return rows.map(row => row.id === item.id ? item : row);
  return [...rows, item];
}
