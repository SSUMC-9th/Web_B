import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { patchMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";

type Props = {
  open: boolean;
  onClose: () => void;
  me: ResponseMyInfoDto["data"] | null;
  onUpdated: (next: ResponseMyInfoDto["data"]) => void;
};

export default function EditProfileModal({
  open,
  onClose,
  me,
  onUpdated,
}: Props) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");

  // 모달 열릴 때 현재값 채우기
  useEffect(() => {
    if (open && me) {
      setName(me.name ?? "");
      setBio(me.bio ?? "");
      setAvatar((me.avatar as string) ?? "");
    }
  }, [open, me]);

  const mut = useMutation({
    mutationFn: patchMyInfo,
    onSuccess: (res) => {
      onUpdated(res.data); // MyPage의 me 상태 갱신
      onClose();
    },
  });

  // 비어 있어도 저장 가능 (bio/avatar는 옵션)
  const handleSave = () => {
    mut.mutate({
      name: name, // 이름은 보통 필수지만, 수정 안 하면 그대로 보내도 OK
      bio: bio, // ""도 허용
      avatar: avatar === "" ? "" : avatar, // 빈 문자열 저장 허용. 삭제를 원하면 null 사용(백엔드 합의 시)
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-2xl bg-zinc-900 p-6 shadow-xl">
        <h3 className="text-xl font-semibold">프로필 수정</h3>

        <div className="mt-5 space-y-4">
          <label className="block">
            {/* 미리보기 */}
            <div className="mt-3 flex items-center gap-3">
              <div className="h-16 w-16 overflow-hidden rounded-full bg-zinc-800">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full" />
                )}
              </div>
              {/* 삭제 버튼(백엔드가 null 삭제를 지원하면 사용) */}
              <button
                type="button"
                onClick={() => setAvatar("")}
                className="rounded-md border border-white/10 px-3 py-1 text-sm text-zinc-300 hover:bg-white/5"
              >
                비우기
              </button>
            </div>
            <span className="mb-1 block text-sm text-zinc-300">
              아바타 URL (옵션)
            </span>
            <input
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 outline-none focus:border-fuchsia-500"
              placeholder="https://... (비워도 저장됩니다)"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-300">이름</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 outline-none focus:border-fuchsia-500"
              placeholder="이름을 입력하세요"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-zinc-300">Bio (옵션)</span>
            <input
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 outline-none focus:border-fuchsia-500"
              placeholder="한 줄 소개 (비워도 저장됩니다)"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-zinc-300 hover:bg-white/5"
            disabled={mut.isPending}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-semibold hover:bg-fuchsia-500 disabled:opacity-50"
            disabled={mut.isPending}
          >
            {mut.isPending ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
