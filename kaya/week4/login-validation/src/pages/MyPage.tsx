import { useEffect, useState } from 'react';
import { getMyInfo } from '../apis/auth.ts';
import { type ResponseMyInfoDto } from '../type/auth.ts';
// access 토큰으로 유저 검증 페이지
const MyPage = () => {
    const [data, setData] = useState<ResponseMyInfoDto | null>(null);
    useEffect(() => {
        const getData = async () => {
            const response = await getMyInfo();
            console.log(response);

            setData(response);
        }

        getData();
    }, []);
    return <div>{data?.data.name} {data?.data.email}</div>
}

export default MyPage;