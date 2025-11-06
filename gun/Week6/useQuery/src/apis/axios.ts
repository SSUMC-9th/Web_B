import axios, { type InternalAxiosRequestConfig } from 'axios';
import { LOCAL_STORAGE_KEY } from '../constants/key';

// useLocalStorage 훅 대신 직접 localStorage API를 사용하는 유틸리티 함수입니다.
const storageGetItem = (key: string): string | null => {
    // localStorage에서 값을 가져와서 따옴표를 제거합니다.
    const item = localStorage.getItem(key);
    if (item && item.startsWith('"') && item.endsWith('"')) {
        return item.slice(1, -1); // 따옴표 제거
    }
    return item;
};

const storageSetItem = (key: string, value: string): void => {
    localStorage.setItem(key, value);
};

const storageRemoveItem = (key: string): void => {
    localStorage.removeItem(key);
};


interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean; // 요청 재시도 여부를 나타내는 플래그
}

let refreshPromise:Promise<string | void> | null = null; // Promise<string | void>로 수정

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL, 
});

// ⭐ 요청 인터셉터: Access Token을 헤더에 첨부
axiosInstance.interceptors.request.use((config) => {
    // 🛑 useLocalStorage 훅 대신 storageGetItem 사용
    const accesstoken = storageGetItem(LOCAL_STORAGE_KEY.accessToken); 

    if (accesstoken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accesstoken}`;
    }
    return config;
}, 
    (error) => Promise.reject(error)
);

// ⭐ 응답 인터셉터: 401 에러 발생 시 토큰 갱신 로직
axiosInstance.interceptors.response.use(
    (response) => response,
    async(error) => {
        const originalRequest: CustomInternalAxiosRequestConfig = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ){
            if (originalRequest.url === '/v1/auth/refresh') {
                storageRemoveItem(LOCAL_STORAGE_KEY.accessToken);
                storageRemoveItem(LOCAL_STORAGE_KEY.refreshToken);
                window.location.href='/login';
                return Promise.reject(error);
            }
        
            originalRequest._retry = true;

            if (!refreshPromise) {
                refreshPromise = (async () => {
                    const refreshToken = storageGetItem(LOCAL_STORAGE_KEY.refreshToken); 

                    if (!refreshToken) {
                        // Refresh Token이 없으면 강제 로그아웃
                        storageRemoveItem(LOCAL_STORAGE_KEY.accessToken);
                        storageRemoveItem(LOCAL_STORAGE_KEY.refreshToken);
                        window.location.href='/login';
                        return Promise.reject(new Error("Refresh token missing"));
                    }

                    const { data } = await axiosInstance.post("/v1/auth/refresh", {
                        refresh: refreshToken,
                    });

                    storageSetItem(LOCAL_STORAGE_KEY.accessToken, data.data.accessToken);
                    storageSetItem(LOCAL_STORAGE_KEY.refreshToken, data.data.refreshToken);

                    return data.data.accessToken;
                })().catch((error) => {
                    // refresh 실패 시 강제 로그아웃
                    storageRemoveItem(LOCAL_STORAGE_KEY.accessToken);
                    storageRemoveItem(LOCAL_STORAGE_KEY.refreshToken);
                    window.location.href='/login';
                    return Promise.reject(error);
                })
                .finally( () => {
                    refreshPromise = null;
                }) as Promise<string>; 
            }

            // 진행중인 refreshPromise가 해결될 떄까지 기다림
            return refreshPromise!.then((newAccessToken) => {
                // 원본 요청의 Authorization 헤더를 갱신된 토큰으로 업데이트
                if (newAccessToken) { // newAccessToken이 유효할 때만 헤더 업데이트
                     originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                }
                // 업데이트 된 원본 요청을 재시도합니다.
                return axiosInstance.request(originalRequest);
            })
        }
        return Promise.reject(error);
    }
)