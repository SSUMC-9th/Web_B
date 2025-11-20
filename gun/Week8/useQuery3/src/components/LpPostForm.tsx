import { useState, useRef, useMemo } from "react";
import { usePostLp } from "../hooks/mutations/Lpmutation";
import type { RequestPostLpDto } from "../type/lp"; // ResponseLpDto는 사용되지 않아 제거
import { ImageIcon, Loader2, X, UploadCloud, Trash2 } from "lucide-react";

interface LpPostFormProps {
    onClose: () => void; // 모달을 닫는 함수
}

/**
 * LP 생성 폼 컴포넌트 (제목, 내용, 태그 입력 및 관리)
 */
const LpPostForm = ({ onClose }: LpPostFormProps) => {
    // 폼 상태
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    // ⭐ [개선] File 객체 상태로 변경 (초기값은 null)
    const [selectedThumbnailFile, setSelectedThumbnailFile] = useState<File | null>(null); 
    const [newTagInput, setNewTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    
    // 파일 입력(input type="file")에 접근하기 위한 ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 썸네일 미리보기 URL 생성 (useMemo를 사용하여 불필요한 재계산 방지)
    const previewUrl = useMemo(() => {
        if (selectedThumbnailFile) {
            return URL.createObjectURL(selectedThumbnailFile);
        }
        // 기본 썸네일 플레이스홀더 URL (혹은 null)
        return 'https://placehold.co/400x400/1e293b/ffffff?text=LP+Cover'; 
    }, [selectedThumbnailFile]);

    // 유효성 검사 (썸네일 파일 존재 여부로 변경)
    const isFormValid = newPostTitle.trim() && newPostContent.trim() && tags.length > 0 && selectedThumbnailFile !== null;

    // usePostLp 훅 연결
    const { 
        mutate, 
        isPending, 
        isError, 
        error 
    } = usePostLp();

    // ----------------------------------------------------------------------
    // ⭐ 썸네일 파일 핸들러 로직 ⭐
    // ----------------------------------------------------------------------

    // 파일 선택 시 호출
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedThumbnailFile(file);
        } else {
            setSelectedThumbnailFile(null);
            if(file) alert("이미지 파일만 선택할 수 있습니다.");
        }
    };
    
    // 썸네일 삭제
    const handleRemoveThumbnail = () => {
        setSelectedThumbnailFile(null);
        // input 요소를 리셋하여 동일 파일을 다시 선택할 수 있도록 함
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        // 이전 URL 객체 메모리 해제
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
    };

    // ----------------------------------------------------------------------
    // ⭐ 태그 관리 로직 (기존 유지) ⭐
    // ----------------------------------------------------------------------

    // 태그 추가 로직
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

    // 태그 삭제 로직
    const handleRemoveTag = (tagToRemove: string) => {
        setTags((prev) => prev.filter(tag => tag !== tagToRemove));
    };

    // ⭐ 폼 제출 로직 (파일 객체에서 임시 URL을 추출하여 전송) ⭐
    const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid || isPending || !selectedThumbnailFile) {
        console.warn("폼 유효성 검사 실패 또는 로딩 중입니다.");
        return;
    }
    
    // ... (submissionData 생성 로직 유지) ...
    const submissionData: RequestPostLpDto = {
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        tags: tags,
        thumbnail: previewUrl, // 🚨 실제 구현에서는 서버 업로드 후 받은 URL을 사용해야 함
        published: true,
    };

    // ⭐ [수정] mutate 함수 호출 시 onSuccess/onError 콜백 전달
    mutate(submissionData, {
        onSuccess: (data) => {
            // 성공 시 알림 및 모달 닫기
            alert("LP가 성공적으로 생성되었습니다."); 
            onClose();
            console.log("LP 생성 성공", data);
            
            // 💡 추가적으로 쿼리 무효화(invalidateQueries) 로직을 여기에 넣을 수 있습니다.
            // 예: queryClient.invalidateQueries(['lps']); 
        },
        onError: (err) => {
            // 실패 시 에러 콘솔 출력
            console.error("LP 생성 실패:", err);
            // 에러 상태는 이미 isError/error에 의해 컴포넌트 하단에 표시됨
        }
    });
};

    // ----------------------------------------------------------------------
    // ⭐ 렌더링 ⭐
    // ----------------------------------------------------------------------

    return (
        <form onSubmit={handlePostSubmit} className="flex flex-col space-y-5 p-2">
            <h3 className="text-2xl font-extrabold text-white border-b border-gray-700 pb-3 flex items-center justify-between">
                <span>✨ 새 LP 생성</span>
                <button type="button" onClick={onClose} className="text-gray-400 hover:text-white transition p-1">
                    <X className="w-6 h-6" />
                </button>
            </h3>

            {/* 썸네일 미리보기 및 등록 섹션 */}
            <div className="flex space-x-4">
                {/* 썸네일 미리보기 */}
                <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden bg-gray-800 border border-gray-600 relative group">
                    <img 
                        src={previewUrl} 
                        alt="LP 썸네일 미리보기"
                        className="w-full h-full object-cover" 
                    />
                    {/* 삭제 버튼 오버레이 */}
                    {selectedThumbnailFile && (
                        <button
                            type="button"
                            onClick={handleRemoveThumbnail}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                            aria-label="썸네일 삭제"
                        >
                            <Trash2 className="w-6 h-6 text-red-400" />
                        </button>
                    )}
                </div>

                {/* 파일 입력 및 버튼 */}
                <div className="flex-1 flex flex-col justify-between">
                    <p className="text-sm text-gray-400 mb-2">LP 커버 이미지 (필수):</p>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*"
                        className="hidden" // 실제 input은 숨김
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={selectedThumbnailFile !== null}
                        className="flex items-center justify-center px-4 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-150 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        <UploadCloud className="w-5 h-5 mr-2" />
                        {selectedThumbnailFile ? "이미지 선택 완료" : "커버 이미지 선택"}
                    </button>
                    <p className="text-xs text-gray-500 mt-2">최대 1MB, JPEG/PNG 권장</p>
                </div>
            </div>
            
            {/* LP Name 입력 */}
            <input
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="LP Name (제목)을 입력하세요"
                className="p-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 outline-none placeholder-gray-400"
            />
            
            {/* LP Content 입력 */}
            <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="LP Content (내용)을 입력하세요"
                rows={4}
                className="p-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 outline-none resize-none placeholder-gray-400"
            />
            
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
                    placeholder={`태그 입력 (최대 ${5 - tags.length}개 남음)`}
                    className="flex-1 p-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 outline-none placeholder-gray-400"
                />
                <button
                    type="button" 
                    onClick={handleAddTag}
                    disabled={!newTagInput.trim() || tags.length >= 5 || isPending} 
                    className="flex-shrink-0 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150 disabled:bg-indigo-400 disabled:text-indigo-200"
                >
                    Add Tag
                </button>
            </div>

            {/* 추가된 태그 목록 표시 */}
            <div className="flex flex-wrap gap-2 pt-1 min-h-[32px]">
                {tags.map((tag) => (
                    <div key={tag} className="flex items-center bg-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full shadow-md">
                        <span>#{tag}</span>
                        <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-purple-200 hover:text-white transition"
                            aria-label={`${tag} 태그 삭제`}
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>

            {/* 에러 메시지 */}
            {isError && error && (
                <p className="text-red-400 text-sm text-center bg-red-900/50 p-2 rounded-lg transition-all duration-300">
                    ⚠️ {error.message || "LP 생성 중 알 수 없는 오류가 발생했습니다."}
                </p>
            )}

            {/* 푸터 버튼 */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={!isFormValid || isPending}
                    className="w-full px-4 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-150 shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                    <span>{isPending ? 'LP 생성 중...' : 'LP 생성 및 게시'}</span>
                </button>
            </div>
        </form>
    );
};

export default LpPostForm;