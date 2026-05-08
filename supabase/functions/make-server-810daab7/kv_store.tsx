/**
 * 💡 既然雲端不給用 Deno.openKv，我們就改用記憶體存。
 * 這樣就不需要 --experimental 標籤，也不會噴 WORKER_ERROR 了！
 */

// 建立一個記憶體倉庫
let memoryStorage = new Map();

// 1. 儲存資料
export async function set(key: string, value: any) {
  memoryStorage.set(key, value);
}

// 2. 取得單一資料
export async function get(key: string) {
  return memoryStorage.get(key);
}

// 3. 獲取所有清單 (解決之前 500 錯誤的核心)
export async function getByPrefix(prefix: string) {
  const allValues = Array.from(memoryStorage.values());
  // 篩選出符合前綴的資料
  return allValues.filter(item => item.id && item.id.startsWith(prefix));
}

// 4. 刪除資料
export async function deleteItem(key: string) {
  memoryStorage.delete(key);
}