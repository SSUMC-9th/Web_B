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
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  if (typeof document === "undefined") return null; // SSR 안전

  return createPortal(
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-[1000]
        ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        // 오타 수정: shaodw-2xl -> shadow-2xl
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl
          transform transition-transform duration-300 ease-in-out z-[1001]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        // 내부 클릭 시 닫힘 방지
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
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                >
                  마이페이지
                </Link>

                {/* <button className="w-full text-left px-2 py-2 rounded hover:bg-gray-100">
                  마이페이지
                </button> */}
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>,
    document.body
  );
}
