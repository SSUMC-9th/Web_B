import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from "../../constants/key.ts";
import type { RequestLpDto } from "../../types/lp.ts";
import { getLpDetail } from "../../apis/lp.ts";

/**
 * LP 상세 정보 쿼리 훅
 *
 * @description
 * 특정 LP의 상세 정보를 가져오는 훅입니다.
 * 앨범 정보, 태그, 좋아요 목록 등을 포함합니다.
 *
 * @param lpId - 조회할 LP의 ID
 * @returns useQuery 결과 (data, isLoading, isError, etc.)
 *
 * @example
 * const { data: lp, isLoading } = useGetLpDetail({ lpId: 123 });
 */
export const useGetLpDetail = ({ lpId }: RequestLpDto) => {
  return useQuery({
    queryKey: [QUERY_KEY.lps, lpId],
    queryFn: () => getLpDetail({ lpId }),
  });
}