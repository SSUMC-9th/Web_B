import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../../apis/auth.ts';
import type { UpdateUserDto } from '../../types/auth.ts';
import { QUERY_KEY } from '../../constants/key.ts';

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserDto) => updateUser(data),
    onSuccess: () => {
      // 사용자 정보 쿼리 무효화하여 최신 데이터로 갱신
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });
};
