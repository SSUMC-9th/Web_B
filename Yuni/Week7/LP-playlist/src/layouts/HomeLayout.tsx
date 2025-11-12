import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function HomeLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
         <div className="flex flex-col min-h-screen bg-black text-white">
            <Navbar onToggleSidebar={handleToggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
            <main className="flex-1 mt-10">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}