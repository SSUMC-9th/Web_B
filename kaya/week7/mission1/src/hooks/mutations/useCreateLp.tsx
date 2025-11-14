import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../../apis/axios';
import { queryClient } from '../../App.tsx';

export default function useCreateLp(invalidateKey?: readonly unknown[]) {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axiosInstance.post('v1/lps', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      // 목록 자동 갱신
      if (invalidateKey) queryClient.invalidateQueries({ queryKey: invalidateKey });
      else queryClient.invalidateQueries({ queryKey: ['lpList'] });
    },
  });
}
