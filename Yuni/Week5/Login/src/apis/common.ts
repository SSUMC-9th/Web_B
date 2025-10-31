import axios from "axios";
import type { RequestSigninDto, RequestUser, ResponseSignupDto, ResponseSigninDto, ResponseRefreshTokenDto } from './auth';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 갱신 중복 방지 플래그
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * Request Interceptor
 * 모든 요청에 accessToken을 자동으로 헤더에 추가합니다
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 토큰 갱신 구독자들에게 새로운 토큰을 전달
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// 구독자 추가
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

/**
 * Response Interceptor
 * 401 에러(토큰 만료)를 처리합니다
 * - Refresh Token으로 새로운 Access Token을 발급받고 실패한 요청을 재시도
 * - 로그인/회원가입 엔드포인트는 401 응답을 처리하지 않음
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 로그인/회원가입 엔드포인트는 토큰 갱신 로직 실행하지 않음
    if (error.response?.status === 401 &&
        error.config?.url !== '/auth/signin' &&
        error.config?.url !== '/auth/signup') {

      // Refresh Token 로직 활성화
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');

          if (!refreshToken) {
            // Refresh Token이 없으면 로그아웃
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return Promise.reject(error);
          }

          console.log('%c🔄 AccessToken 갱신 중...', 'color: #4ecdc4; font-size: 16px; font-weight: bold;');
          console.log('%cRefresh Token:', 'color: #ffd93d; font-weight: bold;', refreshToken);

          // Refresh Token으로 새로운 Access Token 발급
          const response = await axios.post<ResponseRefreshTokenDto>(
            'http://localhost:8000/v1/auth/refresh',
            { refresh: refreshToken },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          console.log('%c갱신 응답:', 'color: #ffd93d; font-weight: bold;', response.data);

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

          // 새로운 토큰 저장
          localStorage.setItem('accessToken', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }

          console.log('%c✅ AccessToken 갱신 성공!', 'color: #6bcf7f; font-size: 16px; font-weight: bold;');

          // 원래 요청에 새로운 토큰 적용
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // 구독자들에게 새로운 토큰 전달
          onRefreshed(newAccessToken);

          // 원래 요청 재시도
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('%c❌ 토큰 갱신 실패:', 'color: #ff6b6b; font-weight: bold;', refreshError);
          // 토큰 갱신 실패 시 로그아웃
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // 토큰 갱신 중이면 구독자로 등록하고 대기
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export { axiosInstance };

// 회원가입
export const postSignup = async (body: RequestUser): Promise<ResponseSignupDto> => {
  console.log('📤 회원가입 요청 데이터:', body);
  try {
    const { data } = await axiosInstance.post<ResponseSignupDto>('/auth/signup', body);
    console.log('✅ 회원가입 응답:', data);
    return data;
  } catch (error: any) {
    console.error('❌ 회원가입 실패:', error.response?.data);
    throw error;
  }
};

// 로그인
export const postSignin = async (body: RequestSigninDto): Promise<ResponseSigninDto> => {
  console.log('📤 로그인 요청 데이터:', body);
  try {
    const { data } = await axiosInstance.post<ResponseSigninDto>('/auth/signin', body);
    console.log('✅ 로그인 응답:', data);
    return data;
  } catch (error: any) {
    console.error('❌ 로그인 요청 실패 - 상세 정보:');
    throw error;
  }
};