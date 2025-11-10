import React from "react";
import useForm from "../hooks/useForm";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { type UserSigninInformation, validateSignin } from "../utils/validate";
import AppHeader from "../components/Appheader";
import GoogleIcon from "../components/GoogleIcon";
import Divider from "../components/Divider";
import { postSignin } from "../apis/auth";
import type { ReponseSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth(); // useAuth에서 login 꺼내쓰기
  const navigate: NavigateFunction = useNavigate();

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    await login(values);
  };

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  // 오류가 하나라도 있거나, 입력값이 비어있으면 버튼을 비활성화
  const isDisabled =
    Object.values(errors || {}).some((error: string) => error.length > 0) ||
    Object.values(values).some((value: string) => value === "");

  // 이전페이지 이동작업 위에 navigate에서 중복떠서 주석처리했음

  //const navigate = useNavigate();
  // 페이지 이동 함수
  const handleGoBack = () => {
    navigate(-1); // react-router-dom의 뒤로가기 기능
  };

  return (
    // 스타일적용
    <div className="min-h-screen bg-black text-white">
      <AppHeader />

      <main className="mx-auto flex max-w-6xl justify-center px-4">
        <section className="w-full max-w-sm pt-16 sm:pt-20">
          {/* 상단 타이틀 라인 */}
          <div className="mb-6 flex items-center gap-2 text-gray-300">
            <button
              type="button"
              aria-label="뒤로가기"
              className="rounded-md p-1 hover:bg-white/10"
              onClick={handleGoBack}
            >
              {/* chevron-left */}
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-lg font-semibold">로그인</h1>
          </div>

          {/* 카드 */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur">
            {/* 구글 로그인 */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              //disabled={isDisabled}
              className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/20 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <GoogleIcon />
              <span>구글 로그인</span>
            </button>

            <Divider text="OR" />

            {/* 이메일 */}
            <div className="space-y-1.5">
              <input
                {...getInputProps("email")}
                name="email"
                type="email"
                placeholder="이메일을 입력해주세요!"
                className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition
                ${
                  errors?.email && touched?.email
                    ? "border-red-500 bg-red-500/10 focus:ring-2 focus:ring-red-500"
                    : "border-white/20 focus:border-white/30 focus:ring-2 focus:ring-pink-500/50"
                }`}
              />
              {errors?.email && touched?.email && (
                <p className="text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div className="mt-3 space-y-1.5">
              <input
                {...getInputProps("password")}
                name="password"
                type="password"
                placeholder="비밀번호를 입력해주세요!"
                className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition
                ${
                  errors?.password && touched?.password
                    ? "border-red-500 bg-red-500/10 focus:ring-2 focus:ring-red-500"
                    : "border-white/20 focus:border-white/30 focus:ring-2 focus:ring-pink-500/50"
                }`}
              />
              {errors?.password && touched?.password && (
                <p className="text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {/* 로그인 버튼 */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isDisabled}
              className="mt-4 w-full rounded-md bg-pink-600 py-3 text-sm font-medium text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
            >
              로그인
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
