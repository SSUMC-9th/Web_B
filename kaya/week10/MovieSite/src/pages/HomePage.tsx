import {useState, useMemo, useCallback} from 'react';
import useFetch from '../hooks/useFetch';
import { type MovieResponse, type MovieFilters } from '../types/movie';
import MovieList from '../components/MovieList';
import MovieFilter from '../components/MovieFilter';

export default function HomePage() {
    const [filters, setFilters] = useState<MovieFilters>({
        query: '',
        include_adult: false,
        language: "ko-KR",
    })

    // filters가 바뀔 때(query, include_adult, language) 바뀜
    const axiosRequestConfig = useMemo(
        (): {params: MovieFilters} => ({
            params: filters,
        }),
        [filters]
    )

    // useCallback으로 감싸서 참조값이 바뀌지 않도록(함수 캐싱)
    // props를 memo로 감싸서 props가 변경된 경우만 리렌더링
    const handleMovieFilters = useCallback((filters: MovieFilters) => {
        setFilters(filters);
    }, [setFilters])

    const {data, error, isLoading} = useFetch<MovieResponse>('/search/movie', 
        axiosRequestConfig
    );

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='container'>
            <MovieFilter onChange={handleMovieFilters}/>
            {isLoading? (
                <div>로딩 중 입니다...</div>
            ):(
            <MovieList movies={data?.results || []}/>
            )}
        </div>
    )
}