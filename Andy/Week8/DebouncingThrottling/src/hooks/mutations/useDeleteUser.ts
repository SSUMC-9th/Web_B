import { useMutation } from '@tanstack/react-query';
import { deleteUser } from '../../apis/auth.ts';

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: () => deleteUser(),
  });
};
