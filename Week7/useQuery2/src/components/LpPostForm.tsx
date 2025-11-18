import React, { useCallback, useRef, useState } from 'react';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react'; // ImageIcon 아이콘 사용
import type { RequestPostLpDto, ResponseLpDto } from '../type/lp';
import { usePostLp } from '../hooks/mutations/Lpmutation';

interface LpPostFormProps {
    onClose: () => void; // 모달을 닫는 함수
}

/**
 * LP 생성 폼 컴포넌트 (제목, 내용, 태그 입력 및 관리)
 */
const LpPostForm = ({ onClose }: LpPostFormProps) => {
    // 파일 입력 참조
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 폼 상태
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    // 이미지 파일이 Base64 Data URL로 여기에 저장되거나, 기본 Placeholder URL이 저장됩니다.
    const [newThumbnailUrl, setNewThumbnailUrl] = useState('https://placehold.co/400x400/1e293b/ffffff?text=LP+Record');
    const [newTagInput, setNewTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    
    // 유효성 검사 (썸네일 URL 포함) - 이미지 필드도 채워져야 유효합니다.
    const isFormValid = newPostTitle.trim() && newPostContent.trim() && tags.length > 0 && newThumbnailUrl.trim();

    // ----------------------------------------------------------------------
    // ⭐ 이미지 파일 처리 로직 ⭐
    // ----------------------------------------------------------------------

    /** 파일 선택 시 호출되어 이미지를 Data URL로 변환합니다. */
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 파일 크기 제한 (예: 5MB)
        if (file.size > 5 * 1024 * 1024) {
            console.error("파일 크기가 너무 큽니다. 5MB 이하의 파일을 선택해 주세요.");
            setNewThumbnailUrl('https://placehold.co/400x400/cc0000/ffffff?text=FILE+TOO+LARGE');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            // Base64 Data URL로 상태 업데이트
            setNewThumbnailUrl(reader.result as string);
        };
        reader.onerror = () => {
            console.error("파일을 읽는 데 실패했습니다.");
            setNewThumbnailUrl('https://placehold.co/400x400/cc0000/ffffff?text=READ+ERROR');
        };
        reader.readAsDataURL(file);
    };

    /** 파일 선택 UI를 트리거합니다. */
    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    // ----------------------------------------------------------------------
    // ⭐ Mutation Hook 연결 및 콜백 정의 ⭐
    // ----------------------------------------------------------------------

    // 성공 콜백: API 호출 성공 후 모달 닫기 (ResponseLpDto 인자를 받도록 수정)
    const handleSuccess = useCallback((data: ResponseLpDto) => {
        console.log("✅ LP 생성 성공! 새로 생성된 LP ID:", data.data?.id);
        onClose(); 
    }, [onClose]);

    // 에러 콜백: API 호출 실패 시 (Error 인자를 받도록 수정)
    const handleError = useCallback((error: Error) => {
        console.error("❌ LP 생성 실패 (콜백):", error.message);
    }, []);

    // usePostLp 훅 연결
    const { 
        mutate, 
        isPending, // 로딩 상태
        isError, 
        error 
    } = usePostLp();
    
    // ----------------------------------------------------------------------
    // ⭐ 태그 관리 로직 ⭐
    // ----------------------------------------------------------------------

    // ⭐ 태그 추가 로직 ⭐
    const handleAddTag = () => {
        const trimmedTag = newTagInput.trim().toLowerCase();
        
        if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
            setTags((prev) => [...prev, trimmedTag]);
            setNewTagInput(''); 
        } else if (tags.length >= 5) {
             console.warn("태그는 최대 5개까지 추가할 수 있습니다.");
        } else if (trimmedTag && tags.includes(trimmedTag)) {
            console.warn(`'${trimmedTag}' 태그는 이미 추가되었습니다.`);
            setNewTagInput(''); 
        }
    };

    // ⭐ 태그 삭제 로직 ⭐
    const handleRemoveTag = (tagToRemove: string) => {
        setTags((prev) => prev.filter(tag => tag !== tagToRemove));
    };

    // ⭐ 폼 제출 로직 (mutate 호출) ⭐
    const handlePostSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid || isPending) {
            return;
        }
        
        // RequestPostLpDto 구조에 맞게 데이터 준비 (PostLpVariables 타입과 동일)
        // newThumbnailUrl에는 이제 파일의 Base64 데이터가 포함될 수 있습니다.
        const submissionData: RequestPostLpDto = {
            title: newPostTitle.trim(),
            content: newPostContent.trim(),
            tags: tags,
            thumbnail: newThumbnailUrl.trim(), 
            published: true, // 기본값 설정
        };

        // mutate 함수를 호출하여 API 요청 시작
        mutate(submissionData, { 
            onSuccess: handleSuccess,
            onError: handleError,
        });
    };

    // ----------------------------------------------------------------------
    // ⭐ 렌더링 ⭐
    // ----------------------------------------------------------------------

    return (
        <form onSubmit={handlePostSubmit} className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold text-white pb-1 flex items-center justify-between">
                <span>새 LP 생성</span>
                <svg width="40" height="40" viewBox="0 0 100 100" className="text-gray-400">
                    <circle cx="50" cy="50" r="48" fill="#1a1a1a" stroke="#2c2c2c" strokeWidth="2"/>
                    <circle cx="50" cy="50" r="30" fill="#050505"/>
                    <circle cx="50" cy="50" r="5" fill="#ffffff"/>
                </svg>
            </h3>

            {/* LP Name 입력 */}
            <input
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="LP Name (제목)을 입력하세요"
                className="p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 outline-none placeholder-gray-400"
            />
            
            {/* LP Content 입력 */}
            <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="LP Content (내용)을 입력하세요"
                rows={4}
                className="p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 outline-none resize-none placeholder-gray-400"
            />

            {/* 💡 썸네일 파일 업로드 및 미리보기 섹션 */}
            <div className="space-y-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-sm font-semibold text-gray-300">LP 썸네일 이미지</p>
                <div className="flex items-center space-x-4">
                    {/* 이미지 미리보기 */}
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-900 rounded-lg overflow-hidden border border-gray-600 shadow-inner">
                        <img 
                            src={newThumbnailUrl} 
                            alt="LP Thumbnail Preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // 이미지 로드 실패 시 기본 플레이스홀더 표시
                                e.currentTarget.onerror = null; 
                                e.currentTarget.src = 'https://placehold.co/400x400/374151/ffffff?text=No+Image';
                            }}
                        />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                        {/* 숨겨진 파일 입력 필드 */}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageSelect} 
                            accept="image/*"
                            className="hidden" 
                        />

                        {/* 파일 선택 버튼 */}
                        <button
                            type="button"
                            onClick={triggerFileSelect}
                            className="w-full flex items-center justify-center px-4 py-2 bg-indigo-500 text-white font-medium rounded-md hover:bg-indigo-600 transition duration-150 disabled:bg-gray-700 disabled:text-gray-400"
                            disabled={isPending}
                        >
                            <ImageIcon className="w-5 h-5 mr-2"/>
                            이미지 파일 선택
                        </button>

                        {/* 썸네일 URL 제거 버튼 */}
                        {newThumbnailUrl.length > 0 && newThumbnailUrl !== 'https://placehold.co/400x400/1e293b/ffffff?text=LP+Record' && (
                            <button
                                type="button"
                                onClick={() => {
                                    setNewThumbnailUrl('https://placehold.co/400x400/1e293b/ffffff?text=LP+Record');
                                    // ⭐ 파일 입력 필드의 값(value)을 초기화하여 같은 파일 재선택 가능하도록 수정
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                    }
                                }}
                                className="w-full flex items-center justify-center px-4 py-1.5 text-sm bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition duration-150"
                                disabled={isPending}
                            >
                                <X className="w-4 h-4 mr-1"/>
                                이미지 제거
                            </button>
                        )}
                    </div>
                </div>
                {/* 썸네일 URL을 직접 입력할 수 있는 옵션 (파일 선택과 분리) */}
                 <input
                    type="url"
                    value={newThumbnailUrl.startsWith('data:image') ? '' : newThumbnailUrl} // 파일 선택 시 URL 입력 필드는 비움
                    onChange={(e) => setNewThumbnailUrl(e.target.value)}
                    placeholder="혹은 URL을 직접 입력 (파일 미선택 시)"
                    className="w-full p-2 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:border-indigo-500 outline-none placeholder-gray-400 text-sm"
                />
            </div>
            
            {/* LP Tag 입력 및 추가 버튼 섹션 */}
            <div className="flex space-x-2 items-stretch">
                <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => { 
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                        }
                    }}
                    placeholder="LP Tag 입력 후 Add"
                    className="flex-1 p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 outline-none placeholder-gray-400"
                />
                <button
                    type="button" 
                    onClick={handleAddTag}
                    // 로딩 중이거나 태그 입력이 유효하지 않으면 비활성화
                    disabled={!newTagInput.trim() || tags.length >= 5 || isPending} 
                    className="flex-shrink-0 px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 transition duration-150 disabled:bg-gray-700 disabled:text-gray-400"
                >
                    Add
                </button>
            </div>

            {/* 추가된 태그 목록 표시 */}
            <div className="flex flex-wrap gap-2 pt-1 min-h-[32px]">
                {tags.map((tag) => (
                    <div key={tag} className="flex items-center bg-indigo-600 text-white text-sm font-medium px-3 py-1 rounded-full shadow-md">
                        <span>{tag}</span>
                        <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-indigo-100 hover:text-white transition"
                            aria-label={`${tag} 태그 삭제`}
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>

            {/* 에러 메시지 (isError 상태 사용) */}
            {isError && error && (
                <p className="text-red-400 text-sm text-center bg-red-900/50 p-2 rounded-md transition-all duration-300">
                    ⚠️ {error.message || "알 수 없는 LP 생성 오류"}
                </p>
            )}

            {/* 푸터 버튼 */}
            <div className="pt-4">
                <button
                    type="submit"
                    // 폼 유효하지 않거나 로딩 중이면 비활성화
                    disabled={!isFormValid || isPending}
                    className="w-full px-4 py-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition duration-150 shadow-lg disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    {isPending && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
                    <span>{isPending ? 'LP 생성 중...' : 'Add LP'}</span>
                </button>
            </div>
        </form>
    );
};

export default LpPostForm;