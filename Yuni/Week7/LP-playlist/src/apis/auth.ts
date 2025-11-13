// 인증 관련 API 및 타입 정의

import { axiosInstance } from './axios';

export type CommonResponse<T> = {
    status: boolean;
    statusCode: number;
    message: string;
    data: T;
};

//회원가입 요청
export type RequestUser = {
  name: string,
  email: string,
  bio?: string,
  avatar?: string,
  password: string
};

export type ResponseSignupDto = CommonResponse<{
    id: number;
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}>;

//로그인 요청
export type RequestSigninDto = {
    email: string;
    password: string;
}

export type ResponseSigninDto = CommonResponse<{
    id: number;
    name: string;
    accessToken: string;
    refreshToken: string;
}>;

// 내 정보 조회
export type ResponseMeDto = CommonResponse<{
    id: number;
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}>;

// 토큰 갱신 요청
export type RequestRefreshTokenDto = {
    refreshToken: string;
};

// 토큰 갱신 응답
export type ResponseRefreshTokenDto = CommonResponse<{
    accessToken: string;
    refreshToken: string;
}>;

// 이미지 업로드 응답
export type ResponseUploadImageDto = CommonResponse<{
    imageUrl: string;
}>;

// 내 정보 조회 응답 (기존 ResponseMeDto와 동일)
// ResponseMeDto 재사용

/**
 * 회원가입 API
 * @param body 회원가입 요청 정보
 * @returns 회원가입 응답
 */
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

/**
 * 로그인 API
 * @param body 로그인 요청 정보
 * @returns 로그인 응답
 */
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

/**
 * 내 정보 조회 API
 * @returns 현재 로그인한 사용자의 정보
 */
export const getMe = async (): Promise<ResponseMeDto> => {
  console.log('📤 내 정보 조회 중...');
  try {
    const { data } = await axiosInstance.get<ResponseMeDto>('/users/me');
    console.log('✅ 내 정보 조회 성공:', data.data);
    return data;
  } catch (error: any) {
    console.error('❌ 내 정보 조회 실패:', error.response?.data);
    throw error;
  }
};

/**
 * 이미지 업로드 API (인증)
 * @param file 업로드할 이미지 파일
 * @returns 이미지 URL
 */
export const uploadImage = async (file: File): Promise<string> => {
  console.log('📤 이미지 업로드 중:', file.name);
  try {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await axiosInstance.post<ResponseUploadImageDto>('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('✅ 이미지 업로드 성공:', data.data.imageUrl);
    return data.data.imageUrl;
  } catch (error: any) {
    console.error('❌ 이미지 업로드 실패:', error.response?.data);
    throw error;
  }
};