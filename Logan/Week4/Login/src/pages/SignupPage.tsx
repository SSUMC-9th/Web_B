// src/pages/SignupPage.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postSignup } from "../apis/auth";
import GoogleIcon from "../components/GoogleIcon";

// 스키마: 닉네임(name)도 필수로 변경
const schema = z
  .object({
    email: z
      .string()
      .trim()
      .pipe(z.email({ message: "올바른 이메일 형식을 입력해주세요." })),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야합니다." }),
    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야합니다." }),
    name: z.string().min(1, { message: "닉네임을 입력해주세요." }),
  })
  .refine((v) => v.password === v.passwordCheck, {
    path: ["passwordCheck"],
    message: "비밀번호가 일치하지 않습니다.",
  });

type FormFields = z.infer<typeof schema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPw, setShowPw] = useState(false);
  const [showPwCheck, setShowPwCheck] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: { email: "", password: "", passwordCheck: "", name: "" },
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  // 공통 스타일
  const baseInput =
    "w-[320px] rounded-md border bg-transparent px-3 py-2 text-sm text-white placeholder-gray-400 outline-none transition";
  const okStyle =
    "border-white/20 focus:border-white/30 focus:ring-2 focus:ring-pink-500/50";
  const errStyle =
    "border-red-500 bg-red-500/10 focus:ring-2 focus:ring-red-500";

  // STEP1 → STEP2
  const goStep2 = async () => {
    const ok = await trigger("email");
    if (ok) setStep(2);
  };

  // STEP2 → STEP3
  const goStep3 = async () => {
    const ok = await trigger(["password", "passwordCheck"]);
    if (ok) setStep(3);
  };

  // 최종 제출
  const onSubmit = async (values: FormFields) => {
    // 서버 DTO 맞춰서 구성
    await postSignup({
      email: values.email,
      password: values.password,
      name: values.name,
    });
    navigate("/"); // 가입 후 홈으로 이동 (원하면 /login 또는 /my 로 변경)
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 헤더 */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div className="text-pink-500 font-extrabold text-lg">둘러둘러LP판</div>
        <div className="space-x-2">
          <button
            className="rounded bg-neutral-800 px-3 py-1 text-sm"
            onClick={() => navigate("/login")}
          >
            로그인
          </button>
          <button
            className="rounded bg-pink-600 px-3 py-1 text-sm"
            onClick={() => navigate("/signup")}
          >
            회원가입
          </button>
        </div>
      </header>

      {/* 컨테이너 */}
      <main className="mx-auto flex min-h-[70vh] max-w-5xl items-start justify-center px-4">
        <div className="mt-16 flex flex-col items-center">
          {/* 상단 back */}
          <button
            onClick={() =>
              step === 1 ? navigate(-1) : setStep((s) => (s === 3 ? 2 : 1))
            }
            className="mb-4 self-start text-2xl text-white/80 hover:text-white"
            aria-label="뒤로가기"
          >
            ←
          </button>

          <h1 className="mb-6 text-2xl font-bold">회원가입</h1>

          {/* STEP 1: 이메일 */}
          {step === 1 && (
            <div className="flex flex-col items-center">
              {/* 구글 버튼 (UI만) */}
              <button
                type="button"
                className="mb-4 flex h-10 w-[320px] items-center justify-center gap-2 rounded-md border border-white/40 hover:border-white/70"
              >
                <span className="text-xl">
                  <GoogleIcon />
                </span>
                <span className="text-sm">구글 로그인</span>
              </button>

              <div className="mb-4 flex w-[320px] items-center gap-3 text-xs text-white/60">
                <div className="h-[1px] flex-1 bg-white/20" />
                <span>OR</span>
                <div className="h-[1px] flex-1 bg-white/20" />
              </div>

              <div className="space-y-1.5">
                <input
                  {...register("email")}
                  type="email"
                  placeholder="이메일을 입력해주세요!"
                  className={`${baseInput} ${
                    errors.email ? errStyle : okStyle
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              <button
                type="button"
                onClick={goStep2}
                disabled={!!errors.email || !getValues("email")}
                className="mt-4 h-10 w-[320px] rounded-md bg-pink-600 text-sm font-medium text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
              >
                다음
              </button>
            </div>
          )}

          {/* STEP 2: 비밀번호/확인 */}
          {step === 2 && (
            <div className="flex flex-col items-center">
              <div className="mb-4 flex w-[320px] items-center gap-2 text-sm text-white/80">
                <span>✉️</span>
                <span>{getValues("email")}</span>
              </div>

              <div className="relative mt-1 space-y-1.5">
                <input
                  {...register("password")}
                  type={showPw ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요!"
                  className={`${baseInput} ${
                    errors.password ? errStyle : okStyle
                  }`}
                />
                <button
                  type="button"
                  aria-label="비밀번호 보기"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/70"
                >
                  {showPw ? "👁️" : "🙈"}
                </button>
                {errors.password && (
                  <p className="text-xs text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="relative mt-3 space-y-1.5">
                <input
                  {...register("passwordCheck")}
                  type={showPwCheck ? "text" : "password"}
                  placeholder="비밀번호를 다시 한 번 입력해주세요!"
                  className={`${baseInput} ${
                    errors.passwordCheck ? errStyle : okStyle
                  }`}
                />
                <button
                  type="button"
                  aria-label="비밀번호 보기"
                  onClick={() => setShowPwCheck((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/70"
                >
                  {showPwCheck ? "👁️" : "🙈"}
                </button>
                {errors.passwordCheck && (
                  <p className="text-xs text-red-400">
                    {errors.passwordCheck.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={goStep3}
                className="mt-4 h-10 w-[320px] rounded-md bg-pink-600 text-sm font-medium text-white transition hover:bg-pink-700"
              >
                다음
              </button>
            </div>
          )}

          {/* STEP 3: 닉네임 + 완료 */}
          {step === 3 && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center"
            >
              {/* 프로필 이미지 UI (더미) */}
              <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-white/20 text-4xl">
                👤
              </div>

              {/* 닉네임 입력 */}
              <div className="space-y-1.5">
                <input
                  {...register("name")}
                  type="text"
                  placeholder="닉네임을 입력해주세요."
                  className={`${baseInput} ${errors.name ? errStyle : okStyle}`}
                />
                {errors.name && (
                  <p className="text-xs text-red-400">{errors.name.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 h-10 w-[320px] rounded-md bg-pink-600 text-sm font-medium text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
              >
                회원가입 완료
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
