import { useState, useEffect, useRef } from "react";
import { X, Upload } from "lucide-react";
import { useCreateLp } from "../hooks/mutations/useCreateLp.ts";

interface CreateLpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 기본 이미지 URL (Unsplash placeholder)
const DEFAULT_THUMBNAIL = "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=800&fit=crop";

export const CreateLpModal = ({ isOpen, onClose }: CreateLpModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [previewImage, setPreviewImage] = useState<string>(DEFAULT_THUMBNAIL);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createLp, isPending: isCreating } = useCreateLp();

  // 모달 바깥 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // 모달 열릴 때 body 스크롤 방지
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 이미지 파일인지 확인
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드할 수 있습니다.");
        return;
      }

      setSelectedFile(file);

      // 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // URL 입력 핸들러
  const handleThumbnailUrlChange = (url: string) => {
    setThumbnailUrl(url);
    if (url.trim()) {
      setPreviewImage(url);
      setSelectedFile(null);
    } else {
      setPreviewImage(DEFAULT_THUMBNAIL);
    }
  };

  // 파일 선택 버튼 클릭
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 태그 추가
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  // 태그 제거
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 태그가 최소 1개 필요
    if (tags.length === 0) {
      alert("태그를 최소 1개 이상 추가해주세요.");
      return;
    }

    const finalThumbnail = thumbnailUrl || DEFAULT_THUMBNAIL;

    const lpData = {
      title,
      content,
      thumbnail: finalThumbnail,
      tags,
      published: true,
    };

    // API 호출
    createLp(lpData, {
      onSuccess: () => {
        alert("LP가 성공적으로 생성되었습니다!");

        // 폼 초기화
        setTitle("");
        setContent("");
        setTags([]);
        setTagInput("");
        setThumbnailUrl("");
        setPreviewImage(DEFAULT_THUMBNAIL);
        setSelectedFile(null);
        onClose();
      },
      onError: (error: any) => {
        console.error("LP 생성 오류:", error);
        alert(`LP 생성에 실패했습니다: ${error.response?.data?.message || error.message}`);
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div
        ref={modalRef}
        className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            새 LP 작성
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* LP 썸네일 이미지 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              LP 썸네일 이미지
            </label>

            {/* 이미지 미리보기 */}
            <div className="mb-3">
              <div className="aspect-square w-full max-w-xs mx-auto overflow-hidden rounded-lg border-2 border-gray-700">
                <img
                  src={previewImage}
                  alt="썸네일 미리보기"
                  className="w-full h-full object-cover"
                  onError={() => setPreviewImage(DEFAULT_THUMBNAIL)}
                />
              </div>
            </div>

            {/* 파일 선택 버튼 */}
            <div className="flex gap-2 mb-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleFileButtonClick}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                이미지 파일 선택
              </button>
            </div>

            {/* URL 입력 (대체 옵션) */}
            <div>
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => handleThumbnailUrlChange(e.target.value)}
                placeholder="또는 이미지 URL을 입력하세요"
                className="w-full bg-[#141517] border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                {selectedFile
                  ? `선택된 파일: ${selectedFile.name} (URL 입력 시 파일이 무시됩니다)`
                  : "이미지를 선택하지 않으면 기본 이미지가 사용됩니다"}
              </p>
            </div>
          </div>

          {/* LP 이름 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              LP 이름 <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="앨범 제목을 입력해주세요"
              className="w-full bg-[#141517] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
              required
            />
          </div>

          {/* LP 콘텐츠 */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
              LP 콘텐츠 <span className="text-red-400">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="앨범에 대한 설명을 입력해주세요"
              rows={6}
              className="w-full bg-[#141517] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all resize-none"
              required
            />
          </div>

          {/* LP 태그 */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
              LP 태그
            </label>
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="태그를 입력하고 Enter를 누르세요"
              className="w-full bg-[#141517] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">
              Enter 키를 눌러 태그를 추가할 수 있습니다
            </p>

            {/* 태그 목록 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full text-sm border border-pink-500/30 flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-pink-300 transition-colors"
                      aria-label={`${tag} 태그 제거`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !content.trim() || isCreating}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                title.trim() && content.trim() && !isCreating
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isCreating ? "작성 중..." : "작성하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
