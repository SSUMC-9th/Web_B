// import {
//   createContext,
//   useContext,
//   useState,
//   type PropsWithChildren,
// } from "react";
// import type { RequestSigninDto, ResponseMyInfoDto } from "../types/auth";
// import { useLocalStorage } from "../hooks/useLocalStorage";
// import { LOCAL_STORAGE_KEY } from "../constants/key";
// import { postLogout, postSignin } from "../apis/auth";
// import { useNavigate } from "react-router-dom";

// interface AuthContextType {
//   accessToken: string | null;
//   refreshToken: string | null;
//   me: ResponseMyInfoDto | null;
//   setMe: React.Dispatch<React.SetStateAction<ResponseMyInfoDto | null>>;
//   login: (signinData: RequestSigninDto) => Promise<void>;
//   logout: () => Promise<void>;
// }

// // 1. context 생성
// export const AuthContext = createContext<AuthContextType>({
//   accessToken: null,
//   refreshToken: null,

//   me: null,
//   setMe: () => {},

//   login: async () => {},
//   logout: async () => {},
// });

// // 2. 공급자Provider
// // App.tsx에 씌워주기
// export const AuthProvider = ({ children }: PropsWithChildren) => {
//   const {
//     getItem: getAccessTokenFormStorage, // : 으로 이름 바꿔줄 수 잇음
//     setItem: setAccessTokenInStorage,
//     removeItem: removeAccessTokenFromStorage,
//   } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

//   const {
//     getItem: getRefreshTokenFromStorage,
//     setItem: setRefreshTokenInStorage,
//     removeItem: removeRefreshTokenFromStorage,
//   } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

//   // 로그인 상태와 함수들 정의
//   const [accessToken, setAccessToken] = useState<string | null>(
//     getAccessTokenFormStorage() // 지연초기화 방식을 했다는데???? 이게뭐임
//   );
//   const [refreshToken, setRefreshToken] = useState<string | null>(
//     getRefreshTokenFromStorage()
//   );
//   const [me, setMe]=useState<ResponseMyInfoDto|null>(null);

//   // 원래 result.data가 기본형태냐? result우리가 정의한거아님?
//   const login = async (signinData: RequestSigninDto) => {
//     try {
//       // gpt는 이렇게 고치라는데
//       // const data  = await postSignin(signinData);
//       const { data } = await postSignin(signinData);

//       if (data) {
//         const newAccessToken = data.accessToken;
//         const newRefreshToken = data.refreshToken;

//         setAccessTokenInStorage(newAccessToken);
//         setRefreshTokenInStorage(newRefreshToken);

//         setAccessToken(newAccessToken);
//         setRefreshToken(newRefreshToken);
//         alert("로그인성공");
//         window.location.href = "/my";
//       }
//     } catch (error) {
//       console.error("로그인 오류", error);
//       alert("로그인실패");
//     }
//   };

//   const logout = async () => {
//     try {
//       await postLogout();

//       removeAccessTokenFromStorage();
//       removeRefreshTokenFromStorage();
//       // localStorage.clear()로 로컬스토리지 다 비워주기엔 위험함( 다른사이트는 다른정보도 로컬스토리지에 저장해놓기도함)

//       setAccessToken(null);
//       setRefreshToken(null);

//       alert("로그아웃성공");
//       //   localStorage.clear();
//     } catch (error) {
//       console.error("로그아웃 오류", error);
//       alert("로그아웃 실패");
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{ accessToken, refreshToken, login, logout, me, setMe }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // const context= useContext(AuthContext) 이런형태를 많이 쓰니까 차라리 훅으로 만들자
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("AuthContext를 찾을 수 없습니다.");
//   }

//   return context;
// };

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import type { RequestSigninDto, ResponseMyInfoDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin, getMyInfo } from "../apis/auth";

// 1️⃣ Context 타입 정의
interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (signinData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;

  // ✅ 내 정보 상태 (ResponseMyInfoDto를 그대로 사용)
  me: ResponseMyInfoDto["data"] | null;
  setMe: React.Dispatch<React.SetStateAction<ResponseMyInfoDto["data"] | null>>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  logout: async () => {},
  me: null,
  setMe: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage()
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage()
  );

  // 내 정보 상태
  const [me, setMe] = useState<ResponseMyInfoDto["data"] | null>(null);

  // accessToken이 생기면 내 정보 자동으로 불러오기
  useEffect(() => {
    const fetchMyInfo = async () => {
      if (!accessToken) {
        setMe(null);
        return;
      }
      try {
        const res = await getMyInfo(); // 서버에서 내 정보 가져오기
        setMe(res.data); // ResponseMyInfoDto의 data만 저장
      } catch (err) {
        console.error("내 정보 불러오기 실패:", err);
        setMe(null);
      }
    };
    fetchMyInfo();
  }, [accessToken]);

  //
  const login = async (signinData: RequestSigninDto) => {
    try {
      const { data } = await postSignin(signinData);
      if (data) {
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        // localStorage & state에 토큰 저장
        setAccessTokenInStorage(newAccessToken);
        setRefreshTokenInStorage(newRefreshToken);
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        alert("로그인 성공!");

        //
        try {
          const meRes = await getMyInfo();
          setMe(meRes.data);
        } catch (err) {
          console.error("로그인 직후 내 정보 불러오기 실패:", err);
        }

        window.location.href = "/my";
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인 실패");
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await postLogout();

      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();

      setAccessToken(null);
      setRefreshToken(null);
      setMe(null); // 프로필도 비우기

      alert("로그아웃 성공");
    } catch (error) {
      console.error("로그아웃 오류:", error);
      alert("로그아웃 실패");
    }
  };

  // ----------------------------------------------------------
  // 4️⃣ Provider로 전역 공급

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        login,
        logout,
        me,
        setMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ----------------------------------------------------------
// 5️⃣ useAuth 훅 (편하게 꺼내 쓰기용)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext를 찾을 수 없습니다.");
  }
  return context;
};
