import { useInfiniteQuery } from "@tanstack/react-query";

// NOTE: 프로젝트 구조에 맞게 아래 경로들을 수정해주세요.
import { getLpList } from "../../apis/lp"; 
import type { PAGINATION_ORDER } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseLpListDto } from "../../type/lp";
// PAGINATION_ORDER가 정의된 경로를 가정합니다.

function useGetInfiniteLpList(
    limit: number,
    search: string,
    order: PAGINATION_ORDER,
) {
    return useInfiniteQuery({
        queryFn:({pageParam}) =>
            getLpList({cursor:pageParam, limit, search, order}),
        queryKey:[QUERY_KEY.lps, search, order],
        initialPageParam: 0,
        // 다음 페이지 파라미터를 결정합니다.
        getNextPageParam: (lastPage:ResponseLpListDto, allPages: ResponseLpListDto[]) => {
            // 응답 객체(ResponseLpListDto)에서 nextCursor를 반환하여 다음 요청의 pageParam으로 사용합니다.
            return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
        },
    });
}

export default useGetInfiniteLpList;