import axios, {type InternalAxiosRequestConfig} from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key.ts";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 인터셉터: 모든 요청에 accessToken을 Authorization 헤더로 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    const parsedToken = accessToken ? JSON.parse(accessToken) : null;

    // accessToken가 존재하면 Authorization 헤더에 추가
    if (parsedToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${parsedToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러 발생 시 토큰 갱신 시도
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest: CustomInternalAxiosRequestConfig = error.config;

    // 401 에러이면서, 토큰 갱신 시도가 아직 이루어지지 않은 경우
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // refresh 요청 자체가 실패한 경우 로그아웃 처리
      if (originalRequest.url?.includes("/v1/auth/refresh")) {
        localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
        localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        // refresh 요청 실행 후 Promise를 전역 변수에 할당
        refreshPromise = (async () => {
          const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
          const parsedRefreshToken = refreshToken ? JSON.parse(refreshToken) : null;

          if (!parsedRefreshToken) {
            throw new Error('No refresh token');
          }

          const { data } = await axiosInstance.post("/v1/auth/refresh", {
            refreshToken: parsedRefreshToken,
          });

          // 새 토큰 저장
          localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, JSON.stringify(data.accessToken));
          localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, JSON.stringify(data.refreshToken));

          // 새 accessToken을 반환하여 다른 요청들이 이를 사용할 수 있도록 함
          return data.accessToken;
        })()
          .catch((refreshError) => {
            // 토큰 갱신 실패 시 로그아웃 처리
            localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
            localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
            window.location.href = "/login";
            return Promise.reject(refreshError);
          })
          .finally(() => {
            // 갱신 시도가 끝나면 refreshPromise를 null로 초기화
            refreshPromise = null;
          });
      }

      return refreshPromise.then((newAccessToken) => {
        // 새로운 accessToken으로 원래 요청을 재시도
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      });
    }

    return Promise.reject(error);
  }
);