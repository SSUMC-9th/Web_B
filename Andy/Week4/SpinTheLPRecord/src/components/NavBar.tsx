import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Spin the LP Record' },
  { to: '/login', label: '로그인' },
  { to: '/signup', label: '회원가입' },
];

export const NavBar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-center">
      <ul className="flex space-x-4">
        {LINKS.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? 'text-yellow-300 font-bold'
                  : 'text-white hover:text-yellow-200'
              }
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}