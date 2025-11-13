// import React, { useEffect, useState } from "react";
// import { get } from "react-hook-form";
// import { getMyInfo } from "../apis/auth";
// import type { ResponseMyInfoDto } from "../types/auth";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const MyPage = () => {
//   const navigate = useNavigate();
//   const { logout } = useAuth();
//   const [data, setData] = useState<ResponseMyInfoDto>([]);

//   useEffect(() => {
//     const getData = async () => {
//       const response = await getMyInfo();
//       console.log(response);

//       setData(response);
//     };

//     getData();
//   }, []);

//   // useEffect 본문은 아래handleLogout이런거 실행하기 전에 실행되지않는다.

//   const handleLogout = async () => {
//     await logout();
//     navigate("/"); // 로그아웃 후 홈으로 보내기
//   };

//   console.log(data.data?.name);
//   return (
//     <div>
//       <h1>{data.data?.name}</h1>
//       <img src={data.data?.avatar as string} alt={"구글로고"} />
//       <h1>{data.data?.email}</h1>

//       <button
//         className="cursor-pointer bg-blue-300 rounded-sm p-5 hover:scale-90"
//         onClick={handleLogout}
//       >
//         로그아웃
//       </button>
//     </div>
//   );
// };

// export default MyPage;

import React, { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { getMyLps } from "../apis/lp";
import type { ResponseMyInfoDto } from "../types/auth";
import type { Lp } from "../types/lp";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CreateLpModal from "../components/CreateLpModal";
import EditProfileModal from "../components/EditProfileModal";

// --- 스켈레톤 카드 ---
function LpCardSkeleton() {
  return (
    <div className="rounded-xl bg-zinc-800/60 p-3 animate-pulse">
      <div className="aspect-square rounded-lg bg-zinc-700" />
      <div className="mt-3 h-4 w-3/4 rounded bg-zinc-700" />
      <div className="mt-2 h-3 w-1/2 rounded bg-zinc-700" />
    </div>
  );
}

// --- LP 카드 ---
function LpCard({ lp }: { lp: Lp }) {
  const likeCount = lp.likes?.length ?? 0; // nullish 병합(아래 설명)
  const tagText = lp.tags?.map((t) => `#${t.name}`).join(" ") || "";

  return (
    <div className="rounded-xl bg-zinc-800/60 p-3 hover:bg-zinc-800 transition">
      <div className="aspect-square overflow-hidden rounded-lg bg-zinc-900">
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="mt-3">
        <p className="text-base font-semibold text-white line-clamp-1">
          {lp.title}
        </p>
        <p className="mt-1 text-sm text-zinc-400 line-clamp-2">{lp.content}</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>❤️ {likeCount}</span>
          {tagText && <span className="truncate">{tagText}</span>}
        </div>
      </div>
    </div>
  );
}

const MyPage = () => {
  // 모달 컨트롤하는 상태
  const [open, setOpen] = useState(false);

  // 프로필 수정 모달
  const [editOpen, setEditOpen] = useState(false); // 프로필 수정 모달
  // me 상태 갱신용 헬퍼 (patch 성공 시 콜백으로 받음)
  const applyMe = (next: ResponseMyInfoDto["data"]) => {
    setMe((prev) =>
      prev
        ? { ...prev, data: next }
        : { status: true, statusCode: 200, message: "", data: next }
    );
  };

  const navigate = useNavigate();
  const { logout } = useAuth();

  // 프로필/LP 목록 상태
  const [me, setMe] = useState<ResponseMyInfoDto | null>(null);
  const [lps, setLps] = useState<Lp[] | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [loadingLps, setLoadingLps] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoadingMe(true);
        const res = await getMyInfo();
        setMe(res);
      } finally {
        setLoadingMe(false);
      }
    })();
  }, []);

  // 내lp목록 가져옥;
  useEffect(() => {
    (async () => {
      try {
        setLoadingLps(true);
        const res = await getMyLps(0, 10, "desc"); // 최신순으로 10개 조회
        setLps(res?.data?.data ?? []);
      } catch (e: any) {
        console.error("[getMyLps.error]", e.response?.status, e.response?.data);
        setLps([]);
      } finally {
        setLoadingLps(false);
      }
    })();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const name = me?.data?.name ?? "";
  const email = me?.data?.email ?? "";
  const avatar = (me?.data?.avatar as string) ?? "";
  const bio = (me?.data?.bio as string) ?? "";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 상단: 프로필 헤더 */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-10">
        <div className="flex items-center gap-6">
          {/* 아바타 (스켈레톤 포함) */}
          {loadingMe ? (
            <div className="h-28 w-28 rounded-full bg-zinc-800 animate-pulse" />
          ) : (
            <img
              src={avatar}
              alt="profile"
              className="h-28 w-28 rounded-full object-cover bg-zinc-900"
            />
          )}

          <div className="flex-1">
            {loadingMe ? (
              <>
                <div className="h-6 w-40 rounded bg-zinc-800 animate-pulse" />
                <div className="mt-2 h-4 w-64 rounded bg-zinc-800 animate-pulse" />
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold">{name}</h2>
                <p className="mt-1 text-zinc-400">{email}</p>
                <p className="mt-1 text-zinc-200">{bio}</p>
              </>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-semibold hover:bg-fuchsia-500"
          >
            로그아웃
          </button>

          {/* 🔧 설정 버튼 */}
          <button
            onClick={() => setEditOpen(true)}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
          >
            설정
          </button>
        </div>

        {/* 구분선 */}
        <div className="my-8 h-px w-full bg-zinc-800" />

        {/* 피드 영역 */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold">내 LP</h3>
            {/* 여기에 ‘+’ 버튼(모달 오픈 트리거) 이미 있다면 그대로 사용 */}
          </div>

          {/* 로딩: 스켈레톤 그리드 그리드까지 호출 잘됨*/}
          {/* {
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <LpCardSkeleton key={i} />
              ))}
            </div>
          } */}
          {loadingLps && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <LpCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* 데이터 있음 */}
          {!loadingLps && lps && lps.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {lps.map((lp) => (
                <LpCard key={lp.id} lp={lp} />
              ))}
            </div>
          )}

          {/* 데이터 없음: 빈 상태 + 비어있는 스켈레톤 격자 느낌 */}
          {!loadingLps && lps && lps.length === 0 && (
            <div className="rounded-2xl border border-dashed border-zinc-700 p-10 text-center">
              <p className="text-zinc-300">아직 생성한 LP가 없습니다.</p>
              <p className="mt-1 text-sm text-zinc-500">
                오른쪽 아래 <span className="font-semibold">‘+’</span> 버튼으로
                첫 LP를 추가해 보세요.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <LpCardSkeleton key={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* 🔹 모달 열기 버튼 (FAB) */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-fuchsia-600 text-3xl text-white shadow-lg hover:bg-fuchsia-500"
      >
        +
      </button>

      {/* 🔹 모달 컴포넌트 */}
      <CreateLpModal open={open} onClose={() => setOpen(false)} />

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        me={me?.data ?? null}
        onUpdated={applyMe}
      />
    </div>
  );
};

export default MyPage;
