"use client";
import { useCallback, useEffect, useState } from "react";
import { getLocalStorage, setLocalStorage } from "./localStorage";

// Hook
export function useLocalStorage(key: string, initialValue: string) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const getFromStorage = useCallback(async () => {
    const item = (await getLocalStorage(key)) as string;

    if (!item) {
      setIsError(true);
      setStoredValue(initialValue);
    }
    setStoredValue(item);
    setIsLoading(false);
  }, [initialValue, key]);

  useEffect(() => {
    getFromStorage();
  }, [getFromStorage]);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: string) => {
    try {
      // Save state
      setStoredValue(value);
      // Save to local storage
      setLocalStorage(key, value);
    } catch (error) {
      // A more advanced implementation would handle the error case
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };
  return [storedValue, setValue, isError, isLoading] as const;
}
