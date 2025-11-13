import { useMutation, useQueryClient } from '@tanstack/react-query';
import { withdraw } from '../../apis/auth';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';

/**
 * 회원탈퇴 Mutation Hook
 * - 회원탈퇴 API 호출
 * - 성공 시 AuthContext logout() 실행
 * - localStorage 토큰 삭제
 * - 모든 캐시 초기화
 * - 로그인 페이지로 리다이렉션
 */
function useWithdraw() {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    // 회원탈퇴 API 호출
    mutationFn: async () => {
      const response = await withdraw();
      return response;
    },
    // 성공 시 인증 정보 삭제 및 리다이렉션
    onSuccess: () => {
      console.log('useWithdraw: 회원탈퇴 성공!');

      // AuthContext에서 사용자 정보 및 토큰 제거
      logout();

      // React Query 캐시 초기화
      queryClient.clear();
      console.log('useWithdraw: 캐시 초기화됨');

      // 로그인 페이지로 리다이렉션
      navigate('/login', { replace: true });
      console.log('useWithdraw: 로그인 페이지로 이동');
    },
    // 요청 실패 시 에러 메시지 출력
    onError: (error: any) => {
      console.error('useWithdraw: 회원탈퇴 실패!', error);
      console.error('에러 상세:', error.response?.data);
    },
  });
}

export default useWithdraw;
