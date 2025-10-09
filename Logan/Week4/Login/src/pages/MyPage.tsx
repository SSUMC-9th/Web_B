import React, { useEffect, useState } from "react";
import { get } from "react-hook-form";
import { getMyinfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../tpyes/auth";

const MyPage = () => {
  const [data, setData] = useState<ResponseMyInfoDto>();

  useEffect(() => {
    const getData = async () => {
      const response = await getMyinfo();
      console.log(response);

      setData(response);
    };

    getData();
  }, []);
  return (
    <div className="font-black">
      진짜안뜨냐
      {data.data.name}, {data.data.email}
    </div>
  );
};

export default MyPage;
