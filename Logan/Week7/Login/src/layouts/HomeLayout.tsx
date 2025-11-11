// import React from "react";
// import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import { useSidebar } from "../hooks/useSidebar";
// import Sidebar from "../components/Sidebar";

// const HomeLayout = () => {
//   const { isOpen, open, close, toggle } = useSidebar();
//   return (
//     <div className="h-dvh flex flex-col">
//       <Navbar />
//       <main className="flex-1  mt-10">
//         <Outlet />
//       </main>
//       <Footer />

//       <Sidebar isOpen={isOpen} onClose={close} />
//     </div>
//   );
// };

// export default HomeLayout;
// HomeLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSidebar } from "../hooks/useSidebar";
import Sidebar from "../components/Sidebar";

const HomeLayout = () => {
  const { isOpen, toggle, close } = useSidebar(); // 훅은 레이아웃 한 군데에서만

  return (
    <div className="h-dvh flex flex-col relative">
      <Navbar onOpenSidebar={toggle} /> {/*부모에서 상태를 내려준다.} */}
      <main className="flex-1 mt-10">
        <Outlet />
      </main>
      <Footer />
      <Sidebar isOpen={isOpen} onClose={close} />
    </div>
  );
};

export default HomeLayout;
