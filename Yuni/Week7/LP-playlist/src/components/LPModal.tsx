import React, { useState } from 'react';
import { uploadImage } from '../apis/auth';

interface LPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLP: (lp: { title: string; content: string; tags: string[]; thumbnail: string | null; published: boolean }) => void;
}

export default function LPModal({ isOpen, onClose, onAddLP }: LPModalProps) {
  const [lpName, setLpName] = useState<string>('');
  const [lpContent, setLpContent] = useState<string>('');
  const [lpTag, setLpTag] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleAddTag = () => {
    if (lpTag.trim()) {
      setTags([...tags, lpTag.trim()]);
      setLpTag('');
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async () => {
    if (lpName.trim()) {
      try {
        let thumbnailUrl: string | null = null;

        // 이미지 파일이 있으면 업로드
        if (imageFile) {
          setIsUploadingImage(true);
          thumbnailUrl = await uploadImage(imageFile);
          setIsUploadingImage(false);
        }

        onAddLP({
          title: lpName,
          content: lpContent,
          thumbnail: thumbnailUrl,
          tags: tags,
          published: isPublished,
        });

        // 폼 초기화
        setLpName('');
        setLpContent('');
        setLpTag('');
        setTags([]);
        setImageFile(null);
        setImagePreview(null);
        setIsPublished(true);
        onClose();
      } catch (error: any) {
        setIsUploadingImage(false);
        console.error('❌ LP 추가 실패:', error);
        alert(error.response?.data?.message || 'LP 추가 중 오류가 발생했습니다.');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 배경(backdrop) 자신을 클릭했을 때만 닫기
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex justify-center mb-6">
          {imagePreview ? (
            <div 
              className="relative w-64 h-48 cursor-pointer"
              onClick={handleImageClick}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-48 h-48 z-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 to-black shadow-2xl">
                  <div className="absolute inset-0 rounded-full opacity-30">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full border border-gray-700"
                        style={{
                          top: `${10 + i * 5}%`,
                          left: `${10 + i * 5}%`,
                          right: `${10 + i * 5}%`,
                          bottom: `${10 + i * 5}%`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gray-200">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-800" />
                  </div>
                </div>
              </div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-48 h-48 z-10 shadow-2xl">
                <img 
                  src={imagePreview} 
                  alt="LP Cover" 
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          ) : (
            <div 
              className="relative w-48 h-48 cursor-pointer"
              onClick={handleImageClick}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 to-black shadow-2xl">
                <div className="absolute inset-0 rounded-full opacity-30">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full border border-gray-700"
                      style={{
                        top: `${10 + i * 5}%`,
                        left: `${10 + i * 5}%`,
                        right: `${10 + i * 5}%`,
                        bottom: `${10 + i * 5}%`,
                      }}
                    />
                  ))}
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gray-200">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-800" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="LP Name"
            value={lpName}
            onChange={(e) => setLpName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
          />

          <input
            type="text"
            placeholder="LP Content"
            value={lpContent}
            onChange={(e) => setLpContent(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
          />

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="LP Tag"
              value={lpTag}
              onChange={(e) => setLpTag(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
            />
            <button
              onClick={handleAddTag}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Add
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-700 text-white rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(index)}
                    className="hover:text-pink-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-pink-500 cursor-pointer"
              />
              <span className="text-white text-sm">공개</span>
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isUploadingImage}
            className={`w-full py-3 rounded-lg transition-colors font-medium ${
              isUploadingImage
                ? 'bg-gray-600 text-white cursor-not-allowed opacity-50'
                : 'bg-gray-600 hover:bg-gray-500 text-white'
            }`}
          >
            {isUploadingImage ? '이미지 업로드 중...' : 'Add LP'}
          </button>
        </div>
      </div>
    </div>
  );
};