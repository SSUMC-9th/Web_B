// src/hooks/useFetch.ts
import { useEffect, useState } from "react";
import axios from "axios";

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!url) return;
    setIsPending(true);
    setIsError(false);

    axios
      .get<T>(url, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` },
      })
      .then((res) => setData(res.data))
      .catch(() => setIsError(true))
      .finally(() => setIsPending(false));
  }, [url]);

  return { data, isPending, isError };
}
