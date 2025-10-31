
import { validateSignin, type UserSigninInformation } from "../utils/validate"
import useForm from "../hooks/useForm";
import { useAuth } from "../context/AutoContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LoginPage = () => {
    const {login, accessToken} = useAuth();
    const navigate = useNavigate();


    useEffect( () => {
      if(accessToken) {
        navigate('/')
      }
    }, [navigate, accessToken]);


    
    const { values, errors, touched, getInputProps }
    = useForm<UserSigninInformation>({
        initialValue: {
            email: '',
            password: '',
        },
        validate: validateSignin,
    })

    const handleSubmit = async () => {
          await login(values) 
      }

      const handleGoogleLogin = () => {
      window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  return (
    <div className='flex flex-col items-center justify-center h-full gap-4'>
      <div className='flex flex-col gap-3'> <div className='text-2xl font-bold'>로그인</div>
        <input 
              {...getInputProps("email")}
              name="email"
              type={"email"} 
              className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
                ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
              placeholder={"이메일"}
               />
        {errors?.email && touched?.email && (<div className="text-red-500 text-sm">{errors.email}</div>)}
        <input 
              {...getInputProps("password")}
              type={"password"} 
              className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                 ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
              placeholder={"비밀번호"}
               />
        {errors?.password && touched?.password && (<div className="text-red-500 text-sm">{errors.password}</div>)}
        <button type="button" 
                onClick={handleSubmit}
                disabled={false}
                className="w-full bg-blue-600 text-white py-3 rounded-md 
                          text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300">로그인</button>
        <button type="button" 
                onClick={handleGoogleLogin}
                disabled={false}
                className="w-full bg-blue-600 text-white py-3 rounded-md 
                          text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300">
                            <div className = "flex items-center justify-center gap-4">
                            <img src={"/images/google.svg"} alt = "Google Logo" className = "w-6 h-6"/>
                            <span>구글 로그인</span>
                            </div>
                            </button>
      </div>
    </div>
  )
}

export default LoginPage
