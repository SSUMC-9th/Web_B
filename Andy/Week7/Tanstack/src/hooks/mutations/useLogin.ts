import { useMutation } from "@tanstack/react-query";
import { postSignin } from '../../apis/auth.ts';
import type { RequestSigninDto } from '../../types/auth.ts';
import { LOCAL_STORAGE_KEY } from '../../constants/key.ts';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: RequestSigninDto) => postSignin(data),
    onSuccess: (response) => {
      if (response.data) {
        localStorage.setItem(
          LOCAL_STORAGE_KEY.accessToken,
          JSON.stringify(response.data.accessToken)
        );
        localStorage.setItem(
          LOCAL_STORAGE_KEY.refreshToken,
          JSON.stringify(response.data.refreshToken)
        );
      }
    },
  });
}