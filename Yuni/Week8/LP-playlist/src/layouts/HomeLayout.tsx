import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useSidebar } from "../hooks/useSidebar";

export default function HomeLayout() {
    const { isOpen, toggle, close } = useSidebar();

    return (
         <div className="flex flex-col min-h-screen bg-black text-white">
            <Navbar onToggleSidebar={toggle} />
            <Sidebar isOpen={isOpen} onClose={close} />
            <main className="flex-1 mt-10">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}