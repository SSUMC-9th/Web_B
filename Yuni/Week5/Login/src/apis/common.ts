import axios from "axios";
import type { RequestSigninDto, RequestUser, ResponseSignupDto, ResponseSigninDto } from './auth';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

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