import axios from "axios";
import type { RequestSigninDto, RequestUser, ResponseSignupDto, ResponseSigninDto } from './auth';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

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

/**
 * Response Interceptor
 * 401 에러(인증 실패)를 처리합니다
 * - 로그인 페이지로 리다이렉트
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 인증 실패 - 로그아웃 처리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };

// 회원가입
export const postSignup = async (body: RequestUser): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post<ResponseSignupDto>('/auth/signup', body);
  return data;
};

// 로그인
export const postSignin = async (body: RequestSigninDto): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post<ResponseSigninDto>('/auth/signin', body);
  return data;
};