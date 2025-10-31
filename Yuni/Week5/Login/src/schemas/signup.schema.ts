import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, '이메일을 입력해주세요')
  .email('올바른 이메일 형식이 아닙니다!');

export const passwordSchema = z
  .string()
  .min(8, '비밀번호는 8자 이상이어야 합니다')
  .max(19, '비밀번호는 20자 미만이어야 합니다');

export const nicknameSchema = z
  .string()
  .min(2, '닉네임은 2자 이상이어야 합니다');

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  passwordCheck: z.string(),
  nickname: nicknameSchema,
}).refine((data) => data.password === data.passwordCheck, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['passwordCheck'],
});

export type SignupFormData = z.infer<typeof signupSchema>;
