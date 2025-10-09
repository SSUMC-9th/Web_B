import { useParams } from "react-router-dom";
import type { MovieDetails, Credits, CastMember, CrewMember, Genre } from "../types/movie";
import LoadingSpinner from "../components/LoadingSpinner";
import useCustomFetch from "../hooks/useCustomFetch";

export default function MovieDetailPage() {
    const { movieId } = useParams<{ movieId: string }>();

    const [movieDetails, isMoviePending, movieError] = useCustomFetch<MovieDetails>(
       `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`
    );

    // useCustomFetch hook을 사용하여 크레딧 정보 불러오기
    const [credits, isCreditsPending, creditsError] = useCustomFetch<Credits>(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`
    );

    // 두 요청 중 하나라도 로딩 중이면 로딩 상태
    const isPending = isMoviePending || isCreditsPending;
    // 두 요청 중 하나라도 에러가 발생하면 에러 상태
    const error = movieError || creditsError;

    // 로딩 중일 때 보여줄 화면
    if (isPending) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    // 에러가 발생했을 때 보여줄 화면
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500 text-2xl">에러가 발생했습니다.</div>
            </div>
        );
    }

    // 영화 정보가 없을 때 보여줄 화면
    if (!movieDetails) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-white text-2xl">영화 정보를 찾을 수 없습니다.</div>
            </div>
        );
    }

    // 제작진(crew) 중에서 감독(Director)만 필터링하여 추출
    const directors = credits?.crew.filter((member: CrewMember) => member.job === "Director") || [];

    return (
        <div className="min-h-screen text-white bg-black">
            {/* 백드롭 이미지 배경 영역 */}
            <div
                // relative: 상대 위치 지정 (자식 요소의 absolute 위치 기준점)
                className="relative w-full h-96 bg-cover bg-center"
                style={{
                    backgroundImage: movieDetails.backdrop_path
                        ? `url(https://image.tmdb.org/t/p/original${movieDetails.backdrop_path})`
                        : "none",
                }}
            >
                {/* absolute: 절대 위치 지정 */}
                {/* inset-0: top, right, bottom, left 모두 0 (부모 영역 전체 덮음) */}
                {/* bg-gradient-to-t: 위쪽으로 향하는 그라디언트 */}
                {/* from-black: 그라디언트 시작색 (아래쪽) - 검은색 */}
                {/* via-black/70: 그라디언트 중간색 - 검은색 70% 투명도 */}
                {/* to-transparent: 그라디언트 끝색 (위쪽) - 투명 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            </div>

            {/* 메인 콘텐츠 영역 */}
                {/* -mt-48: 위쪽 마진 -12rem (백드롭 이미지 위로 올라가는 효과) */}
                {/* relative: 상대 위치 지정 */}
                {/* z-10: z-index 10 (백드롭 위에 표시) */}
            <div className="container mx-auto px-4 -mt-48 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* 포스터 이미지 영역 */}
                    <div className="flex-shrink-0">
                        <img
                            src={
                                // 포스터 이미지가 있으면 TMDB 이미지, 없으면 placeholder
                                movieDetails.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
                                    : "/placeholder.png"
                            }
                            alt={movieDetails.title}
                            className="w-64 rounded-lg shadow-2xl"
                        />
                    </div>

                    {/* 영화 정보 영역 */}
                    <div className="flex-1">
                        {/* 영화 제목 */}
                        <h1 className="text-4xl font-bold mb-2">{movieDetails.title}</h1>

                        {/* 영화 태그라인 (있을 경우에만 표시) */}
                        {movieDetails.tagline && (
                            <p className="text-gray-400 italic mb-4">"{movieDetails.tagline}"</p>
                        )}

                        {/* 평점 및 기본 정보 섹션 */}
                        <div className="flex items-center gap-4 mb-4">
                            {/* 평점 정보 */}
                            <div className="flex items-center">
                                <span className="text-yellow-400 text-2xl mr-2">★</span>
                                <span className="text-xl font-semibold">
                                    {movieDetails.vote_average.toFixed(1)}
                                </span>
                                <span className="text-gray-400 ml-1">
                                    ({movieDetails.vote_count.toLocaleString()}명)
                                </span>
                            </div>
                            {/* 구분선 */}
                            <span className="text-gray-400">|</span>
                            {/* 상영 시간 */}
                            <span>{movieDetails.runtime}분</span>
                            <span className="text-gray-400">|</span>
                            {/* 개봉일 */}
                            <span>{movieDetails.release_date}</span>
                        </div>

                        {/* 장르 섹션 */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {/* 각 장르를 배지 형태로 표시 */}
                            {movieDetails.genres.map((genre: Genre) => (
                                <span
                                    key={genre.id}
                                    className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        {/* 줄거리 섹션 */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold mb-2">줄거리</h2>
                            <p className="text-gray-300 leading-relaxed">{movieDetails.overview}</p>
                        </div>

                        {/* 감독 섹션 (감독이 있을 경우에만 표시) */}
                        {directors.length > 0 && (
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold mb-2">감독</h3>
                                <div className="flex gap-2">
                                    {/* 감독이 여러 명일 수 있으므로 map으로 순회 */}
                                    {directors.map((director: CrewMember) => (
                                        <span key={director.id} className="text-gray-300">
                                            {director.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 추가 정보 섹션 */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            {/* 영화 상태 (Released, Post Production 등) */}
                            <div>
                                <span className="text-gray-400">상태:</span>
                                {/* ml-2: 왼쪽 마진 0.5rem */}
                                <span className="ml-2">{movieDetails.status}</span>
                            </div>
                            {/* 영화 제작 예산 */}
                            <div>
                                <span className="text-gray-400">예산:</span>
                                <span className="ml-2">
                                    {/* 예산을 천 단위 콤마로 구분하여 표시 */}
                                    ${movieDetails.budget.toLocaleString()}
                                </span>
                            </div>
                            {/* 영화 수익 */}
                            <div>
                                <span className="text-gray-400">수익:</span>
                                <span className="ml-2">
                                    {/* 수익을 천 단위 콤마로 구분하여 표시 */}
                                    ${movieDetails.revenue.toLocaleString()}
                                </span>
                            </div>
                            {/* 원본 언어 */}
                            <div>
                                <span className="text-gray-400">언어:</span>
                                {/* 언어 코드를 대문자로 표시 (en -> EN) */}
                                <span className="ml-2">{movieDetails.original_language.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 출연진 섹션 (출연진 정보가 있을 경우에만 표시) */}
                {credits && credits.cast.length > 0 && (
                    // mt-12: 위쪽 마진 3rem
                    <div className="mt-12">
                        {/* mb-6: 아래 마진 1.5rem */}
                        <h2 className="text-3xl font-bold mb-6">출연진</h2>
                        {/* 반응형 그리드 레이아웃 */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {/* 출연진 배열의 첫 12명만 표시 */}
                            {credits.cast.slice(0, 12).map((actor: CastMember) => (
                                // text-center: 텍스트 중앙 정렬
                                <div key={actor.cast_id} className="text-center">
                                    <div className="mb-2">
                                        {/* 배우 프로필 이미지가 있으면 이미지 표시 */}
                                        {actor.profile_path ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                                alt={actor.name}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        ) : (
                                            // 프로필 이미지가 없으면 플레이스홀더 표시
                                            <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                                                <span className="text-4xl text-gray-500">👤</span>
                                            </div>
                                        )}
                                    </div>
                                    {/* 배우 이름 */}
                                    <p className="font-semibold text-sm">{actor.name}</p>
                                    {/* 배역 이름 */}
                                    <p className="text-gray-400 text-xs">{actor.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 제작진 섹션 (제작진 정보가 있을 경우에만 표시) */}
                {credits && credits.crew.length > 0 && (
                    <div className="mt-12 mb-12">
                        <h2 className="text-3xl font-bold mb-6">주요 제작진</h2>
                        {/* 반응형 그리드 레이아웃 */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {credits.crew
                                // 주요 직책(감독, 프로듀서, 각본, 작가)만 필터링
                                .filter(
                                    (member: CrewMember) =>
                                        member.job === "Director" ||
                                        member.job === "Producer" ||
                                        member.job === "Screenplay" ||
                                        member.job === "Writer"
                                )
                                // 필터링 후 첫 12명만 선택
                                .slice(0, 12)
                                .map((member: CrewMember) => (
                                    <div key={member.credit_id} className="text-center">
                                        <div className="mb-2">
                                            {/* 제작진 프로필 이미지가 있으면 이미지 표시 */}
                                            {member.profile_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w200${member.profile_path}`}
                                                    alt={member.name}
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                            ) : (
                                                // 프로필 이미지가 없으면 플레이스홀더 표시
                                                <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                                                    <span className="text-4xl text-gray-500">👤</span>
                                                </div>
                                            )}
                                        </div>
                                        {/* 제작진 이름 */}
                                        <p className="font-semibold text-sm">{member.name}</p>
                                        {/* 제작진 직책 */}
                                        <p className="text-gray-400 text-xs">{member.job}</p>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
