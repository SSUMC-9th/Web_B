import { validateSignin, type UserSigninInformation } from '../utils/validate.ts';
import useForm from '../hooks/useForm.tsx';
import {useAuth} from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const LoginPage = () => {
    const {login} = useAuth();
    const navigate = useNavigate();

    // 이걸 없애야 하나?
    //useEffect(() => {
    //    if (accessToken) {
    //        navigate('/');
    //    }
    //}, [navigate, accessToken]);

    const { values, errors, touched, getInputProps }
    = useForm<UserSigninInformation>({
        initialValue: {
            email: '',
            password: '',
        },
        validate: validateSignin,
    })

    // useAuth 사용으로 간단해짐
    const handleSubmit = async () => {
        await login(values);
    }

    const handleGoogleLogin = () => {
        window.location.href = 
        import.meta.env.VITE_SERVER_API_URL + '/v1/auth/google/login';
    }

    // 오류가 하나라도 있거나, 입력값이 비어있으면 버튼을 비활성화
    const isDisabled = Object.values(errors || {}).some((error) => error.length > 0) || // 오류가 있으면 true
    Object.values(values).some((value) => value === ''); // 입력값이 비어있으면 true

    // 페이지 이동 함수 
    const handleGoBack = () => {
        navigate(-1);
    };
    
    return (
        <div className='flex flex-col items-center justify-center h-full gap-4'>
            <div className='flex flex-col gap-3'>
                <input
                    {...getInputProps('email')}
                    name='email'
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                    ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                    type={'email'}
                    placeholder={'이메일'}
                />
                {errors?.email && touched?.email && (
                    <div className='text-red-500 text-sm'>{errors.email}</div>
                )}
                <input
                {...getInputProps('password')}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                    ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                    type={'password'}
                    placeholder={'비밀번호'}
                />
                {errors?.password && touched?.password && (
                    <div className='text-red-500 text-sm'>{errors.password}</div>
                )}
                <button 
                    type='button'
                    onClick={handleSubmit} disabled={false}
                    className='w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300'
                    >
                        로그인
                </button>
                <button 
                    type='button'
                    onClick={handleGoogleLogin} 
                    className='w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300'
                    >
                        <div className='flex items-center justify-center gap-4'>
                            <img src={'images/google.png'} width={30} alt='Google Logo Image'/>
                            <span>구글 로그인</span>
                        </div>
                </button>
            </div>
        </div>
    )
}

export default LoginPage;