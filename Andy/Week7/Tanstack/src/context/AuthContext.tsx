import type {RequestSigninDto} from "../types/auth.ts";
import {createContext, type PropsWithChildren, useContext, useState} from "react";
import {useLocalStorage} from "../hooks/useLocalStorage.ts";
import {LOCAL_STORAGE_KEY} from "../constants/key.ts";
import {postSignin, postSignout} from "../apis/auth.ts";

interface AuthContext {
  accessToken: string | null;
  refreshToken: string | null;
  login: (signInData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContext>({
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenToStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenToStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage(),
  );

  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage(),
  );

  const login = async (signInData: RequestSigninDto) => {
    try {
      console.log("로그인 요청 데이터:", signInData);
      const response = await postSignin(signInData);
      console.log("로그인 응답:", response);

      if (response.data) {
        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        setAccessTokenToStorage(newAccessToken);
        setRefreshTokenToStorage(newRefreshToken);
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        window.location.href="/mypage";
      }
    } catch (error: any) {
      console.error("로그인 오류:", error);
      console.error("에러 응답:", error.response?.data);
      console.error("에러 상태:", error.response?.status);
      alert(`로그인에 실패했습니다: ${error.response?.data?.message || error.message}`);
    }
  };

  const logout = async () => {
    try {
      await postSignout();
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      setAccessToken(null);
      setRefreshToken(null);
      alert('로그아웃 되었습니다.');
      window.location.href = "/";
    } catch {
      console.error("로그아웃 오류:");
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth= () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용 가능합니다.");
  }

  return context;
}