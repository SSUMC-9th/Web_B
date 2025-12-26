import {type AxiosRequestConfig} from 'axios';
import {useState, useEffect} from 'react';
import { axiosClient } from '../apis/axiosClient';

const useFetch = <T>(url: string, options?: AxiosRequestConfig) => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            setIsLoading(true);
            try{
                const {data} = await axiosClient.get(url, {
                    ...options, // 설정 객체를 풀어서 전달
                });

                setData(data);
            } catch {
                setError('데이터를 가져오는데 에러가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [url, options]);
    // [url, options] 무한히 렌더링

    return {
        data,
        error,
        isLoading
    }
}

export default useFetch;