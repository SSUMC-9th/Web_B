import { useEffect, useState } from 'react';
import { getMyInfo } from '../apis/auth.ts';
import type { ResponseMyInfoDto } from '../type/auth.ts';

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
    return ( <div className='font-bold text-3xl'>
            <div>닉네임: {data?.data.name}</div>
            <div> 이메일: {data?.data.email}</div>
            </div>)
}

export default MyPage;