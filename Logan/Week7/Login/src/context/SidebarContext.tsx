// import {
//   createContext,
//   useContext,
//   useState,
//   type ReactNode,
//   useEffect,
// } from "react";
// import Sidebar from "../components/Sidebar";

// type SidebarCtx = {
//   isOpen: boolean;
//   open: () => void;
//   close: () => void;
//   toggle: () => void;
// };

// const Ctx = createContext<SidebarCtx | null>(null);

// export function SidebarProvider({ children }: { children: ReactNode }) {
//   const [isOpen, setIsOpen] = useState(false);

//   const open = () => setIsOpen(true);
//   const close = () => setIsOpen(false);
//   const toggle = () => setIsOpen((v) => !v);

//   // 선택: 열렸을 때 바디 스크롤 잠금
//   useEffect(() => {
//     document.body.style.overflow = isOpen ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [isOpen]);

//   return (
//     <Ctx.Provider value={{ isOpen, open, close, toggle }}>
//       {children}
//       {/* 전역 사이드바는 여기서 한 번만 렌더 */}
//       <Sidebar isOpen={isOpen} onClose={close} />
//     </Ctx.Provider>
//   );
// }

// export function useSidebar() {
//   const ctx = useContext(Ctx);
//   if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
//   return ctx;
// }
