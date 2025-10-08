import axios from "axios";
import type {
  ReponseSigninDto,
  RequestSigninDto,
  RequestSignupDto,
  ResponseMyInfoDto,
  ResponseSignupDto,
} from "../tpyes/auth";
import { axiosInstance } from "./axios";

export const postSignup = async (
  body: RequestSignupDto
): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post("v1/auth/signup", body);

  return data;
};

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
