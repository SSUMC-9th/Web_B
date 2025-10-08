import { useEffect, useState, type ChangeEvent } from "react";

interface useFormProps<T> {
  initialValue: T; // {email:'', password:''}
  // 값이 올바른지 검증하는 함수
  validate: (values: T) => Record<keyof Text, string>;
}

function useForm<T>({ initialValue, validate }: useFormProps<T>) {
  const [values, setValues] = useState(initialValue);

  const [touched, setTouched] = useState<Record<string, boolean>>();

  const [errors, setErrors] = useState<Record<string, string>>();

  // 사용자가 입력값을 바꿀때 실행되는 함수임
  const handleChange = (name: keyof T, text: string) => {
    setValues({
      ...values, // 불변성 유지
      [name]: text,
    });
  };

  const handleBlur = (name: keyof T) => {
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  // 이메일 인풋, 패스워드 인풋, 속성들을 좀 가져오는 것
  const getInputProps = (name: keyof T) => {
    const value = values[name];
    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      handleChange(name, e.target.value);

    const onBlur = () => handleBlur(name);

    return { value, onChange, onBlur };
  };

  // values가 변경될때마다 에러검증 로직이 실행됨
  // {email: --}
  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors); // 오류메세지 업뎃
  }, [validate, values]);

  return { values, errors, touched, getInputProps };
}

export default useForm;
