import { useInfiniteQuery } from "@tanstack/react-query";

interface Post {
  id: number;
  title: string;
  body: string;
}

// 한번에 가져올 게시글 개수
const PAGE_SIZE = 10;

// 3. 데이터 가져오는 함수
// pageParam: 현재 페이지 번호
async function fetchPosts({ pageParam = 1 }: { pageParam?: number }) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=${PAGE_SIZE}`
  );

  if (!res.ok) {
    throw new Error("네트워크 에러");
  }

  return (await res.json()) as Post[];
}

// 4. 메인컴포넌트

export default function InfinitePostsJsonPlaceholder() {
  //5. useInfinite 훅 사용
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", PAGE_SIZE],

    // 실제 데이터를 가져오는 함수
    queryFn: ({ pageParam }) => fetchPosts({ pageParam }),

    initialPageParam: 1,

    // getNextPageParam: 다음 페이지 번호를 계산하는 함수
    //   - lastPage: 방금 불러온 페이지의 데이터
    //   - allPages: 지금까지 불러온 모든 페이지의 배열
    //   - undefined를 반환하면 "더 이상 페이지 없음"
    getNextPageParam: (lastPage, allPages) => {
      const isLast = lastPage.length < PAGE_SIZE;
      return isLast ? undefined : allPages.length + 1;
    },
  });

  if (isLoading) {
    return <div>로딩중....</div>;
  }
  if (error) {
    return <div>에러가 발생했어요: {error.message}</div>;
  }

  return (
    <div>
      {/* data.pages는 배열의 배열이에요
          예: [[post1~10], [post11~20], [post21~30]] */}
      {data?.pages.map((page, pageIndex) => (
        <ul key={pageIndex} style={{ marginBottom: 16 }}>
          {page.map((post) => (
            <li key={post.id}>
              <strong>#{post.id}</strong>
              {post.title}
            </li>
          ))}
        </ul>
      ))}

      <div>
        {hasNextPage ? (
          <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
          </button>
        ) : (
          <span>마지막 페이지예요.</span>
        )}
      </div>

      <div style={{ marginTop: 8, fontSize: 12, color: "#555" }}>
        상태: {status} / 다음페이지 가능: {String(!!hasNextPage)}
      </div>
    </div>
  );
}
