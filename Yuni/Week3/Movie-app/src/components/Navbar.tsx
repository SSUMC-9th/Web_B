import { NavLink } from "react-router-dom";

const Links = [
    { to : '/', label: '홈'},
    { to : 'movie/popular', label: '인기 영화'},
    { to : 'movie/now_playing', label : '상영 중'},
    { to : 'movie/top_rated', label : '평점 높은'},
    { to : 'movie/upcoming', label : '개봉 예정'},
];

export default function Navbar() {
    return (
        <nav className="bg-gray-800 text-white p-4 flex gap-3">
            {Links.map(({to, label}) => (
                <NavLink 
                    key={to}
                    to={to}
                    className={({ isActive }) => {
                        return isActive ? "text-blue-500" : "text-white";
                    }}
                >
                    {label}
                </NavLink>
            ))}
        </nav>
    );
}
