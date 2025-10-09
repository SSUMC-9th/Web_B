import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/login", label: "로그인" },
  { to: "/signup", label: "회원가입" },
  { to: "/user", label: "마이페이지" },
];

const NavBar = () => {
  return (
    <nav className="flex gap-3 p-4">
      {LINKS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }: { isActive: boolean }): string =>
            isActive ? "text-[#b2dab1] font-bold" : "text-gray-500 hover:text-gray-700"
          }
          // /login 같은 단일 경로에서 하위 경로를 활성으로 취급하지 않으려면 end 사용(선택)
          end
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
};

export default NavBar;
