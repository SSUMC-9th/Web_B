// ../context/AutoContext.tsx

import { LOCAL_STORAGE_KEY } from '../constants/key.ts';
import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
// getMyInfo와 ResponseMyInfoDto 타입을 import 합니다. (auth.ts 파일 경로를 확인하세요)
import { postSignin, postSignOut, getMyInfo } from '../apis/auth.ts'; 
import type { RequestSigninDto, ResponseMyInfoDto } from '../type/auth.ts'; 

// 1. AuthContextType 인터페이스 수정: userInfo 필드 추가
interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    userInfo: ResponseMyInfoDto | null; // ⭐ 추가된 필드: 사용자 상세 정보
    login: (signInData: RequestSigninDto) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    userInfo: null, // ⭐ 초기값 추가
    login: async () => {},
    logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
    // ... 기존 useLocalStorage 훅 정의 (생략) ...

    const { getItem: getAccessTokenFromStorage, setItem: setAccessTokenToStorage, removeItem: removeAccessTokenFromStorage } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const { getItem: getRefreshTokenFromStorage, setItem: setRefreshTokenToStorage, removeItem: removeRefreshTokenFromStorage } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken, setAccessToken] = useState<string | null>(getAccessTokenFromStorage());
    const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshTokenFromStorage());
    
    // ⭐ 2. 사용자 정보 상태 추가
    const [userInfo, setUserInfo] = useState<ResponseMyInfoDto | null>(null);

    // ⭐ 3. 앱 마운트 시 토큰이 있다면 userInfo를 한 번 로드하는 useEffect 추가 (자동 로그인 처리)
    useEffect(() => {
        const loadUserInfo = async () => {
            if (accessToken && !userInfo) {
                try {
                    const infoResponse = await getMyInfo();
                    setUserInfo(infoResponse);
                } catch (error) {
                    console.error('사용자 정보 로드 실패 (토큰 유효성 검사 필요):', error);
                    // 토큰이 유효하지 않을 경우 로그아웃 처리 등을 할 수 있습니다.
                }
            }
        };
        loadUserInfo();
    }, [accessToken]); // accessToken이 변경될 때마다 실행 (첫 로드 포함)

    const login = async (signinData: RequestSigninDto) => {
        try {
            const { data } = await postSignin(signinData);
            if (data) {
                const newAccessToken: string = data.accessToken;
                const newRefreshToken: string = data.refreshToken;

                // 토큰 저장 및 상태 업데이트
                setAccessTokenToStorage(newAccessToken);
                setRefreshTokenToStorage(newRefreshToken);
                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);
                
                // ⭐ 4. 로그인 성공 후 사용자 정보 즉시 로드 (핵심)
                try {
                    const userInfoResponse = await getMyInfo();
                    setUserInfo(userInfoResponse);
                } catch (infoError) {
                    console.error('로그인 후 사용자 정보 조회 실패', infoError);
                    setUserInfo(null); // 실패 시 초기화
                }

                alert("로그인 성공")
                window.location.href= "/";
            }
        } catch (error) {
            console.error('로그인 오류', error);
            alert("로그인 실패")
        }
    };
    
    const logout = async () => {
        try {
            await postSignOut();
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();

            setAccessToken(null);
            setRefreshToken(null);
            setUserInfo(null); // ⭐ 로그아웃 시 사용자 정보 제거
        
            alert("로그아웃 성공")
        } catch (error) {
            console.error('로그아웃 오류', error);
            alert("로그아웃 실패")
        }
    };

    // ⭐ 5. Context Provider 값에 userInfo 포함
    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, userInfo, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth= () => {
    const context : AuthContextType = useContext(AuthContext);
    if (!context) {
        throw new Error("AuthContext를 찾을 수 없습니다");
    }
    return context;
}