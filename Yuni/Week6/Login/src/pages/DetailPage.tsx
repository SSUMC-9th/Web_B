import { useParams, useNavigate } from 'react-router-dom';
import useGetLpDetail from '../hooks/queries/useGetLpDetail';
import useGetComments from '../hooks/queries/useGetComments';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import CommentForm from '../components/CommentForm';
import CommentItem from '../components/CommentItem';
import { useState, useEffect, useRef, useCallback } from 'react';
import { axiosInstance } from '../apis/axios';
import { useAuth } from '../hooks/useAuth';

export default function DetailPage() {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [likeLoading, setLikeLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [commentOrder, setCommentOrder] = useState<"asc" | "desc">("desc");
  const observerTarget = useRef<HTMLDivElement>(null);

  // 비로그인 사용자 체크
  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요한 페이지입니다.');
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!lpId) {
    return <ErrorState message="유효하지 않은 LP ID입니다" />;
  }

  const lpIdNumber = parseInt(lpId, 10);
  const { data, isLoading, error } = useGetLpDetail(lpIdNumber);
  const lp = data?.data;

  // Comments infinite query
  const {
    data: commentsData,
    isLoading: commentsLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch: refetchComments,
  } = useGetComments({
    lpId: lpIdNumber,
    order: commentOrder,
  });

  const commentList = commentsData?.pages?.flatMap(page => page.data.data) || [];

  // Intersection Observer for infinite scroll
  const handleObserverCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  // Set up Intersection Observer for comments
  useEffect(() => {
    if (!observerTarget.current) return;

    const observer = new IntersectionObserver(handleObserverCallback, {
      threshold: 0.1,
    });

    observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [handleObserverCallback]);

  // Handle comment order change - reset to first page
  const handleCommentOrderChange = () => {
    const newOrder = commentOrder === "desc" ? "asc" : "desc";
    setCommentOrder(newOrder);
  };

  const formatDate = (date: Date | string) => {
    try {
      const d = new Date(date);
      return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return '날짜 미상';
    }
  };

  const handleLike = async () => {
    try {
      setLikeLoading(true);
      setActionMessage('');
      await axiosInstance.post(`/lps/${lpIdNumber}/likes`);
      setActionMessage('✅ 좋아요가 추가되었습니다');
    } catch (error: any) {
      if (error.response?.status === 409) {
        setActionMessage('⚠️ 이미 좋아요한 LP입니다');
      } else {
        setActionMessage('❌ 좋아요 추가 실패');
      }
    } finally {
      setLikeLoading(false);
    }
  };

  const handleEdit = () => {
    // TODO: 수정 페이지로 이동 또는 수정 모달 열기
    setActionMessage('📝 수정 기능은 곧 추가될 예정입니다');
  };

  const handleDelete = async () => {
    if (!window.confirm('이 LP를 삭제하시겠습니까?')) {
      return;
    }

    try {
      setActionMessage('');
      await axiosInstance.delete(`/lps/${lpIdNumber}`);
      setActionMessage('✅ LP가 삭제되었습니다');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error: any) {
      setActionMessage('❌ LP 삭제 실패');
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !lp) {
    return <ErrorState message={error?.message || 'LP를 찾을 수 없습니다'} />;
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-sm"
        >
          ← 목록으로
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* 앨범 이미지 */}
          <div className="md:col-span-1 flex justify-center">
            <div className="w-full max-w-sm aspect-square rounded-lg overflow-hidden shadow-2xl shadow-pink-500/50">
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                <span className="text-gray-400 text-9xl">♫</span>
              </div>
            </div>
          </div>

          {/* LP 정보 */}
          <div className="md:col-span-2 flex flex-col justify-center">
            {/* 제목 */}
            <h1 className="text-4xl font-bold mb-4 text-white">{lp.title}</h1>

            {/* 메타 정보 */}
            <div className="space-y-3 mb-6 text-gray-300">
              <div>
                <p className="text-sm text-gray-400 mb-1">📅 업로드 날짜</p>
                <p className="text-lg">{formatDate(lp.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">❤️ 좋아요</p>
                <p className="text-lg text-pink-400 font-semibold">{lp.likes?.length || 0}</p>
              </div>
            </div>

            {/* 태그 */}
            {lp.tags && lp.tags.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">🏷️ 태그</p>
                <div className="flex flex-wrap gap-2">
                  {lp.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-pink-900 bg-opacity-30 text-pink-300 rounded-full text-sm border border-pink-500 border-opacity-30"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 상세 설명 */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">상세 정보</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{lp.content}</p>
        </div>

        {/* 액션 메시지 */}
        {actionMessage && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
            <p className="text-sm font-mono text-gray-300">{actionMessage}</p>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className="px-6 py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-600 disabled:opacity-50 text-white rounded-lg font-medium transition flex items-center gap-2"
          >
            {likeLoading ? '처리 중...' : '❤️ 좋아요'}
          </button>
          <button
            onClick={handleEdit}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center gap-2"
          >
            ✏️ 수정
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition flex items-center gap-2"
          >
            🗑️ 삭제
          </button>
        </div>

        {/* 댓글 섹션 */}
        <div className="mt-12">
          {/* 댓글 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">댓글</h2>
            <button
              onClick={handleCommentOrderChange}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition"
            >
              {commentOrder === "desc" ? "📅 최신순" : "📅 오래된순"}
            </button>
          </div>

          {/* 댓글 입력 폼 */}
          <CommentForm lpId={lpIdNumber} onCommentAdded={() => refetchComments()} />

          {/* 댓글 목록 */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            {commentsLoading && commentList.length === 0 ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-800 rounded animate-pulse w-1/3" />
                      <div className="h-4 bg-gray-800 rounded animate-pulse w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : commentList.length === 0 ? (
              <p className="text-gray-400 text-center py-8">첫 댓글을 작성해주세요!</p>
            ) : (
              <>
                {commentList.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    lpId={lpIdNumber}
                    onCommentDeleted={() => refetchComments()}
                  />
                ))}

                {/* 하단 로딩 스켈레톤 */}
                {isFetchingNextPage && (
                  <div className="space-y-4 mt-4 pt-4 border-t border-gray-800">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={`skeleton-bottom-${i}`} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-800 rounded animate-pulse w-1/3" />
                          <div className="h-4 bg-gray-800 rounded animate-pulse w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 무한 스크롤 트리거 */}
                <div ref={observerTarget} className="h-4 mt-4" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
