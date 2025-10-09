export const useLocalStorage = (key: string) => {
  const setItem = (value: unknown) => {
    try {
    localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
    console.error(error);
    }
  };

  const getItem = () => {
    try {
      const item = localStorage.getItem(key);

      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error(e);
    }
  };

  const removeItem = () => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(e);
    }
  };

  return { setItem, getItem, removeItem };
};
