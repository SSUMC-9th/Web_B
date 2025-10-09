import axios from 'axios';
import type { RequestSignupDto, RequestSigninDto, ResponseSigninDto, ResponseSignupDto } from '../type/auth';
import { axiosInstance } from './axios.ts';
import type { ResponseMyInfoDto } from '../type/auth';
import { useLocalStorage } from '../hooks/useLocalStorage.ts';
import { LOCAL_STORAGE_KEY } from '../constants/key.ts';

export const postSignup = async(body: RequestSignupDto): Promise<ResponseSignupDto> => {
    const {data} = await axiosInstance.post('v1/auth/signup', body);

    return data;
}

export const postSignin = async(body: RequestSigninDto): Promise<ResponseSigninDto> => {
    const {data} = await axiosInstance.post('v1/auth/signin', body);

    return data;
}

export const getMyInfo = async(): Promise<ResponseMyInfoDto> => {
    const {getItem} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const {data} = await axiosInstance.get('v1/users/me', {
        headers: {
            Authorization: 'Bearer',
        }
    });

    return data;
}