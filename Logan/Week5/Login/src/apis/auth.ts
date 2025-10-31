import axios from "axios";
import type {
  ReponseSigninDto,
  RequestSigninDto,
  RequestSignupDto,
  ResponseMyInfoDto,
  ResponseSignupDto,
} from "../tpyes/auth";
import { axiosInstance } from "./axios";

// 회원가입요청
export const postSignup = async (
  body: RequestSignupDto
): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post("v1/auth/signup", body);

  return data;
};

// 로그인요청
// ReqeustSigninDto타입의 body에는 email이랑 pw가 들어감
export const postSignin = async (
  body: RequestSigninDto
): Promise<ReponseSigninDto> => {
  const { data } = await axiosInstance.post("v1/auth/signin", body);

  return data;
};

export const getMyinfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get("v1/users/me");

  return data;
};

export const postLogout = async () => {
  const { data } = await axiosInstance.post("/v1/auth/signout");
  return data;
};
