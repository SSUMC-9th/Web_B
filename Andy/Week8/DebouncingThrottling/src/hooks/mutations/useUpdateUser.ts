import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../../apis/auth.ts';
import type { UpdateUserDto, ResponseMyInfoDto } from '../../types/auth.ts';
import { QUERY_KEY } from '../../constants/key.ts';

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserDto) => updateUser(data),

    // 낙관적 업데이트: 서버 응답 전에 즉시 UI 업데이트
    onMutate: async (newData: UpdateUserDto) => {
      // 진행 중인 refetch 취소 (낙관적 업데이트를 덮어쓰지 않도록)
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });

      // 이전 데이터 저장 (롤백용)
      const previousData = queryClient.getQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo]);

      // 캐시를 즉시 업데이트
      if (previousData) {
        queryClient.setQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo], {
          ...previousData,
          data: {
            ...previousData.data,
            ...newData,
          },
        });
      }

      // 롤백을 위해 이전 데이터 반환
      return { previousData };
    },

    // 에러 발생 시 롤백
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData([QUERY_KEY.myInfo], context.previousData);
      }
      console.error('프로필 수정 실패:', error);
    },

    // 성공/실패 여부와 관계없이 쿼리 무효화 (서버 데이터와 동기화)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });
};
