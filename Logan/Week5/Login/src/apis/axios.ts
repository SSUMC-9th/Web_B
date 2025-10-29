import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { config } from "zod";
import { extend } from "zod/v4-mini";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean; // 요청 재시도 여부를 나타내는 플래그
}

// 전역변수로 refresh 요청의 Promise를 저장해서 중복요청을 방지한다.
let refreshPromise: Promise<string> | null = null;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,

  // headers: {
  //   Authorization: `Bearer ${localStorage.getItem(
  //     LOCAL_STORAGE_KEY.accessToken)}`,
  // },
});

// 요청 인터셉터: 모든 요청전에 accssToken을 Authorizaition에 추가한다.
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const accessToken = getItem(); // loaclStorage에서 accessToken을 가져온다.

    // accessToken이  존재하면 Authorizaition헤더에 Bearer토큰형식으로 추가함
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer${accessToken}`;
    }

    // 수정된 요청 설정을 반환한다.
    return config;
  },

  // 요청인터셉터가 실패하면, 에러뿜음
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 에러 발생-> refresh 토큰을 통한 토큰 갱신을 처리한다.
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: CustomInternalAxiosRequestConfig = error.config;

    //401 에러면서, 아직 재시도하지 않은 요청의 경우 처리
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      //refresh 앤드포인트 401 에러가 발생한 경우(Unauthorized), 중복 재시도 방지를 위해 로그아웃처리
      if (originalRequest.url === "/v1/auth/refresh") {
        const { removeItem: removeAccessToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.accessToken
        );
        const { removeItem: removeRfreshToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.refreshToken
        );
        removeAccessToken();
        removeRfreshToken();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // 재시도 플래그 설정
      originalRequest._retry = true;

      // 이미 리프레쉬 요청이 진행중이면, 그 Promise를 재사용한다.
      if (!refreshPromise) {
        // refresh 요청 실행 후, 프로미스를 전역변수에 할당
        refreshPromise = (async () => {
          const { getItem: getRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken
          );
          const refreshToken = getRefreshToken();

          const { data } = await axiosInstance.post("/v1/auth/refresh", {
            refresh: refreshToken,
          });

          // 새 토근이 반환
          const { setItem: setAccessToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.accessToken
          );

          const { setItem: setRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken
          );

          setAccessToken(data.data.accessToken);
          setRefreshToken(data.data.refreshToken);

          // 새 accessToken을 반환하여 다른요청들이 이것을 사용할 수 있게함
          return data.data.accessToken;
        })()
          .catch((error) => {
            const { removeItem: removeAccessToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.accessToken
            );
            const { removeItem: removeRefreshToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.refreshToken
            );

            removeAccessToken();
            removeRefreshToken();
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      // 진행중인 refreshPromise가 해결될때까지 기다림
      return refreshPromise?.then((newAccessToken: string) => {
        // 원본 요청의 Authorizaiton 헤더를 갱신된 토크으로 업뎃
        originalRequest.headers["Authorization"] = `Bearer${newAccessToken}`;
        // 업데이트 된 원본요청을 재시도한다.

        return axiosInstance.request(originalRequest);
      });
    }
    // 401 에러가 아닌경우그대로 오류를 반환
    return Promise.reject(error);
  }
);
