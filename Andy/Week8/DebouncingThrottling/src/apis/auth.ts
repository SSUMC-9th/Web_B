import { axiosInstance } from "./axios.ts";
import type {
  RequestSigninDto,
  RequestSignupDto,
  ResponseMyInfoDto,
  ResponseSigninDto,
  ResponseSignupDto,
  UpdateUserDto
} from "../types/auth.ts";

export const postSignup = async(
  body: RequestSignupDto
): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signup", body);

  return data;
}

export const postSignin = async(
  body: RequestSigninDto
): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signin", body);

  return data;
}

export const postSignout = async(): Promise<void> => {
  const { data } = await axiosInstance.post("/v1/auth/signout");

  return data;
}

export const getMyInfo = async(): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get("/v1/users/me");

  return data;
}

export const updateUser = async(
  body: UpdateUserDto
): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.patch("/v1/users", body);

  return data;
}

export const deleteUser = async(): Promise<void> => {
  await axiosInstance.delete("/v1/users");
}