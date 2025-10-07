// src/components/navbar.tsx
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <Link to="/" className='m-4 bg-purple-500 text-white p-4 font-bold text-center' >홈 페이지로 이동</Link>
      <Link to="/movies" className='m-4 bg-purple-400 text-white p-4 font-bold text-center'>영화 목록 페이지로 이동</Link>
    </nav>
  );
};

export default Navbar;