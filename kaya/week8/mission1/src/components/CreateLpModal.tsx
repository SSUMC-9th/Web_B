import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import useCreateLp from '../hooks/mutations/useCreateLp';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invalidateKey: readonly unknown[]; // 예: ['lpList', search]
}

export default function CreateLpModal({ isOpen, onClose, invalidateKey }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  // 이미지 미리보기
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);

  // LP 생성 Mutation
  const { mutate: createLp, isPending } = useCreateLp(invalidateKey);

  // Escape 누르면 닫힘
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // 모달이 닫히면 input 초기화
  useEffect(() => {
    if (!isOpen) { setTitle(''); setContent(''); setTagInput(''); setTags([]); setFile(null); }
  }, [isOpen]);

  // 모달이 닫혀있으면 렌더링x
  if (!isOpen) return null;

  // 태그 추가
  const addTag = () => {
    const v = tagInput.trim();
    if (!v || tags.includes(v)) return;
    setTags((t) => [...t, v]); setTagInput('');
  };
  // 태그 삭제
  const removeTag = (t: string) => setTags((arr) => arr.filter((x) => x !== t));

  // 제출
  const onSubmit = () => {
    if (!title.trim()) return alert('LP Name을 입력하세요.');
    if (!content.trim()) return alert('LP Content를 입력하세요.');

    const body = {
      title, 
      content,
      thumbnail: "",
      tags,
      published: true,
    };

    createLp(body, {onSuccess: onClose});
  };

  // Portal을 사용해서 모달을 body 외부로 렌더링?
  const modalRoot = document.getElementById('modal-root') || document.body;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-[95%] max-w-md rounded-2xl bg-neutral-800 p-6 text-neutral-100" onClick={(e) => e.stopPropagation()}>
        <button className="absolute right-3 top-3 px-2 py-1 text-neutral-300 hover:bg-neutral-700 rounded" onClick={onClose}>×</button>

        <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-neutral-700">
          {preview ? <img src={preview} alt="preview" className="h-full w-full object-cover" /> : <span className="text-xs text-neutral-400">No Image</span>}
        </div>

        <input type="file" accept="image/*" className="mb-4 w-full rounded bg-neutral-700 p-2 text-sm"
               onChange={(e) => setFile(e.target.files?.[0] ?? null)} />

        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="LP Name"
               className="mb-3 w-full rounded bg-neutral-700 px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500" />
        <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="LP Content"
               className="mb-3 w-full rounded bg-neutral-700 px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500" />

        <div className="mb-2 flex gap-2">
          <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                 placeholder="LP Tag"
                 className="flex-1 rounded bg-neutral-700 px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500" />
          <button onClick={addTag} className="rounded bg-neutral-600 px-3 text-sm hover:bg-neutral-500">Add</button>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 rounded-full bg-neutral-700 px-2 py-1 text-xs">
              #{t}
              <button className="ml-1 rounded bg-neutral-600 px-1 text-[10px] hover:bg-neutral-500" onClick={() => removeTag(t)}>x</button>
            </span>
          ))}
        </div>

        <button disabled={isPending} onClick={onSubmit}
                className="w-full rounded-xl bg-pink-600 py-2 font-medium hover:bg-pink-500 disabled:opacity-60">
          {isPending ? 'Saving…' : 'Add LP'}
        </button>
      </div>
    </div>,
    modalRoot
  );
}
