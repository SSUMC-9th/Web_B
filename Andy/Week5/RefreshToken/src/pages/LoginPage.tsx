import { type UserSigninInformation, validateSignin } from "../utils/validate.ts";
import useForm from "../hooks/useForm.ts";
import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
    initialValue: {
      email: "",
      password: "",
    },
    validate: validateSignin,
  })

  const handleSubmit = async () => {
    await login(values);
    navigate("/mypage");
  }

  const isValid = !errors.email && !errors.password;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-4 w-full max-w-md px-4">
        <h1 className="text-3xl font-bold text-center mb-6">로그인</h1>

        <div className="flex flex-col gap-1">
          <input
            {...getInputProps("email")}
            className={`border bg-[#141517] w-full p-3 focus:outline-none rounded-lg transition-all ${
              errors.email && touched?.email
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
            }`}
            type="email"
            placeholder="이메일"
          />
          {errors.email && touched?.email && (
            <p className="text-sm text-red-400 px-1 animate-fadeIn">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            {...getInputProps("password")}
            className={`border bg-[#141517] w-full p-3 focus:outline-none rounded-lg transition-all ${
              errors.password && touched?.password
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
            }`}
            type="password"
            placeholder="비밀번호"
          />
          {errors.password && touched?.password && (
            <p className="text-sm text-red-400 px-1 animate-fadeIn">{errors.password}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full p-3 rounded-lg font-semibold transition-all ${
            isValid
              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-400 hover:to-rose-400 cursor-pointer"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          로그인
        </button>
      </div>
    </div>
  );
}

export default LoginPage;