import { useInfiniteQuery } from "@tanstack/react-query";
import { getComments } from "../../apis/comment.ts";

interface UseGetCommentsParams {
  lpId: number;
  order?: "asc" | "desc";
}

function useGetComments({
  lpId,
  order = "desc",
}: UseGetCommentsParams) {
  return useInfiniteQuery({
    queryKey: ["lpComments", lpId, order],
    queryFn: async ({ pageParam = 0 }) => {
      return getComments({
        lpId,
        cursor: pageParam,
        limit: 10,
        order,
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.data.hasNext && lastPage.data.nextCursor) {
        return lastPage.data.nextCursor;
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}

export default useGetComments;
