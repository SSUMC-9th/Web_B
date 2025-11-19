import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import {Heart, Send, MessageSquare, Trash2, Edit, Save, X, Upload} from "lucide-react"; // Upload 아이콘 추가
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../context/AutoContext";
import type { Likes } from "../type/lp";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import usePostLike from "../hooks/mutations/usePostLike";
import { useUpdateLp, useDeleteLp } from "../hooks/mutations/Lpmutation"; 

// --- 댓글 기능 Import ---
import type { Comment } from "../type/comment"; 
import { useGetComments } from '../hooks/queries/useComments';
import { useDeleteComment, usePostComment, useUpdateComment } from '../hooks/mutations/useComment'; 
import type { PAGINATION_ORDER } from '../enums/common';


const LpDetailPage = () => {
    const {lpid} = useParams();
    const navigate = useNavigate();
    const lpIdNumber = Number(lpid); 
    const {accessToken} = useAuth();
    
    // LP 편집 상태
    const [isEditingLp, setIsEditingLp] = useState(false);
    const [editedLpTitle, setEditedLpTitle] = useState('');
    const [editedLpContent, setEditedLpContent] = useState('');
    // ⭐ 썸네일 편집 상태: Data URL 또는 일반 URL을 저장 ⭐
    const [editedLpThumbnail, setEditedLpThumbnail] = useState(''); 
    
    // LP 삭제 확인 상태 (window.confirm 대체)
    const [isConfirmingDeleteLp, setIsConfirmingDeleteLp] = useState(false);

    // 파일 업로드 관련 상태
    const [selectedFileName, setSelectedFileName] = useState('');
    const [fileError, setFileError] = useState<string | null>(null);

    // 댓글 작성 폼 상태
    const [newCommentContent, setNewCommentContent] = useState('');

    // ⭐ 댓글 수정/삭제/정렬 관련 상태 ⭐
    const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null); 
    const [editedContent, setEditedContent] = useState(''); 
    
    // ⭐ 댓글 정렬 순서 상태 추가 (기본값: 최신순 'desc') ⭐
    const [commentOrder, setCommentOrder] = useState<'desc' | 'asc'>('desc' as PAGINATION_ORDER);

    // 1. LP 상세 정보 조회
    const {
        data:lp, 
        isPending: isLpPending,
        isError: isLpError} = useGetLpDetail({lpid: lpIdNumber})
    const {data: me} = useGetMyInfo(accessToken);
    const currentUserId = me?.data.id; 

    // LP 데이터가 로드된 후 작성자 ID를 기반으로 권한 확인
    const lpData = lp?.data;
    const isAuthor = lpData?.author.id === currentUserId;
    
    // 데이터 로드 시 편집 상태 초기화
    useEffect(() => {
        if (lpData) {
            setEditedLpTitle(lpData.title);
            setEditedLpContent(lpData.content);
            // 썸네일 상태 초기화
            setEditedLpThumbnail(lpData.thumbnail);
        }
    }, [lpData]);

    // ⭐ 파일 선택 및 Data URL 변환 핸들러 ⭐
    /** 파일 선택 시 호출되어 이미지를 Data URL로 변환합니다. */
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileError(null);
        const file = e.target.files?.[0];
        if (!file) {
            setSelectedFileName('');
            return;
        }

        // 파일 크기 제한 (예: 5MB)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            const errorMsg = `파일 크기가 너무 큽니다. 5MB 이하의 파일을 선택해 주세요. (현재: ${(file.size / 1024 / 1024).toFixed(2)}MB)`;
            console.error(errorMsg);
            setFileError(errorMsg);
            setSelectedFileName('');
            setEditedLpThumbnail(lpData?.thumbnail || ''); // 원본으로 되돌림
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            // Base64 Data URL로 상태 업데이트
            setEditedLpThumbnail(reader.result as string);
            setSelectedFileName(file.name);
            console.log("File loaded successfully as Data URL.");
        };
        reader.onerror = () => {
            const errorMsg = "파일을 읽는 데 실패했습니다.";
            console.error(errorMsg);
            setFileError(errorMsg);
            setSelectedFileName('');
            setEditedLpThumbnail(lpData?.thumbnail || '');
        };
        reader.readAsDataURL(file);
    };

    // 2. 댓글 목록 조회 
    const {
        data: commentsResponse, 
        isPending: isCommentsPending,
        isError: isCommentsError
    } = useGetComments({ 
        lpid: lpIdNumber, 
        limit: 30, 
        order: commentOrder 
    });

    // 댓글 배열 추출
    const comments: Comment[] = commentsResponse?.data?.data || []; 
    
    // 3. 좋아요/싫어요 Mutation
    const {mutate:likeMutate} = usePostLike();
    const {mutate:disLikeMutate} = useDeleteLike();

    const isLiked = lpData?.likes.some((like:Likes)=>like.userId === currentUserId);

    const handleLikeLp = async() => {
        if (!currentUserId) { console.warn("로그인이 필요합니다."); return; }
        await likeMutate({lpid: lpIdNumber});
    }
    
    const handleDislikeLp = async() => {
        if (!currentUserId) return;
        await disLikeMutate({lpid: lpIdNumber});
    }
    
    // ⭐ 4. LP 수정 및 삭제 Mutation (새로 추가) ⭐
    const {mutate: updateLpMutate, isPending: isUpdatingLp} = useUpdateLp();
    const {mutate: deleteLpMutate, isPending: isDeletingLp} = useDeleteLp();
    
    // --- LP 수정 핸들러 ---
    
    // 수정 모드 시작 (이동 대신 인라인 편집 활성화)
    const handleStartEditLp = () => {
        setIsEditingLp(true);
        // 편집 모드 진입 시 댓글 수정/삭제 확인 상태 초기화
        setDeletingCommentId(null);
        setEditingCommentId(null); 
        // 데이터가 변경되었을 수 있으므로 다시 최신 데이터로 초기화
        if (lpData) {
            setEditedLpTitle(lpData.title);
            setEditedLpContent(lpData.content);
            // 썸네일 상태 재초기화
            setEditedLpThumbnail(lpData.thumbnail);
        }
        setFileError(null);
        setSelectedFileName('');
    }
    
    // 수정 취소
    const handleCancelEditLp = () => {
        setIsEditingLp(false);
        // 상태 초기화
        if (lpData) {
            setEditedLpTitle(lpData.title);
            setEditedLpContent(lpData.content);
            // 썸네일 상태 초기화
            setEditedLpThumbnail(lpData.thumbnail);
        }
        setFileError(null);
        setSelectedFileName('');
    }
    
    // 수정 내용 저장
    const handleSaveLpEdit = async () => {
        if (!editedLpTitle.trim() || !editedLpContent.trim() || !editedLpThumbnail.trim() || fileError) {
            console.error("제목, 내용, 썸네일(또는 URL)을 모두 입력해야 하며 파일 오류가 없어야 합니다.");
            setFileError(fileError || "필수 입력 항목을 확인해 주세요.");
            return;
        }
        
        // Base64 Data URL 또는 일반 URL이 전송됨. 백엔드에서 Base64를 처리해야 함.
        await updateLpMutate({
            lpid: lpIdNumber, 
            title: editedLpTitle, 
            content: editedLpContent,
            thumbnail: editedLpThumbnail 
        }, {
            onSuccess: (response) => {
                console.log("LP가 성공적으로 수정되었습니다.", response); 
                setIsEditingLp(false); // 수정 모드 종료
            },
            onError: (error) => {
                console.error("LP 수정 실패:", error);
                setFileError("LP 수정 중 오류가 발생했습니다.");
            }
        });
    }

    // --- LP 삭제 핸들러 (인라인 확인 UI로 대체) ---

    // 삭제 확인 요청 (Trash2 클릭 시)
    const handleInitiateDeleteLp = () => {
        if (!currentUserId || !isAuthor) {
            console.warn("권한이 없거나 로그인되지 않았습니다."); 
            return;
        }
        setIsConfirmingDeleteLp(true);
    }
    
    // 삭제 실행 ([예] 클릭 시)
    const handleConfirmDeleteLp = async () => {
        if (!currentUserId || !isAuthor) return;
        setIsConfirmingDeleteLp(false); // UI 먼저 닫기

        await deleteLpMutate({lpid: lpIdNumber}, {
            onSuccess: () => {
                console.log("LP가 성공적으로 삭제되었습니다. 홈으로 이동합니다."); 
                // 삭제 성공 후 목록 페이지로 이동
                navigate('/');
            },
            onError: (error) => {
                console.error("LP 삭제 실패:", error);
                // 오류 메시지 표시 로직 추가
            }
        });
    }

    // 삭제 취소 ([아니오] 클릭 시)
    const handleCancelDeleteLp = () => {
        setIsConfirmingDeleteLp(false);
    }


    // 5. 댓글 작성 Mutation 및 핸들러 (기존)
    const { mutate: postCommentMutate, isPending: isPostingComment } = usePostComment();
    
    const handlePostComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCommentContent.trim() || !currentUserId) {
            console.warn("내용을 입력하거나 로그인해야 합니다.");
            return;
        }

        postCommentMutate({ lpid: lpIdNumber, content: newCommentContent }, {
            onSuccess: () => {
                setNewCommentContent('');
                console.log("댓글 작성 성공");
            },
            onError: (error) => {
                console.error("댓글 작성 실패:", error);
            }
        });
    };
    
    // 6. 댓글 삭제 Mutation 및 핸들러 (기존)
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
        if (deletingCommentId || isEditingLp || isConfirmingDeleteLp) return;
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
    const isPageError = isLpError || isCommentsError || !lpData;

    if(isPageLoading) {
        // NOTE: 로딩 상태 통합 처리
        return <div className="flex justify-center items-center h-screen text-indigo-500 font-semibold">Loading...</div>;
    }

    if(isPageError || !lpData) {
        // NOTE: 에러 상태 통합 처리
        return <div className="p-10 text-center text-red-500">데이터 로드 실패</div>;
    }


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
                    // 편집 모드일 때는 임시 상태 URL 사용, 아니면 실제 데이터 URL 사용
                    src={isEditingLp ? editedLpThumbnail : lpData.thumbnail} 
                    alt={lpData.title} 
                    className="w-full h-96 object-cover rounded-t-xl"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://placehold.co/800x400/3B82F6/ffffff?text=${lpData.title}`;
                    }}
                />
                
                {/* ⭐ 썸네일 파일 선택 필드 (편집 모드 시) ⭐ */}
                {isAuthor && isEditingLp && (
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-black/50 backdrop-blur-sm">
                        {/* 파일 입력 필드 (숨김) */}
                        <input
                            type="file"
                            id="thumbnail-upload"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                            disabled={isUpdatingLp}
                        />

                        <div className="flex items-center space-x-3">
                            {/* 파일 선택 버튼 */}
                            <label 
                                htmlFor="thumbnail-upload"
                                className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition duration-150 cursor-pointer 
                                    ${isUpdatingLp ? 'bg-gray-400 text-gray-200' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
                            >
                                <Upload className="w-4 h-4" />
                                <span>이미지 선택 ({selectedFileName ? '변경됨' : '선택'})</span>
                            </label>

                            {/* 파일 이름 또는 URL 표시 */}
                            <p className="flex-1 text-sm truncate">
                                <span className="font-medium text-white/80">
                                    {selectedFileName 
                                        ? selectedFileName
                                        : editedLpThumbnail.length > 50
                                            ? 'Base64 이미지 (미리보기 확인)'
                                            : editedLpThumbnail
                                    }
                                </span>
                            </p>
                        </div>
                        
                        {/* 파일 오류 메시지 */}
                        {fileError && (
                            <p className="mt-2 text-sm font-medium text-red-300">
                                {fileError}
                            </p>
                        )}
                    </div>
                )}
                
                {/* 좋아요 및 수정/삭제 버튼 컨테이너 */}
                <div className="absolute top-4 right-4 flex space-x-3">
                    {/* ⭐ 작성자에게만 표시되는 LP 수정/삭제 UI ⭐ */}
                    {isAuthor && (
                        <>
                            {/* 1. LP 편집 모드 버튼 (수정/저장/취소) */}
                            {isEditingLp ? (
                                // 편집 모드: 저장 / 취소
                                <>
                                    <button
                                        onClick={handleSaveLpEdit}
                                        disabled={isUpdatingLp || editedLpTitle.trim() === '' || editedLpContent.trim() === '' || editedLpThumbnail.trim() === '' || !!fileError}
                                        className="p-3 bg-indigo-600/90 text-white rounded-full shadow-lg transition duration-200 backdrop-blur-sm transform hover:scale-110 disabled:opacity-50"
                                        aria-label="LP 저장"
                                        title="LP 저장"
                                    >
                                        {isUpdatingLp ? <span className="text-sm">저장 중...</span> : <Save className="w-6 h-6" />}
                                    </button>
                                    <button
                                        onClick={handleCancelEditLp}
                                        disabled={isUpdatingLp}
                                        className="p-3 bg-white/70 text-gray-700 rounded-full shadow-lg transition duration-200 backdrop-blur-sm transform hover:scale-110"
                                        aria-label="LP 수정 취소"
                                        title="LP 수정 취소"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </>
                            ) : (
                                // 기본 모드: 수정 버튼
                                <button 
                                    onClick={handleStartEditLp} 
                                    className="p-3 bg-white/70 hover:bg-white rounded-full shadow-lg transition duration-200 backdrop-blur-sm transform hover:scale-110 text-gray-700 hover:text-indigo-600 disabled:opacity-50"
                                    aria-label="LP 수정 시작"
                                    title="LP 수정"
                                    disabled={isDeletingLp || isConfirmingDeleteLp} // 삭제 또는 댓글 수정 중일 때 비활성화
                                >
                                    <Edit className="w-6 h-6" />
                                </button>
                            )}

                            {/* 2. LP 삭제 버튼 및 확인 UI */}
                            {isConfirmingDeleteLp ? (
                                // 삭제 확인 모드: 예 / 아니오
                                <div className="flex items-center space-x-2 p-3 bg-red-500/90 text-white rounded-full shadow-lg backdrop-blur-sm">
                                    <span className="text-sm font-semibold whitespace-nowrap">삭제?</span>
                                    <button
                                        onClick={handleConfirmDeleteLp}
                                        disabled={isDeletingLp}
                                        className="px-3 py-1 bg-white text-red-600 rounded-full hover:bg-gray-100 disabled:opacity-50 transition"
                                    >
                                        {isDeletingLp ? '처리 중' : '예'}
                                    </button>
                                    <button
                                        onClick={handleCancelDeleteLp}
                                        disabled={isDeletingLp}
                                        className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 disabled:opacity-50 transition"
                                    >
                                        아니오
                                    </button>
                                </div>
                            ) : (
                                // 기본 모드: 삭제 버튼
                                <button 
                                    onClick={handleInitiateDeleteLp} 
                                    className="p-3 bg-white/70 hover:bg-white rounded-full shadow-lg transition duration-200 backdrop-blur-sm transform hover:scale-110 text-red-500 hover:text-red-700 disabled:opacity-50"
                                    aria-label="LP 삭제"
                                    title="LP 삭제"
                                    disabled={isEditingLp || isUpdatingLp} // 수정 중일 때 비활성화
                                >
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            )}
                        </>
                    )}

                    {/* 좋아요 버튼 (기존) */}
                    <button 
                        onClick = {isLiked ? handleDislikeLp : handleLikeLp} 
                        className="p-3 bg-white/70 hover:bg-white rounded-full shadow-lg transition duration-200 backdrop-blur-sm transform hover:scale-110"
                        aria-label={isLiked ? "좋아요 취소" : "좋아요"}
                    >
                        <Heart 
                            color={isLiked ? "#EF4444" : "#4B5563"} 
                            fill = {isLiked ? "#EF4444" : "transparent"}
                            className="w-6 h-6"
                        />
                    </button>
                </div>
			</div>

            {/* 📝 제목 및 ID 섹션 */}
            <div className="p-6 border-b border-gray-100">
                {/* LP ID (작은 텍스트) */}
                <p className="text-sm font-semibold text-indigo-500 mb-1">
                    LP ID: #{lpData.id}
                </p>
                
                {/* 제목 (편집 가능) */}
                {isEditingLp ? (
                    <input
                        type="text"
                        value={editedLpTitle}
                        onChange={(e) => setEditedLpTitle(e.target.value)}
                        className="w-full text-4xl font-extrabold text-gray-900 leading-tight p-2 border border-indigo-400 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-150"
                        disabled={isUpdatingLp}
                    />
                ) : (
                    <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                        {lpData.title}
                    </h1>
                )}
                <p className="text-gray-500 mt-2 text-sm">
                    좋아요 수: {lpData.likes.length}개
                </p>
            </div>

            {/* 📖 내용 섹션 */}
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-700 mb-3">내용</h2>
                {/* 내용 (편집 가능) */}
                {isEditingLp ? (
                    <textarea
                        value={editedLpContent}
                        onChange={(e) => setEditedLpContent(e.target.value)}
                        rows={10}
                        className="w-full text-gray-600 leading-relaxed p-3 border border-indigo-400 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition duration-150"
                        disabled={isUpdatingLp}
                    />
                ) : (
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {lpData.content}
                    </p>
                )}
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
                            disabled={isPostingComment || isEditingLp || isConfirmingDeleteLp}
                        />
                        <button
                            type="submit"
                            disabled={isPostingComment || !newCommentContent.trim() || isEditingLp || isConfirmingDeleteLp}
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
                                                            disabled={isDeletingComment || isUpdatingComment || isEditingLp || isConfirmingDeleteLp}
                                                            className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-indigo-50 transition duration-150 disabled:opacity-50"
                                                            title="댓글 수정"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteComment(comment.id)}
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
                                        className="text-black mt-2 w-full p-2 border border-indigo-400 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
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