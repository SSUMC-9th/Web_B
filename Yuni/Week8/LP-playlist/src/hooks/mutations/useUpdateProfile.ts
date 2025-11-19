import { useMutation } from '@tanstack/react-query';
import { updateProfile } from '../../apis/auth';
import type { UpdateProfileRequest } from '../../apis/auth';
import { useAuth } from '../useAuth';
import type { User } from '../../types/auth.types';

/**
 * 프로필 수정 Mutation Hook (낙관적 업데이트 포함)
 * - onMutate: 서버 요청 전 즉시 UI 업데이트 (낙관적 업데이트)
 * - mutationFn: 프로필 수정 API 호출
 * - onSuccess: 서버 응답 받은 후 최종 확인 업데이트
 * - onError: 실패 시 이전 상태로 롤백
 * - loading, error, success 상태 자동 관리
 */
function useUpdateProfile() {
  const { user, setUser } = useAuth();

  return useMutation({
    // 요청 전: 낙관적 업데이트 (서버 응답 기다리지 않고 즉시 변경)
    onMutate: async (variables: UpdateProfileRequest) => {
      console.log('useUpdateProfile: 낙관적 업데이트 시작', variables);

      // 이전 사용자 정보 백업 (실패 시 롤백용)
      const previousUser = user;

      // 즉시 UI 업데이트 (낙관적 업데이트)
      const optimisticUser: User = {
        id: user!.id,
        name: variables.name,
        email: user!.email,
        bio: variables.bio ?? user!.bio,
        avatar: variables.avatar ?? user!.avatar,
        role: user!.role,
        createdAt: user!.createdAt,
        updatedAt: new Date(), // 현재 시간으로 업데이트
      };

      setUser(optimisticUser);
      console.log('useUpdateProfile: 낙관적 업데이트 완료 (Navbar, DashboardPage 즉시 반영)');

      // 롤백용 데이터 반환
      return { previousUser };
    },

    // 프로필 수정 API 호출
    mutationFn: async (variables: UpdateProfileRequest) => {
      const response = await updateProfile(variables);
      return response;
    },

    // 성공 시: 서버 응답으로 최종 확인 업데이트
    onSuccess: (data: any) => {
      console.log('useUpdateProfile: 프로필 수정 성공! (서버 확인)', data.data);

      // 서버에서 받은 최종 업데이트된 사용자 정보로 AuthContext 업데이트
      const finalUser: User = {
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        bio: data.data.bio,
        avatar: data.data.avatar,
        role: 'user',
        createdAt: new Date(data.data.createdAt),
        updatedAt: new Date(data.data.updatedAt),
      };
      setUser(finalUser);
      console.log('useUpdateProfile: 최종 사용자 정보 업데이트됨');
    },

    // 실패 시: 이전 상태로 롤백
    onError: (error: any, context: any) => {
      console.error('useUpdateProfile: 프로필 수정 실패!', error);
      console.error('에러 상세:', error.response?.data);

      // onMutate에서 저장한 이전 사용자 정보로 롤백
      if (context?.previousUser) {
        setUser(context.previousUser);
        console.log('useUpdateProfile: 이전 상태로 롤백됨');
      }
    },
  });
}

export default useUpdateProfile;
