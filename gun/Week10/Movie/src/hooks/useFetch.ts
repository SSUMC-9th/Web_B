import type { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { axiosClient } from "../apis/axiosClinet";

const useFetch = <T>(url: string, options?: AxiosRequestConfig) => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // options 객체를 문자열로 변환하여 의존성 비교를 안전하게 만듭니다.
    const stringifiedOptions = JSON.stringify(options);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const { data } = await axiosClient.get(url, {
                    ...options,
                });
                setData(data);
            } catch {
                setError("데이터를 가져오는데 에러가 발생했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        // 의존성 배열에 객체 대신 문자열화된 값을 넣습니다.
    }, [url, stringifiedOptions]); 

    return { data, error, isLoading };
};

export default useFetch;