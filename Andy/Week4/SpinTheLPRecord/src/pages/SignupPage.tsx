import { z } from "zod";
import {type SubmitHandler, useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {postSignup} from "../apis/auth.ts";
import { useState } from "react";

const schema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다"),
  password: z.string().min(
    8, "비밀번호는 최소 8자 이상이어야 합니다"
  ).max(
    20, "비밀번호는 최대 20자 이하여야 합니다"
  ),
  passwordConfirm: z.string().min(
    8, "비밀번호는 최소 8자 이상이어야 합니다"
  ).max(
    20, "비밀번호는 최대 20자 이하여야 합니다"
  ),
  name: z.string().min(1, "이름을 입력해주세요"),
}).refine(data => data.password === data.passwordConfirm, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["passwordConfirm"],
});

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormFields>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
    const { passwordConfirm, ...signupData } = data;
    const response = await postSignup(data);

    console.log(response);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-4 w-full max-w-md px-4">
        <h1 className="text-3xl font-bold text-center mb-6">회원가입</h1>

        <div className="flex flex-col gap-1">
          <input
            {...register("email")}
            className={`border bg-[#141517] w-full p-3 focus:outline-none rounded-lg transition-all ${
              errors.email
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
            }`}
            type="email"
            placeholder="이메일"
          />
          {errors.email && (
            <p className="text-sm text-red-400 px-1 animate-fadeIn">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="relative">
            <input
              {...register("password")}
              className={`border bg-[#141517] w-full p-3 pr-10 focus:outline-none rounded-lg transition-all ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
              }`}
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-400 px-1 animate-fadeIn">{errors.password.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="relative">
            <input
              {...register("passwordConfirm")}
              className={`border bg-[#141517] w-full p-3 pr-10 focus:outline-none rounded-lg transition-all ${
                errors.passwordConfirm
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
              }`}
              type={showPasswordConfirm ? "text" : "password"}
              placeholder="비밀번호 확인"
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showPasswordConfirm ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.passwordConfirm && (
            <p className="text-sm text-red-400 px-1 animate-fadeIn">{errors.passwordConfirm.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            {...register("name")}
            className={`border bg-[#141517] w-full p-3 focus:outline-none rounded-lg transition-all ${
              errors.name
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
            }`}
            type="text"
            placeholder="이름"
          />
          {errors.name && (
            <p className="text-sm text-red-400 px-1 animate-fadeIn">{errors.name.message}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
          className={`w-full p-3 rounded-lg font-semibold transition-all ${
            isValid
              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-400 hover:to-rose-400 cursor-pointer"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}

export default SignupPage;