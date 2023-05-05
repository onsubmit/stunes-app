import { Err, Ok, Result } from 'ts-results';

export type LocalStorage = {
  access_token: string;
  refresh_token: string;
  expires: number;
};

export type LocalStorageValue = LocalStorage[keyof LocalStorage];

class LocalStorageManager {
  get = <T extends LocalStorageValue>(key: keyof LocalStorage): Result<T, void> => {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) {
      return Err.EMPTY;
    }

    return new Ok(JSON.parse(storedValue) as T);
  };

  set = <T extends LocalStorageValue>(key: keyof LocalStorage, value: T): Result<void, void> => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return Err.EMPTY;
    }

    return Ok.EMPTY;
  };
}

const localStorageManager = new LocalStorageManager();
export default localStorageManager;
