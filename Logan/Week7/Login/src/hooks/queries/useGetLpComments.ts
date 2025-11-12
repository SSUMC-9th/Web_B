import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpComments } from "../../apis/comments";
import type { PAGINATION_ORDER } from "../../enums/common";

const PAGE_SIZE = 10;

export default function useGetLpComments(
  lpId: number,
  order: PAGINATION_ORDER
) {
  return useInfiniteQuery({
    queryKey: ["lpComments", lpId, order],
    queryFn: ({ pageParam = 0 }) =>
      getLpComments(lpId, { cursor: pageParam, limit: PAGE_SIZE, order }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // CursorBasedResponse<Comment[]>
      const { nextCursor, hasNext } = lastPage.data;
      return hasNext ? nextCursor ?? undefined : undefined;
    },
  });
}
