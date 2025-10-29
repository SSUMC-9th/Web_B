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

  const handleLogout = async () => {
    await logout();
    navigate("/");
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
