import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center p-4 bg-gray-900">
      <h1 className="text-2xl font-bold text-pink-500">돌려돌려 LP판</h1>
      <div className="flex gap-3">
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition"
        >
          로그인
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="px-4 py-2 bg-pink-500 rounded hover:bg-pink-600 transition"
        >
          회원가입
        </button>
      </div>
    </header>
  );
};