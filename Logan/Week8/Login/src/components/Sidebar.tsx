// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
//   return (
//     <div
//       className={`fixed inset-0 bg-black/50 backdrop-blur-sm
//      transition-opacity duration-300 z-40
//      ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
//       onClick={onClose}
//     >
//       사이드바입니다.
//       <aside
//         className={`fixed top-0 left-0 h-full w-80 bg-white shaodw-2xl
//         transform transition-transform duration-300 ease-in-out z-50 ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//         role="dialog"
//       >
//         <div className="flex flex-col h-full">
//           <div className="p-6 border-b border-gray-200">
//             <h2 className="text-2xl font-bold text-gray-900">돌려돌려 LP판</h2>
//           </div>
//         </div>

//         <nav className="flex-1 overflow-y-auto p-4">
//           <ul className="space-y-2">
//             <li>
//               <a>찾기</a>
//             </li>

//             <li>
//               <a>마이페이지</a>
//             </li>
//           </ul>
//         </nav>
//       </aside>
//     </div>
//   );
// };

// export default Sidebar;

// Sidebar.tsx
// import { createPortal } from "react-dom";
// import { Link } from "react-router-dom";

// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default function Sidebar({ isOpen, onClose }: SidebarProps) {
//   if (typeof document === "undefined") return null; // SSR 안전

//   return createPortal(
//     <div
//       aria-hidden={!isOpen}
//       className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-[1000]
//         ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
//       onClick={onClose}
//     >
//       <aside
//         role="dialog"
//         aria-modal="true"
//         // 오타 수정: shaodw-2xl -> shadow-2xl
//         className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl
//           transform transition-transform duration-300 ease-in-out z-[1001]
//           ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
//         // 내부 클릭 시 닫힘 방지
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex flex-col h-full">
//           <div className="p-6 border-b border-gray-200">
//             <h2 className="text-2xl font-bold text-gray-900">돌려돌려 LP판</h2>
//           </div>

//           <nav className="flex-1 overflow-y-auto p-4">
//             <ul className="space-y-2">
//               <li>
//                 <button className="w-full text-left px-2 py-2 rounded hover:bg-gray-100">
//                   찾기
//                 </button>
//               </li>
//               <li>
//                 <Link
//                   to="/my"
//                   className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
//                 >
//                   마이페이지
//                 </Link>

//                 {/* <button className="w-full text-left px-2 py-2 rounded hover:bg-gray-100">
//                   마이페이지
//                 </button> */}
//               </li>
//               <li>
//                 <button className="w-full text-left px-2 py-2 rounded hover:bg-gray-100">
//                   탈퇴하기
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </aside>
//     </div>,
//     document.body
//   );
// }

// Sidebar.tsx
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { deleteMe } from "../apis/auth";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// 🔹 탈퇴 확인 모달 컴포넌트
function DeleteConfirmModal({
  onCancel,
  onConfirm,
  isLoading,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[1100] flex items-center justify-center">
      {/* 뒤 배경 어둡게 */}
      <div
        className="fixed inset-0 bg-black/60"
        onClick={onCancel}
        aria-hidden
      />
      {/* 가운데 카드 */}
      <div className="relative z-[1101] w-full max-w-lg rounded-2xl bg-zinc-900 px-10 py-8 text-center text-white">
        <p className="mb-8 text-lg font-semibold">정말 탈퇴하시겠습니까?</p>

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="min-w-[120px] rounded-full bg-zinc-600 px-6 py-2 text-sm font-medium hover:bg-zinc-500 disabled:opacity-50"
            disabled={isLoading}
          >
            아니오
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-w-[120px] rounded-full bg-pink-500 px-6 py-2 text-sm font-medium hover:bg-pink-400 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "처리 중..." : "예"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const navigate = useNavigate();
  const { logout } = useAuth();

  // 🔹 회원 탈퇴 mutation
  const deleteMut = useMutation({
    mutationFn: deleteMe,
    onSuccess: async () => {
      // 1) 토큰/내 정보 정리 (기존 logout 로직 재사용)
      try {
        await logout();
      } catch (e) {
        console.error(e);
      }

      // 2) 모달 & 사이드바 닫기
      setShowDeleteModal(false);
      onClose();

      // 3) 로그인 페이지로 이동
      navigate("/login");
    },
    onError: (err) => {
      console.error(err);
      alert("탈퇴 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    },
  });

  if (typeof document === "undefined") return null; // SSR 안전

  const sidebarPortal = createPortal(
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-[1000]
        ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl
          transform transition-transform duration-300 ease-in-out z-[1001]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">돌려돌려 LP판</h2>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              <li>
                <button className="w-full text-left px-2 py-2 rounded hover:bg-gray-100">
                  찾기
                </button>
              </li>
              <li>
                <Link
                  to="/my"
                  className="block w-full px-2 py-2 rounded text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100"
                >
                  마이페이지
                </Link>
              </li>
              <li>
                {/* 🔹 탈퇴하기 버튼: 모달만 띄우고, 실제 API 호출은 모달에서 "예" 눌렀을 때 */}
                <button
                  className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 text-red-500"
                  onClick={() => setShowDeleteModal(true)}
                >
                  탈퇴하기
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>,
    document.body
  );

  return (
    <>
      {sidebarPortal}

      {/* 🔹 확인 모달은 isOpen과 별개로 관리 */}
      {showDeleteModal && (
        <DeleteConfirmModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => deleteMut.mutate()}
          isLoading={deleteMut.isPending}
        />
      )}
    </>
  );
}
