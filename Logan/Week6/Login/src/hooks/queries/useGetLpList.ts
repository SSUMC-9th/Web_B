import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../tpyes/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { boolean } from "zod";
import type { ResponseLpListDto } from "../../tpyes/lp";

function useGetLpList({ cursor, search, order, limit }: PaginationDto) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, search, order],
    queryFn: () =>
      getLpList({
        cursor,
        search,
        order,
        limit,
      }),

    // 데이터가 신선하다고 간주하는 시간
    // 이시간동안 캐시된 데이터를 그대로 사용한다.(컴포넌트가 마운트가 되더라고, 창에 포커스 들어오는 경우도 재요청X)
    // 5분 동안 기존 데이터를 그대로 활용해서 네트워크 요청을 줄인다.
    staleTime: 1000 * 60 * 5, // 5분

    // 사용되지 않는(비활성 상태) 인 쿼리 데이터가 캐시에 남아잇는 시간
    // staleTime이 지나고 데이터가 신선하지 않더라도, 일정 시간동안 메모리에 보관.
    // 그 이후에 해당 쿼리가 전혀 사용되지 않으면, gcTime이 지난 후에 제거한다. (garbage collection)
    // ex) 10분동아 사용되지 않으면 헤당 캐시 데이터가 삭제되어, 다시 요청시 새 데이터를 받아오게 한다..
    gcTime: 100 * 60 * 10, // 10분

    // 조건에 따라 쿼리를 실행 여부 제어
    // 조건에 따라 쿼리를 실행 여부 제어
    // search하려는게 있으면 실행
    //enabled: Boolean(search),

    //refetchInterval: 10 * 60,

    // retry: 쿼리요청이 실패했을때 자동으로 재시도 횟루를 지정합니다.
    // 기본값은 3회정도, 네트워크 오류시 등임시적인 문제를 보완할 수 있다.

    // initialData: 쿼리실행 전 미리제공할 초기데이터를 설정한다.
    // 컴포넌트가 렌더링될때 빈 데이터구조를 미리제공해서, 로딩전에도 안전하게 ui를 구성할 수 있게한다.

    // 파라미터가 변경될 때 이전데이터를 유지하여UI깜빡임을 줄여준다.
    // ex) 페이지네이션 시 페이지 전환 사이에 이전 데이터를 보여준다.
    // keepPreviousData: true, //This keeps the previous data while fetching new data

    select: (data: ResponseLpListDto) => data.data.data,
  });
}

export default useGetLpList;
