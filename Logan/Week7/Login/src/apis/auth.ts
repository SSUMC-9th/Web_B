import axios from "axios";
import type {
  ReponseSigninDto,
  RequestSigninDto,
  RequestSignupDto,
  ResponseMyInfoDto,
  ResponseSignupDto,
} from "../types/auth";
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

/** 내 정보 수정 (JSON) : 보낸 필드만 서버가 갱신하도록 구현 */
export async function patchMyInfo(payload: {
  name?: string; // 선택: 닉네임
  bio?: string; // 선택: 빈 문자열 "" 허용
  avatar?: string | null; // 선택: URL 문자열, null이면 삭제 의도(백엔드 합의 시)
}) {
  const body: Record<string, any> = {};
  if (payload.name !== undefined) body.name = payload.name;
  if (payload.bio !== undefined) body.bio = payload.bio; // "" 그대로 전달
  if (payload.avatar !== undefined) body.avatar = payload.avatar; // string 또는 null

  const { data } = await axiosInstance.patch<ResponseMyInfoDto>(
    "/v1/users",
    body,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return data;
}

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get("v1/users/me");

  return data;
};

export const postLogout = async () => {
  const { data } = await axiosInstance.post("/v1/auth/signout");
  return data;
};

// 탈퇴처리

export const deleteMe = async () => {
  const { data } = await axiosInstance.delete("/v1/users");
  return data;
};
