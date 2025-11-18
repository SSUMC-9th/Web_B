
import { useAuth } from '../context/AutoContext.tsx';
import { useNavigate } from 'react-router-dom';

// access 토큰으로 유저 검증 페이지
const MyPage = () => {
    const{logout, userInfo} = useAuth();
    const navigate = useNavigate();


const handleLogout = async () => {
    await logout();
    navigate("/login");
}

    return ( 
            <div className='font-bold text-3xl'>
                <div>닉네임: {userInfo?.data.name}</div>
                <div> 이메일: {userInfo?.data.email}</div>

            <button className = "cursor-pointer bg-blue-300 rounded-sm p-5 mt-6" onClick = {handleLogout}>로그아웃</button>
            </div>
            )
}
// ? optional이 있는 이유 : useEffect는 return문이 실행 먼저 되고 다음에 렌더링 됨 <=> 해결하기 위해 생김

export default MyPage;