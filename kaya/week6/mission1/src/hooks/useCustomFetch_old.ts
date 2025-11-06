import {useEffect, useState, useMemo, useRef} from 'react';

const STALE_TIME = 5 * 60 * 1_000; // 5 minutes 

const MAX_RETRIES = 3;
// 1초마다 재시도
const INITIAL_RETRY_DELAY = 1_000;

// 로컬 스토리지에 저장할 데이터의 구조
interface CacheEntry<T> {
  data: T;
  lastFetched: number; // 마지막으로 데이터를 가져온 시점
}

// useQuery
export const useCustomFetch_old = <T>(url: string): {data: T | null;
    isPending: boolean;
    isError: boolean } => {
    const [data, setData] = useState<T|null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    // url기반 캐싱, url을 키로
    const storageKey = useMemo(():string => url, [url]);

    const abortControllerRef = useRef<AbortController | null>(null);

    const retryTimeoutRef = useRef<number | null>(null);

    useEffect(()=> {
        abortControllerRef.current = new AbortController();
        setIsPending(false);

        const fetchData = async (currentRetry = 0): Promise<void> => {
            // 캐시가 되면 그걸 쓰고, 안되면 fetch 요청
            const currentTime = new Date().getTime();
            const cachedItem = localStorage.getItem(storageKey);
            
            // 캐시 데이터 확인, 신선도 검증
            if (cachedItem) {
                try {
                    const cachedData: CacheEntry<T> = JSON.parse(cachedItem);

                    // 캐시가 신선한 경우 (STALE_TIME 이내)
                    if (currentTime - cachedData.lastFetched < STALE_TIME) {
                        setData(cachedData.data);
                        setIsPending(false);
                        console.log('캐시된 데이터 사용', url);
                        return;
                    }

                    // 캐시가 만료된 경우
                    setData(cachedData.data);
                    console.log('만료된 캐시 데이터 사용', url);
                } catch {
                    localStorage.removeItem(storageKey);
                    console.warn('캐시 에러: 캐시 삭제함', url);
                }
            }

            setIsPending(true);

            // 네트워크 요청 처리
            try {
                const response = await fetch(url, {
                    signal: abortControllerRef.current?.signal,
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const newData = (await response.json()) as T;
                setData(newData); // 리렌더링

                // 캐싱
                const newCacheEntry: CacheEntry<T> = {
                    data: newData,
                    lastFetched: new Date().getTime(), // 현재 시간을 타임스탬프로 저장
                };

                localStorage.setItem(storageKey, JSON.stringify(newCacheEntry));
            } catch(error) {
                if (error instanceof Error && error.name === 'AbortError!') {
                    console.log('요청 취소됨', url);

                    return;
                }

                if (currentRetry < MAX_RETRIES) {
                    // 1 -> 2 -> 4 -> 8
                    const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, currentRetry);
                    console.log(
                        `재시도, ${
                        currentRetry + 1
                        }/${MAX_RETRIES} Retrying ${retryDelay}ms later`
                    );

                    retryTimeoutRef.current = setTimeout((): void => {
                        fetchData(currentRetry + 1);
                    }, retryDelay);
                } else {
                    // 최대 재시도 횟수 초과
                    setIsError(true);
                    setIsPending(false);
                    console.log('최대 재시도 횟수 초과', url);
                    return;
                }

                setIsError(true);
                console.log(error);
            } finally {
                setIsPending(false);
            }
        }
        // 네트워크 요청 끝, setIsPending=false
        fetchData();

        return () => {
            abortControllerRef.current?.abort();

            // 예약된 재시도 타이머 취소
            if (retryTimeoutRef.current !== null) {
                clearTimeout(retryTimeoutRef.current);
                retryTimeoutRef.current = null;
            }
        }
    }, [url, storageKey]);   
    
    return {data, isPending, isError};
}