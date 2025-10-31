import { useEffect, useState } from "react";
import axios from "axios";

type UseCustomFetchResult<T> = readonly [T | null, boolean, boolean];

export default function useCustomFetch<T>(url: string): UseCustomFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [isPending, setIsPending] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                setIsPending(true);

                const response = await axios.get<T>(url, {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                    },
                });

                setData(response.data);
            } catch (err) {
                setError(true);
            } finally {
                setIsPending(false);
            }
        };
        fetchData();

    }, [url]);

    return [data, isPending, error] as const;
}

