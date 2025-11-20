// src/components/CreateLpModal.tsx
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadImage } from "../apis/upload";
import { createLp } from "../apis/lp";
import { QUERY_KEY } from "../constants/key";

// 모달껏다켰다
type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateLpModal({ open, onClose }: Props) {
  const qc = useQueryClient();

  // 폼 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  // 파일 미리보기
  const previewUrl = useMemo<string | null>(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  // 미리보기 URL 정리
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // 태그 추가/삭제
  const addTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    if (!tags.includes(v)) setTags((prev) => [...prev, v]);
    setTagInput("");
  };

  const removeTag = (name: string) => {
    setTags((prev) => prev.filter((t) => t !== name));
  };

  // 저장
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      // 1) 파일 있으면 업로드 → URL 받기
      let thumbnail = "";
      if (file) {
        // 인증 필요 없게 public 사용 (백엔드 요구에 맞춰 true/false 바꾸면 됨)
        thumbnail = await uploadImage(file, true);
      }

      // 2) LP 생성 (스웨거 기준: JSON 본문)
      return createLp({
        title: title.trim(),
        content: content.trim(),
        thumbnail, // 업로드 URL (없으면 빈 문자열)
        tags, // 문자열 배열
        published: true, // 기본 공개
      });
    },
    onSuccess: () => {
      // 목록 갱신
      qc.invalidateQueries({ queryKey: [QUERY_KEY.lps] });

      // 폼 초기화 + 닫기
      setTitle("");
      setContent("");
      setTagInput("");
      setTags([]);
      setFile(null);
      onClose();
    },
  });

  // 모달 열려있지 않으면 렌더 안함
  if (!open) return null;

  // 바깥 클릭 닫기
  const handleBackdropClick = () => onClose();
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  // Enter로 태그 추가
  const onTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60"
      onClick={handleBackdropClick}
    >
      <div
        onClick={stop}
        className="w-[90%] max-w-lg rounded-2xl bg-zinc-800 p-6 shadow-xl"
      >
        {/* 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Add LP</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            aria-label="close"
          >
            ✕
          </button>
        </div>

        {/* 이미지 미리보기 + 파일 선택 */}
        <div className="mb-5 flex flex-col items-center gap-3">
          <div className="h-36 w-36 overflow-hidden rounded-xl bg-zinc-900">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-500">
                LP 이미지
              </div>
            )}
          </div>

          <label className="inline-block cursor-pointer rounded-lg bg-zinc-700 px-3 py-2 text-sm text-white hover:bg-zinc-600">
            이미지 선택
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        {/* 입력 폼 */}
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="LP Name"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-500 focus:border-fuchsia-500 focus:outline-none"
          />
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="LP Content"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-500 focus:border-fuchsia-500 focus:outline-none"
          />

          {/* 태그 입력 + 추가 버튼 */}
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={onTagKeyDown}
              placeholder="LP Tag"
              className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-500 focus:border-fuchsia-500 focus:outline-none"
            />
            <button
              onClick={addTag}
              className="rounded-md bg-zinc-600 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-500"
            >
              Add
            </button>
          </div>

          {/* 태그 칩 */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-700 px-3 py-1 text-sm text-white"
                >
                  {t}
                  <button
                    onClick={() => removeTag(t)}
                    className="rounded-full px-1 text-zinc-300 hover:bg-zinc-600 hover:text-white"
                    aria-label={`remove-${t}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 제출 */}
        <button
          onClick={() => mutateAsync()}
          disabled={isPending || !title.trim()}
          className="mt-6 w-full rounded-lg bg-fuchsia-600 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 hover:bg-fuchsia-500"
        >
          {isPending ? "Saving..." : "Add LP"}
        </button>
      </div>
    </div>
  );
}
