class StorageService {
  storage: Storage;
  constructor(storage: Storage) {
    this.storage = storage;
  }
  // 设置存储项
  setItem(key: string, value: any) {
    try {
      this.storage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error setting item ${key} to storage`, e);
    }
  }
  // 获取存储项
  getItem<T>(key: string): T | null {
    try {
      const value = this.storage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch (e) {
      console.error(`Error getting item ${key} from storage`, e);
      return null;
    }
  }
  //移除存储项
  removeItem(key: string) {
    this.storage.removeItem(key);
  }
  // 清除所有存储项
  clear() {
    this.storage.clear();
  }
}
// 创建一个 LocalStorageService 实例
const LocalStorageService = new StorageService(window.localStorage);
// 创建一个 SessionStorageService 实例
const SessionStorageService = new StorageService(window.sessionStorage);
export { LocalStorageService, SessionStorageService };
