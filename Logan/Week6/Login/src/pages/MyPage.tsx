import React, { useEffect, useState } from "react";
import { get } from "react-hook-form";
import { getMyinfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../tpyes/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto>([]);

  useEffect(() => {
    const getData = async () => {
      const response = await getMyinfo();
      console.log(response);

      setData(response);
    };

    getData();
  }, []);

  // useEffect 본문은 아래handleLogout이런거 실행하기 전에 실행되지않는다.

  const handleLogout = async () => {
    await logout();
    navigate("/"); // 로그아웃 후 홈으로 보내기
  };

  console.log(data.data?.name);
  return (
    <div>
      <h1>{data.data?.name}</h1>
      <img src={data.data?.avatar as string} alt={"구글로고"} />
      <h1>{data.data?.email}</h1>

      <button
        className="cursor-pointer bg-blue-300 rounded-sm p-5 hover:scale-90"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;
