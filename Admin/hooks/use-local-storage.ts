type StorageType = 'session' | 'local';
type UseStorageReturnValue = {
  getItem: (key: string, type?: StorageType) => string | null;
  setItem: (
    key: string,
    value: string,
    expirationMinutes?: number,
    type?: StorageType,
  ) => boolean;
  removeItem: (key: string, type?: StorageType) => void;
};

const useStorage = (): UseStorageReturnValue => {
  const storageType = (type?: StorageType): 'localStorage' | 'sessionStorage' =>
    `${type ?? 'session'}Storage`;

  const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')();

  const getItem = (key: string, type?: StorageType): string | null => {
    if (!isBrowser) return null;

    const item = window[storageType(type)][key];
    if (!item) return null;

    // Parse the stored item to check for expiration
    const parsedItem = JSON.parse(item);

    if (parsedItem?.expiration && new Date() > new Date(parsedItem.expiration)) {
      // Item has expired, remove it and return null
      removeItem(key, type);
      return null;
    }

    return parsedItem.value;
  };

  const setItem = (
    key: string,
    value: string,
    expirationMinutes: number = 0,
    type?: StorageType,
  ): boolean => {
    if (!isBrowser) return false;

    const expiration =
      expirationMinutes > 0
        ? new Date().getTime() + expirationMinutes * 60000
        : null;
    const itemToStore = JSON.stringify({ value, expiration });

    window[storageType(type)].setItem(key, itemToStore);
    return true;
  };

  const removeItem = (key: string, type?: StorageType): void => {
    if (isBrowser) {
      window[storageType(type)].removeItem(key);
    }
  };

  return {
    getItem,
    setItem,
    removeItem,
  };
};

export default useStorage;
