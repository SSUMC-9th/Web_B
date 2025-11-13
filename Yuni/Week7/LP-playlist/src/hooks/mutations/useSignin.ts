import { useMutation } from '@tanstack/react-query';
import { postSignin, getMe } from '../../apis/auth';
import type { RequestSigninDto } from '../../apis/auth';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../types/auth.types';
import { STORAGE_KEYS } from '../../constants/key';

/**
 * 로그인 Mutation Hook
 * - 로그인 API 호출
 * - Refresh Token localStorage 저장
 * - getMe() 호출로 완전한 사용자 정보 조회
 * - AuthContext의 login() 실행
 * - 성공 시 홈으로 리다이렉션
 */
function useSignin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    // 로그인 API 호출 함수
    mutationFn: async (variables: RequestSigninDto) => {
      const response = await postSignin(variables);

      // Refresh Token localStorage에 저장
      if (response.status && response.data.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
        console.log('useSignin: Refresh Token 저장됨');
      }

      return response;
    },
    // 성공 시 사용자 정보 조회 및 인증 처리
    onSuccess: async (data: any) => {
      console.log('useSignin: 로그인 성공!', data.data);

      try {
        // getMe() 호출로 완전한 사용자 정보 조회
        const meResponse = await getMe();
        if (meResponse.status) {
          const completeUser: User = {
            id: meResponse.data.id,
            name: meResponse.data.name,
            email: meResponse.data.email,
            bio: meResponse.data.bio,
            avatar: meResponse.data.avatar,
            role: 'user',
            createdAt: new Date(meResponse.data.createdAt),
            updatedAt: new Date(meResponse.data.updatedAt),
          };

          // AuthContext에 저장
          login(data.data.accessToken, completeUser);
          console.log('useSignin: 완전한 사용자 정보 조회 및 로그인 성공:', completeUser);

          // 홈으로 리다이렉션
          navigate('/', { replace: true });
          console.log('useSignin: 홈으로 이동');
        }
      } catch (meError) {
        console.warn('useSignin: getMe 호출 실패, 기본 정보로 진행:', meError);

        // getMe 실패 시 로그인 응답의 기본 정보로 진행
        const tempUser: User = {
          id: data.data.id,
          name: data.data.name,
          email: '', // 로그인 응답에 없으므로 빈 값
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        login(data.data.accessToken, tempUser);
        navigate('/', { replace: true });
      }
    },
    // 요청 실패 시 에러 메시지 출력
    onError: (error: any) => {
      console.error('useSignin: 로그인 실패!', error);
      console.error('에러 상세:', error.response?.data);
    },
  });
}

export default useSignin;
