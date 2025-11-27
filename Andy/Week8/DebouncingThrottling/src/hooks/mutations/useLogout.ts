import { useMutation } from '@tanstack/react-query';
import { postSignout } from '../../apis/auth.ts';
import { LOCAL_STORAGE_KEY } from '../../constants/key.ts';

export const useLogout = () => {
  return useMutation({
    mutationFn: () => postSignout(),
    onSuccess: () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
      localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
    },
  });
};
