import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../../apis/axios';
import { queryClient } from '../../App.tsx';

interface CreateLpBody {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
}

export default function useCreateLp(invalidateKey?: readonly unknown[]) {
  return useMutation<unknown, unknown, CreateLpBody>({
    mutationFn: async (body) => {
      const { data } = await axiosInstance.post('v1/lps', body);
      return data;
    },
    onSuccess: () => {
      // queryKey 캐시 지우고 다시 서버에서 가져오기
      if (invalidateKey) queryClient.invalidateQueries({ queryKey: invalidateKey });
      // 기본 목록만 새로고침
      else queryClient.invalidateQueries({ queryKey: ['lpList'] });
    },
  });
}
