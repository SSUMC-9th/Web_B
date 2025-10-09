import axios from "axios";
import { useEffect, useState } from "react";

type Params = Record<string, string | number | boolean | undefined | null>;

function useCustomFetch<T>(url: string | null, params?: Params) {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();
    setIsPending(true);
    setIsError(false);

    axios
      .get<T>(url, {
        params,
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
        },
      })

      .then((res) => setData(res.data))
      .catch((err) => {
        if (err?.name === "CanceledError") return; // 요청 취소는 무시
        setIsError(true);
      })
      .finally(() => setIsPending(false)); // 요청끝났으니까 로딩중상태 false로변경

    // cleanup: 컴포넌트 언마운트 시 요청 취소
    return () => controller.abort();
  }, [url, JSON.stringify(params)]); // params 객체가 변하면 다시 호출

  return { data, isPending, isError } as const;
}

export default useCustomFetch;
