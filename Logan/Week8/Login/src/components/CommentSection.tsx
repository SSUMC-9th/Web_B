import { useMemo, useState } from "react";
import { MoreVertical, Pencil, Send, Trash2 } from "lucide-react";
import useGetLpComments from "../hooks/queries/useGetLpComments";

import useUpdateComment from "../hooks/mutations/useUpdateComment";
import useDeleteComment from "../hooks/mutations/useDeleteComment";
import CommentSkeleton from "./CommentSkeleton";
import type { Comment } from "../types/comment";
import type { PAGINATION_ORDER } from "../enums/common";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import useCreateComment from "../hooks/mutations/useCreateComments";

type OrderType = PAGINATION_ORDER; // enum 그대로 사용(asc/desc 혹은 ASC/DESC)

export default function CommentSection({ lpId }: { lpId: number }) {
  // ✅ enum 값만 여러분 프로젝트에 맞게 초기값 지정
  const [order, setOrder] = useState<OrderType>("desc" as OrderType);
  const [content, setContent] = useState("");

  const { accessToken } = useAuth();
  const { data: me } = useGetMyInfo(accessToken);
  const myId = me?.data?.id;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useGetLpComments(lpId, order);

  const createMut = useCreateComment(lpId, order);
  const updateMut = useUpdateComment(lpId, order);
  const deleteMut = useDeleteComment(lpId, order);

  const items: Comment[] = useMemo(() => {
    const pages = data?.pages ?? [];
    // CursorBasedResponse<Comment[]> → p.data.data
    return pages.flatMap((p) => p.data.data);
  }, [data]);

  const onSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    createMut.mutate({ content: trimmed }, { onSuccess: () => setContent("") });
  };

  const onChangeOrder = (o: OrderType) => {
    if (o === order) return;
    setOrder(o); // queryKey 변경 → 첫 페이지부터 자동 재요청
    refetch();
  };

  return (
    <section className="mt-10">
      {/* 상단 툴바 */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-white/90 font-semibold">댓글</h2>
        <div className="flex gap-2">
          <button
            onClick={() => onChangeOrder("asc" as OrderType)}
            className={`rounded-lg px-3 py-1.5 text-sm border ${
              order === ("asc" as OrderType)
                ? "border-white/30 bg-white/10"
                : "border-white/10 hover:bg-white/5"
            }`}
          >
            오래된순
          </button>
          <button
            onClick={() => onChangeOrder("desc" as OrderType)}
            className={`rounded-lg px-3 py-1.5 text-sm border ${
              order === ("desc" as OrderType)
                ? "border-white/30 bg-white/10"
                : "border-white/10 hover:bg-white/5"
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      {/* 입력창 */}
      <div className="rounded-xl bg-[#2a2d31] border border-white/10 p-3 mb-4">
        <div className="flex gap-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 입력해주세요"
            className="flex-1 rounded-lg bg-transparent outline-none text-white placeholder:text-white/40"
          />
          <button
            onClick={onSubmit}
            disabled={createMut.isPending || !content.trim()}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm border border-white/10 hover:bg-white/5 disabled:opacity-50"
          >
            <Send size={14} />
            작성
          </button>
        </div>
        {!content.trim() && (
          <p className="mt-2 text-xs text-white/40">
            한 글자 이상 입력해주세요.
          </p>
        )}
      </div>

      {/* 목록 */}
      <div className="space-y-3">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => <CommentSkeleton key={i} />)}

        {!isLoading &&
          items.map((c) => (
            <CommentRow
              key={c.id}
              c={c}
              canEdit={myId === c.author.id}
              onUpdate={(v) =>
                updateMut.mutate({ commentId: c.id, content: v })
              }
              onDelete={() => deleteMut.mutate({ commentId: c.id })}
            />
          ))}

        {isFetchingNextPage && <CommentSkeleton />}

        {hasNextPage && !isFetchingNextPage && (
          <button
            onClick={() => fetchNextPage()}
            className="w-full mt-2 rounded-lg border border-white/10 py-2 text-sm text-white/80 hover:bg-white/5"
          >
            더 보기
          </button>
        )}
      </div>
    </section>
  );
}

function CommentRow({
  c,
  canEdit,
  onUpdate,
  onDelete,
}: {
  c: Comment;
  canEdit: boolean;
  onUpdate: (v: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(c.content);

  const save = () => {
    const t = text.trim();
    if (!t || t === c.content) {
      setEditing(false);
      setText(c.content);
      return;
    }
    onUpdate(t);
    setEditing(false);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#202225] p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs">
            {c.author.name?.[0] ?? "유"}
          </div>
          <div className="leading-tight">
            <p className="text-sm text-white/90">
              {c.author.name ?? `user#${c.author.id}`}
            </p>
            <p className="text-xs text-white/40">
              {new Date(c.createdAt).toLocaleString("ko-KR")}
            </p>
          </div>
        </div>

        {canEdit && (
          <div className="flex gap-1">
            {!editing ? (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="rounded-lg border border-white/10 px-2 py-1 text-xs hover:bg-white/5"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={onDelete}
                  className="rounded-lg border border-white/10 px-2 py-1 text-xs text-red-300 hover:bg-red-400/10"
                >
                  <Trash2 size={12} />
                </button>
              </>
            ) : (
              <button
                onClick={save}
                className="rounded-lg border border-white/10 px-2 py-1 text-xs hover:bg-white/5"
              >
                저장
              </button>
            )}
            <button className="rounded-lg border border-white/10 px-2 py-1 text-xs hover:bg-white/5">
              <MoreVertical size={12} />
            </button>
          </div>
        )}
      </div>

      {!editing ? (
        <p className="mt-3 text-white/90">{c.content}</p>
      ) : (
        <div className="mt-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-lg bg-black/20 border border-white/10 px-2 py-1 outline-none"
          />
        </div>
      )}
    </div>
  );
}
