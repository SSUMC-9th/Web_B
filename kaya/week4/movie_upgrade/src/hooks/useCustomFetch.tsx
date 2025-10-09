// src/hooks/useCustomFetch.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios, { AxiosError } from "axios";

type Options = {
  /** TMDB 쿼리 파라미터 (page, language, append_to_response 등) */
  params?: Record<string, any>;
  /** 기본값: true. false면 mount시에 자동 요청 안 함 */
  auto?: boolean;
};

type FetchResult<T> = {
  data: T | null;
  isPending: boolean;
  isError: boolean;
  errorMessage?: string;
  /** 의존성 변경 외에도 수동 재요청 */
  refetch: () => void;
};

/**
 * TMDB 전용 GET 훅
 * - data, 로딩, 에러 상태 반환
 * - path/params가 바뀌면 자동 재요청
 * - 수동 refetch 제공
 */
export function useCustomFetch<T>(
  path: string | null,            // 예: "/movie/popular"
  { params, auto = true }: Options = {},
  deps: any[] = []                // 외부 의존성: page, category 등
): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setPending] = useState(false);
  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const baseURL = "https://api.themoviedb.org/3";
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` }),
    []
  );

  // path + params 가 바뀌면 새로운 키
  const key = useMemo(
    () => JSON.stringify({ path, params }),
    [path, params]
  );

  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(async () => {
    if (!path) return;
    abortRef.current?.abort();                    // 이전 요청 취소
    const ac = new AbortController();
    abortRef.current = ac;

    setPending(true);
    setError(false);
    setErrorMessage(undefined);

    try {
      const { data } = await axios.get<T>(`${baseURL}${path}`, {
        headers,
        params,
        signal: ac.signal,
      });
      setData(data);
    } catch (err) {
      if ((err as any)?.name === "CanceledError") return; // axios 취소
      const e = err as AxiosError<{ status_message?: string }>;
      setError(true);
      setErrorMessage(
        e.response?.data?.status_message ||
          e.message ||
          "데이터를 불러오는 중 문제가 발생했습니다."
      );
    } finally {
      setPending(false);
    }
  }, [path, headers, params]);

  // 의존성(path/params + 외부 deps) 변경 시 자동 재요청
  useEffect(() => {
    if (!auto) return;
    run();
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ...deps]);

  return { data, isPending, isError, errorMessage, refetch: run };
}
