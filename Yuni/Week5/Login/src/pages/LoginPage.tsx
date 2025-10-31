import { useNavigate } from 'react-router-dom';
import type { UserSigninInformation } from '../utils/validate';
import validateSignin from '../utils/validate';
import useForm from '../hooks/useForm';
import { postSignin } from '../apis/common';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import type { User } from '../types/auth.types';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
        initialValues: { email: '', password: '' },
        validate: validateSignin,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // API 호출
            const response = await postSignin({
                email: values.email,
                password: values.password,
            });

            if (response.status) {
                // 토큰 저장 및 사용자 정보 설정
                const user: User = {
                    id: response.data.id,
                    email: values.email, // 로그인할 때 입력한 이메일 사용
                    name: response.data.name,
                    role: 'user', // 기본 역할은 user
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                login(response.data.accessToken, user);
                console.log('✅ 로그인 성공! 토큰 저장됨:', response.data.accessToken);

                // 로그인 성공 후 홈으로 리다이렉트
                navigate('/', { replace: true });
            } else {
                setError(response.message || '로그인에 실패했습니다.');
            }
        } catch (err) {
            console.error('❌ 로그인 에러:', err);

            // 🔧 임시 해결: 백엔드가 없을 때 테스트용 모의 응답
            const errorMsg = (err as any)?.message || '';
            const errorCode = (err as any)?.code || '';
            const isConnectionError = errorMsg.includes('ERR_CONNECTION_REFUSED') ||
                                     errorMsg.includes('ECONNREFUSED') ||
                                     errorMsg.includes('Network Error') ||
                                     errorCode === 'ECONNREFUSED' ||
                                     errorCode === 'ERR_NETWORK';

            if (isConnectionError) {
                console.log('🔧 백엔드 연결 실패 - 모의 로그인 실행');

                // 임시 토큰 생성
                const mockAccessToken = 'mock-token-' + Date.now();
                const mockUser: User = {
                    id: 1,
                    name: values.email.split('@')[0],
                    email: values.email,
                    role: 'user',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                console.log('✅ 모의 로그인 성공 (테스트 모드):', { mockAccessToken, mockUser });
                login(mockAccessToken, mockUser);
                setError('⚠️ 백엔드 없이 테스트 모드로 로그인했습니다. 2초 후 이동합니다...');

                // 2초 후 홈으로 리다이렉트
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 2000);
            } else {
                if (err instanceof Error) {
                    setError(err.message || '로그인 중 오류가 발생했습니다.');
                } else {
                    setError('로그인 중 오류가 발생했습니다.');
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    const isDisable : boolean =
        Object.values(errors ?? {}).some((error) => error !== "") ||
        Object.values(values ?? {}).some((value) => value === "");

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-4 mb-8 relative">
            <button
                onClick={() => navigate(-1)}
                className="text-white hover:text-gray-300 transition absolute left-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-2xl font-semibold">로그인</h2>
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition mb-6">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium">구글 로그인</span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              {...getInputProps("email")}
              name="email"
              type={"email"}
              placeholder="이메일을 입력해주세요!"
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-pink-500 transition mb-4 placeholder-gray-500"
              disabled={isSubmitting}
            />
            {errors?.email && touched?.email && (
              <div className="text-red-500 text-sm mb-4">{errors.email}</div>
            )}

            <input
              {...getInputProps("password")}
              type="password"
              placeholder="비밀번호를 입력해주세요!"
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-pink-500 transition mb-6 placeholder-gray-500"
              disabled={isSubmitting}
            />
            {errors?.password && touched?.password && (
              <div className="text-red-500 text-sm mb-4">{errors.password}</div>
            )}

            <button
              type="submit"
              disabled={isDisable || isSubmitting}
              className={`w-full px-6 py-3 rounded-lg font-medium ${
                isDisable || isSubmitting
                  ? 'bg-gray-600 text-white cursor-not-allowed opacity-50'
                  : 'bg-gray-800 text-white hover:bg-gray-700 transition'
              }`}
            >
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

/* getInputProps is provided by the useForm hook and removed from this file */

