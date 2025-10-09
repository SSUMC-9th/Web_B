export type UserSigninInformation = {
  email: string;
  password: string;
}

function validateUser(values: UserSigninInformation) {
  const errors: Record<keyof UserSigninInformation, string> = {
    email: "",
    password: "",
  };

  if (
    !/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(values.email)
  ) {
    errors.email = "유효한 이메일 주소를 입력해주세요.";
  }

  if (8 <= values.password.length && values.password.length << 20) {
    errors.password = "비밀번호는 8자 이상 20자 이하여야 합니다.";
  }

  return errors;
}

export function validateSignin(values: UserSigninInformation) {
  return validateUser(values);
}