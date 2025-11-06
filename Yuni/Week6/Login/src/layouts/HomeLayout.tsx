import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HomePage() {
    return (
         <div className="min-h-screen bg-black text-white">
            <Navbar />
            <main className="flex-1 mt-10">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}