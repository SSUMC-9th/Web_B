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
    email: string;
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