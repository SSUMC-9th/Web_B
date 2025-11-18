import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import {Heart, Send, MessageSquare, Trash2, Edit} from "lucide-react"; // Edit 추가
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../context/AutoContext";
import type { Likes } from "../type/lp";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import usePostLike from "../hooks/mutations/usePostLike";

// --- 댓글 기능 Import ---
import type { Comment } from "../type/comment"; 
import { useGetComments } from '../hooks/queries/useComments';
import { useDeleteComment, usePostComment, useUpdateComment } from '../hooks/mutations/useComment'; // useUpdateComment 추가
import type { PAGINATION_ORDER } from '../enums/common';


const LpDetailPage = () => {
    const {lpid} = useParams();
    const lpIdNumber = Number(lpid); 
    const {accessToken} = useAuth();
    
    // 댓글 작성 폼 상태
    const [newCommentContent, setNewCommentContent] = useState('');

    // ⭐ 댓글 수정/삭제/정렬 관련 상태 ⭐
    const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null); // 수정 중인 댓글 ID
    const [editedContent, setEditedContent] = useState(''); // 수정 중인 내용
    
    // ⭐ 댓글 정렬 순서 상태 추가 (기본값: 최신순 'desc') ⭐
    const [commentOrder, setCommentOrder] = useState<'desc' | 'asc'>('desc' as PAGINATION_ORDER);

    // 1. LP 상세 정보 조회
    const {
        data:lp, 
        isPending: isLpPending,
        isError: isLpError} = useGetLpDetail({lpid: lpIdNumber})
    const {data: me} = useGetMyInfo(accessToken);
    const currentUserId = me?.data.id; 

    // 2. 댓글 목록 조회 (commentOrder 상태 사용)
    const {
        data: commentsResponse, 
        isPending: isCommentsPending,
        isError: isCommentsError
    } = useGetComments({ 
        lpid: lpIdNumber, 
        limit: 30, 
        order: commentOrder // ⭐ 수정: commentOrder 상태 사용 ⭐
    });

    // 댓글 배열 추출
    const comments: Comment[] = commentsResponse?.data?.data || []; 
    
    // 3. 좋아요/싫어요 Mutation
    const {mutate:likeMutate} = usePostLike();
    const {mutate:disLikeMutate} = useDeleteLike();

    const isLiked = lp?.data.likes.some((like:Likes)=>like.userId === currentUserId);

    const handleLikeLp = async() => {
        if (!currentUserId) { console.warn("로그인이 필요합니다."); return; }
        await likeMutate({lpid: lpIdNumber});
    }
    
    const handleDislikeLp = async() => {
        if (!currentUserId) return;
        await disLikeMutate({lpid: lpIdNumber});
    }
    
    // 4. 댓글 작성 Mutation 및 핸들러
    const { mutate: postCommentMutate, isPending: isPostingComment } = usePostComment();
    
    const handlePostComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCommentContent.trim() || !currentUserId) {
            console.warn("내용을 입력하거나 로그인해야 합니다.");
            return;
        }

        postCommentMutate({ lpid: lpIdNumber, content: newCommentContent }, {
            onSuccess: () => {
                setNewCommentContent(''); // 성공 시 입력창 초기화
                console.log("댓글 작성 성공");
            },
            onError: (error) => {
                console.error("댓글 작성 실패:", error);
            }
        });
    };
    
    // 5. 댓글 삭제 Mutation 및 핸들러
    const { mutate: deleteCommentMutate, isPending: isDeletingComment } = useDeleteComment();

    // 5-1. 삭제 확인 요청 (Trash2 클릭 시)
    const handleDeleteComment = (commentId: number) => {
        if (!currentUserId) {
            console.warn("로그인이 필요합니다.");
            return;
        }
        // 수정 모드와 동시에 실행되지 않도록 확인
        if (editingCommentId) return;
        setDeletingCommentId(commentId);
    };
    
    // 5-2. 삭제 실행 ([예] 클릭 시)
    const handleConfirmDelete = (commentId: number) => {
        if (!currentUserId) return;

        deleteCommentMutate({ lpid: lpIdNumber, commentId }, {
            onSuccess: () => {
                console.log(`댓글 ID ${commentId} 삭제 완료.`);
                setDeletingCommentId(null);
            },
            onError: (error) => {
                console.error("댓글 삭제 실패:", error);
                setDeletingCommentId(null);
            }
        });
    };
    
    // 5-3. 삭제 취소 ([아니오] 클릭 시)
    const handleCancelDelete = () => {
        setDeletingCommentId(null);
    };

    // 6. 댓글 수정 Mutation 및 핸들러
    const { mutate: updateCommentMutate, isPending: isUpdatingComment } = useUpdateComment();

    // 6-1. 수정 모드 시작 ([수정] 클릭 시)
    const handleStartEdit = (comment: Comment) => {
        // 삭제 확인 모드와 동시에 실행되지 않도록 확인
        if (deletingCommentId) return;
        setEditingCommentId(comment.id);
        setEditedContent(comment.content);
    };

    // 6-2. 수정 취소 ([취소] 클릭 시)
    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditedContent('');
    };

    // 6-3. 수정 저장 ([저장] 클릭 시)
    const handleSaveEdit = (commentId: number) => {
        if (!editedContent.trim()) {
            console.warn("수정 내용을 입력해주세요.");
            return;
        }
        
        updateCommentMutate({ lpid: lpIdNumber, commentId, content: editedContent }, {
            onSuccess: () => {
                console.log(`댓글 ID ${commentId} 수정 완료.`);
                setEditingCommentId(null); // 수정 모드 종료
                setEditedContent('');
            },
            onError: (error) => {
                console.error("댓글 수정 실패:", error);
                setEditingCommentId(null); // 오류 발생 시 수정 모드 종료
            }
        });
    };
    
    // 7. 정렬 순서 변경 핸들러
    const handleCommentOrderChange = (newOrder: PAGINATION_ORDER) => {
        if (newOrder !== commentOrder) {
            setCommentOrder(newOrder);
            // commentOrder가 변경되면 useGetComments의 queryKey가 변경되어 자동으로 새로운 데이터가 로드됩니다.
        }
    };

    // 로딩 및 에러 처리 통합
    const isPageLoading = isLpPending || isCommentsPending;
    const isPageError = isLpError || isCommentsError || !lp?.data;

    if(isPageLoading) {
        // NOTE: 로딩 상태 통합 처리
        return <div className="flex justify-center items-center h-screen text-indigo-500 font-semibold">Loading...</div>;
    }

    if(isPageError) {
        // NOTE: 에러 상태 통합 처리
        return <div className="p-10 text-center text-red-500">데이터 로드 실패</div>;
    }

    const lpData = lp.data;

    // 댓글 작성일 포맷 함수
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('ko-KR', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit',
        });
    };

    // 활성화된 버튼 스타일
    const activeClass = "bg-indigo-600 text-white shadow-md";
    const inactiveClass = "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300";


    return (
        <div className="mt-12 p-4 max-w-4xl mx-auto bg-white shadow-2xl rounded-xl ring-4 ring-indigo-50">
            
            {/* 🖼️ 썸네일 이미지 섹션 */}
            <div className="relative mb-6">
                <img 
                    src={lpData.thumbnail} 
                    alt={lpData.title} 
                    className="w-full h-96 object-cover rounded-t-xl"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://placehold.co/800x400/3B82F6/ffffff?text=${lpData.title}`;
                    }}
                />
                
                {/* 좋아요 버튼 (이미지 위에 배치) */}
                <button 
                    onClick = {isLiked ? handleDislikeLp : handleLikeLp} 
                    className="absolute top-4 right-4 p-3 bg-white/70 hover:bg-white rounded-full shadow-lg transition duration-200 backdrop-blur-sm transform hover:scale-110"
                    aria-label={isLiked ? "좋아요 취소" : "좋아요"}
                >
                    <Heart 
                        color={isLiked ? "#EF4444" : "#4B5563"} 
                        fill = {isLiked ? "#EF4444" : "transparent"}
                        className="w-6 h-6"
                    />
                </button>
            </div>

            {/* 📝 제목 및 ID 섹션 */}
            <div className="p-6 border-b border-gray-100">
                {/* LP ID (작은 텍스트) */}
                <p className="text-sm font-semibold text-indigo-500 mb-1">
                    LP ID: #{lpData.id}
                </p>
                
                {/* 제목 */}
                <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                    {lpData.title}
                </h1>
                <p className="text-gray-500 mt-2 text-sm">
                    좋아요 수: {lpData.likes.length}개
                </p>
            </div>

            {/* 📖 내용 섹션 */}
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-700 mb-3">내용</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {lpData.content}
                </p>
            </div>

            {/* 💬 댓글 섹션 (인라인 구현) */}
            <div className="p-6">
                
                {/* 댓글 제목 및 정렬 버튼 */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-extrabold text-gray-800">댓글 ({comments.length}개)</h2>

                    {/* ⭐ 정렬 버튼 섹션 ⭐ */}
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleCommentOrderChange('desc' as PAGINATION_ORDER)}
                            className={`px-3 py-1 text-xs font-medium rounded-full transition duration-150 ${
                                commentOrder === 'desc' ? activeClass : inactiveClass
                            }`}
                            disabled={isCommentsPending}
                        >
                            최신순
                        </button>
                        <button
                            onClick={() => handleCommentOrderChange('asc' as PAGINATION_ORDER)}
                            className={`px-3 py-1 text-xs font-medium rounded-full transition duration-150 ${
                                commentOrder === 'asc' ? activeClass : inactiveClass
                            }`}
                            disabled={isCommentsPending}
                        >
                            오래된순
                        </button>
                    </div>
                </div>

                {/* 댓글 작성 폼 (인라인 구현) */}
                {!currentUserId ? (
                    <div className="p-4 bg-yellow-50 text-center text-yellow-700 rounded-lg border border-yellow-300 shadow-inner">
                        <MessageSquare className="inline w-4 h-4 mr-2"/> 댓글을 작성하려면 로그인해야 합니다.
                    </div>
                ) : (
                    <form onSubmit={handlePostComment} className="mt-4 flex space-x-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <textarea
                            value={newCommentContent}
                            onChange={(e) => setNewCommentContent(e.target.value)}
                            placeholder="댓글을 입력하세요..."
                            rows={2}
                            className="text-black flex-grow p-3 border border-indigo-300/50 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 resize-none outline-none"
                            disabled={isPostingComment}
                        />
                        <button
                            type="submit"
                            disabled={isPostingComment || !newCommentContent.trim()}
                            className="self-end px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150 disabled:bg-indigo-300 flex items-center justify-center shadow-md"
                        >
                            {isPostingComment ? '전송 중...' : <Send className="w-5 h-5" />}
                        </button>
                    </form>
                )}


                {/* 댓글 리스트 (인라인 구현) */}
                <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden shadow-md">
                    {comments.length > 0 ? (
                        comments.map((comment: Comment) => (
                            <div key={comment.id} className="p-4 border-b border-gray-100 last:border-b-0 transition duration-300 hover:bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center">
                                        <span className="font-extrabold text-gray-800 mr-2">{comment.author.name}</span>
                                        {comment.author.id === currentUserId && <span className="text-xs text-indigo-500 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">나</span>}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-gray-400 mt-0.5">{formatDate(comment.createdAt)}</span>
                                        
                                        {/* 수정/삭제 버튼 또는 확인 UI/수정 폼 */}
                                        {comment.author.id === currentUserId && (
                                            <div className="flex space-x-1 items-center">
                                                
                                                {/* 1. 수정 모드인 경우 */}
                                                {editingCommentId === comment.id ? (
                                                    <div className="flex items-center space-x-1 ml-2">
                                                        <button
                                                            onClick={() => handleSaveEdit(comment.id)}
                                                            disabled={isUpdatingComment || editedContent.trim() === ''}
                                                            className="text-xs font-semibold px-2 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                                                        >
                                                            저장
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            disabled={isUpdatingComment}
                                                            className="text-xs font-semibold px-2 py-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition disabled:opacity-50"
                                                        >
                                                            취소
                                                        </button>
                                                    </div>
                                                ) : deletingCommentId === comment.id ? (
                                                    // 2. 삭제 확인 모드인 경우
                                                    <div className="flex space-x-1 items-center ml-2">
                                                        <span className="text-sm text-red-500 font-semibold mr-1">삭제하시겠습니까?</span>
                                                        <button
                                                            onClick={() => handleConfirmDelete(comment.id)}
                                                            disabled={isDeletingComment}
                                                            className="text-xs font-semibold px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition disabled:opacity-50"
                                                        >
                                                            예
                                                        </button>
                                                        <button
                                                            onClick={handleCancelDelete}
                                                            disabled={isDeletingComment}
                                                            className="text-xs font-semibold px-2 py-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition disabled:opacity-50"
                                                        >
                             
                                                            아니오
                                                        </button>
                                                    </div>
                                                ) : (
                                                    // 3. 기본 버튼 (수정/삭제)
                                                    <>
                                                        <button
                                                            onClick={() => handleStartEdit(comment)}
                                                            disabled={isDeletingComment || isUpdatingComment}
                                                            className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-indigo-50 transition duration-150 disabled:opacity-50"
                                                            title="댓글 수정"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            disabled={isDeletingComment || isUpdatingComment}
                                                            className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition duration-150 disabled:opacity-50"
                                                            title="댓글 삭제"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 댓글 내용 또는 수정 폼 */}
                                {editingCommentId === comment.id ? (
                                    <textarea
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                        rows={3}
                                        className="text-black mt-2 w-full p-2 border border-indigo-400 rounded-lg resize-none focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        disabled={isUpdatingComment}
                                    />
                                ) : (
                                    <p className="mt-2 text-black whitespace-pre-wrap">{comment.content}</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-6 text-center text-gray-500 bg-white">
                            아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LpDetailPage;