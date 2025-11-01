import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth.ts";
import type { ResponseMyInfoDto } from "../types/auth.ts";
import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto["data"] | null>(null);

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const response = await getMyInfo();
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchMyInfo();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-4 w-full max-w-md px-4">
        <h1 className="text-3xl font-bold text-center mb-6">마이페이지</h1>
        {data ? (
          <div className="flex flex-col gap-2">
            <img src={data?.avatar as string} alt="avatar" />
            <p><strong>이메일:</strong> {data.email}</p>
            <p><strong>이름:</strong> {data.name}</p>
          </div>
        ) : (
          <p>불러오는 중...</p>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default MyPage;