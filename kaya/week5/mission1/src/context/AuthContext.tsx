import { useState, useContext } from 'react';
import type { RequestSigninDto } from '../type/auth.ts';
import {createContext, type PropsWithChildren} from 'react';
import {useLocalStorage} from '../hooks/useLocalStorage.ts';
import {LOCAL_STORAGE_KEY} from '../constants/key.ts';
import { postSignin, postLogout } from '../apis/auth.ts';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (signInData: RequestSigninDto) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext: React.Context<AuthContextType> = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: async () => {},
    logout: async () => {},
})

export const AuthProvider = ({children}: PropsWithChildren) => {
    const {
        getItem: getAccessTokenFromStorage, 
        setItem: setAccessTokenInStorage, 
        removeItem: removeAccessTokenFromStorage
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const {
        getItem: getRefreshTokenFromStorage, 
        setItem: setRefreshTokenInStorage, 
        removeItem: removeRefreshTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    // lazy initialization으로 받음
    const [accessToken, setAccessToken] = useState<string|null>(
        getAccessTokenFromStorage(),
    );
    const [refreshToken, setRefreshToken] = useState<string|null>(
        getRefreshTokenFromStorage(),
    );

    // login 함수
    const login = async(signinData: RequestSigninDto) => {
        try {
            // 로그인 성공, 비동기
            const {data} = await postSignin(signinData);

            if (data) {
                const newAccessToken = data.accessToken;
                const newRefreshToken = data.refreshToken;

                // 로컬 스토리지에 넣기
                setAccessTokenInStorage(newAccessToken);
                setRefreshTokenInStorage(newRefreshToken);

                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);
                alert("로그인 성공");

                // 로그인 성공 시 페이지 이동
                window.location.href = "/my";
            }
        } catch(error) {
            console.error("로그인 오류", error);
            alert("로그인 실패");
        }
    }

    // logout 함수
    const logout = async() => {
        try {
            await postLogout();
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();

            setAccessToken(null);
            setRefreshToken(null);

            alert("로그아웃 성공");
        } catch(error) {
            console.error("로그아웃 오류", error);
            alert("로그아웃 실패");
        }
    }

    return (
        <AuthContext.Provider value = {{accessToken, refreshToken, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("AuthContext를 찾을 수 없습니다.");
    }

    return context;
}