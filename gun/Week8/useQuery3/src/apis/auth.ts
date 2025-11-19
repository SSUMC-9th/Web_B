import type { RequestSignupDto, RequestSigninDto, ResponseSigninDto, ResponseSignupDto, RequestUpdateUserDto, ResponseUserDto } from '../type/auth';
import { axiosInstance } from './axios.ts';
import type { ResponseMyInfoDto } from '../type/auth';



export const postSignup = async(body: RequestSignupDto): Promise<ResponseSignupDto> => {
    const {data} = await axiosInstance.post('/v1/auth/signup', body);

    return data;
}

export const postSignin = async(body: RequestSigninDto): Promise<ResponseSigninDto> => {
    const {data} = await axiosInstance.post('/v1/auth/signin', body);

    return data;
}

export const getMyInfo = async(): Promise<ResponseMyInfoDto> => {
    const {data} = await axiosInstance.get('v1/users/me');

    return data;
}

export const updateUser = async(dto: RequestUpdateUserDto): Promise<ResponseUserDto> => {
    const {data} = await axiosInstance.patch('v1/users', dto);

    return data;
}

export const postSignOut = async () => {
    const {data} = await axiosInstance.post('v1/auth/signout');
    
    return data;
}