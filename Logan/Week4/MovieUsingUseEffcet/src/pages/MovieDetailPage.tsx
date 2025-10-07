import React, { useEffect, useState, type JSX } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";
import MovieDetailHero from "../components/MovieDetailHero";
import MovieFacts from "../components/MovieFacts";
import CompanyChips from "../components/CompanyChips";
import type { MovieDetail } from "../types/MovieDetail";
import { type CreditResponse, type Cast } from "../types/credits";

export default function MovieDetailPage(): JSX.Element {
  const { movieId } = useParams<{ movieId: string }>();

  const [detail, setDetail] = useState<MovieDetail | null>(null);

  const [credits, setCredits] = useState<Cast[]>([]);

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect((): void => {
    if (!movieId) return;

    const fetchDetailAndCredits = async (): Promise<void> => {
      if (!movieId) return;
      setIsPending(true);

      try {
        const [detailRes, creditRes] = await Promise.all([
          axios.get<MovieDetail>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
          axios.get<CreditResponse>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
        ]);
        setDetail(detailRes.data);
        setCredits(creditRes.data.cast);
      } catch (e) {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchDetailAndCredits();
  }, [movieId]);

  if (isError) {
    return (
      <div className="p-6">
        <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
        <div className="mt-4">
          <Link
            to={-1 as any}
            className="inline-block bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            뒤로가기
          </Link>
        </div>
      </div>
    );
  }

  if (isPending || !detail) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* 상단 히어로 영역 (포스터 + 제목/태그라인/평점) */}
      <MovieDetailHero detail={detail} />

      {/* 개요 */}
      {detail.overview && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-3">Overview</h2>
          <p className="leading-7 text-gray-800">{detail.overview}</p>
        </section>
      )}

      {/* 감독/출연진 */}
      {credits.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-6">감독/출연</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {credits.map((cast) => (
              <div
                key={cast.id}
                className="flex flex-col items-center text-center text-white"
              >
                {/* 프로필 이미지 */}
                {cast.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${cast.profile_path}`}
                    alt={cast.name}
                    className="w-24 h-24 rounded-full object-cover mb-2 border border-white shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-400 mb-2 flex items-center justify-center text-sm text-white">
                    No Image
                  </div>
                )}

                {/* 배우 이름 */}
                <span className="font-semibold">{cast.name}</span>

                {/* 배역 이름 */}
                <span className="text-sm text-gray-300">{cast.character}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 핵심 정보 (개봉일, 런타임, 장르 등) */}
      <MovieFacts detail={detail} className="mt-8" />

      {/* 제작사 Chips */}
      {detail.production_companies?.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-3">Production Companies</h2>
          <CompanyChips companies={detail.production_companies} />
        </section>
      )}

      {/* 공식 사이트 */}
      {detail.homepage && (
        <section className="mt-10">
          <a
            href={detail.homepage}
            target="_blank"
            rel="noreferrer"
            className="inline-block underline"
          >
            Official Website
          </a>
        </section>
      )}
    </div>
  );
}
