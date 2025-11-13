import { useMutation } from '@tanstack/react-query';
import { updateProfile } from '../../apis/auth';
import type { UpdateProfileRequest } from '../../apis/auth';
import { useAuth } from '../useAuth';
import type { User } from '../../types/auth.types';

/**
 * 프로필 수정 Mutation Hook
 * - 프로필 수정 API 호출
 * - name (필수), bio (선택), avatar (선택) 업데이트
 * - 성공 시 AuthContext의 setUser() 실행
 * - loading, error, success 상태 자동 관리
 */
function useUpdateProfile() {
  const { setUser } = useAuth();

  return useMutation({
    // 프로필 수정 API 호출 함수
    mutationFn: async (variables: UpdateProfileRequest) => {
      const response = await updateProfile(variables);
      return response;
    },
    // 성공 시 AuthContext 사용자 정보 업데이트
    onSuccess: (data: any) => {
      console.log('useUpdateProfile: 프로필 수정 성공!', data.data);

      // 서버에서 받은 업데이트된 사용자 정보로 AuthContext 업데이트
      const updatedUser: User = {
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        bio: data.data.bio,
        avatar: data.data.avatar,
        role: 'user',
        createdAt: new Date(data.data.createdAt),
        updatedAt: new Date(data.data.updatedAt),
      };
      setUser(updatedUser);
      console.log('useUpdateProfile: AuthContext 사용자 정보 업데이트됨');
    },
    // 요청 실패 시 에러 메시지 출력
    onError: (error: any) => {
      console.error('useUpdateProfile: 프로필 수정 실패!', error);
      console.error('에러 상세:', error.response?.data);
    },
  });
}

export default useUpdateProfile;
