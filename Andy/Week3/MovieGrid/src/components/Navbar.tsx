import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Movie App" },
  { to: "/movies/popular", label: "인기" },
  { to: "/movies/top_rated", label: "최고 평점" },
  { to: "/movies/upcoming", label: "개봉 예정" },
];

export const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-center">
      <ul className="flex space-x-4">
        {LINKS.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 font-bold"
                  : "text-white hover:text-yellow-300"
              }
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}