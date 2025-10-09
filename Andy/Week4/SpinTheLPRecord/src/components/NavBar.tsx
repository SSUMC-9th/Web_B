import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Spin the LP Record' },
  { to: '/login', label: '로그인' },
  { to: '/signup', label: '회원가입' },
];

export const NavBar = () => {
  return (
    <nav className="bg-[#141517] border-b border-gray-800 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <NavLink
          to="/"
          className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent hover:from-pink-400 hover:to-rose-400 transition-all"
        >
          Spin the LP Record
        </NavLink>

        <ul className="flex items-center space-x-8">
          {LINKS.slice(1).map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? 'text-pink-500 font-semibold transition-colors'
                    : 'text-gray-300 hover:text-pink-400 transition-colors'
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}