import { type UserSigninInformation, validateSignin } from "../utils/validate.ts";
import useForm from "../hooks/useForm.ts";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/mutations/useLogin.ts";

const LoginPage = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending: isLoggingIn } = useLogin();
  const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
    initialValue: {
      email: "",
      password: "",
    },
    validate: validateSignin,
  })

  const handleSubmit = () => {
    login(values, {
      onSuccess: () => { navigate("/explore") },
      onError: (error: any) => {
        console.error("로그인 오류:", error);
        console.error("에러 응답:", error.response?.data);
        console.error("에러 상태:", error.response?.status);
        alert(`로그인에 실패했습니다: ${error.response?.data?.message || error.message}`);
      },
    });
  };

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

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
          disabled={!isValid || isLoggingIn}
          className={`w-full p-3 rounded-lg font-semibold transition-all ${
            isValid && !isLoggingIn
              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-400 hover:to-rose-400 cursor-pointer"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isLoggingIn ? "로그인 중..." : "로그인"}
        </button>

        <div className="flex items-center gap-4 my-2">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="text-gray-400 text-sm">또는</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full p-3 rounded-lg font-semibold bg-white text-gray-700 hover:bg-gray-100 transition-all flex items-center justify-center gap-3 border border-gray-300"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.859-3.0477.859-2.344 0-4.3282-1.5831-5.036-3.7104H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2823-1.71V4.9582H.9573A8.9965 8.9965 0 0 0 0 9c0 1.4523.3477 2.8268.9573 4.0418L3.964 10.71z" fill="#FBBC05"/>
            <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.426 0 9 0 5.4818 0 2.4382 2.0168.9574 4.9582L3.964 7.29C4.6718 5.1627 6.6559 3.5795 9 3.5795z" fill="#EA4335"/>
          </svg>
          Google로 로그인
        </button>
      </div>
    </div>
  );
}

export default LoginPage;