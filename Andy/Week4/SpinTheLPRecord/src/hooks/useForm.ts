import {type ChangeEvent, useEffect, useState} from "react";

/**
 * useForm 훅의 Props 타입 정의
 * @param initialValue - 폼의 초기값 (예: { email: "", password: "" })
 * @param validate - 유효성 검사 함수 (값을 받아서 에러 메시지 객체를 반환)
 */
interface UseFormProps<T> {
  initialValue: T;
  validate: (values: T) => Record<keyof T, string>;
}

/**
 * 폼 상태 관리를 위한 커스텀 훅
 * 입력값, 에러, 터치 상태를 자동으로 관리합니다.
 */
function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
  // 폼 입력값을 저장하는 state (예: { email: "test@test.com", password: "1234" })
  const [values, setValues] = useState<T>(initialValue);

  // 사용자가 필드를 터치(focus했다가 blur)했는지 추적하는 state
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // 각 필드의 에러 메시지를 저장하는 state (예: { email: "이메일을 입력해주세요" })
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * 입력값이 변경될 때 호출되는 함수
   * @param name - 변경된 필드의 이름 (예: "email")
   * @param text - 새로운 입력값
   */
  const handleChange = (name: keyof T, text: string) => {
    setValues({
      ...values,
      [name]: text,
    });
  };

  /**
   * 사용자가 입력 필드에서 포커스를 잃었을 때(blur) 호출되는 함수
   * 해당 필드를 "터치됨" 상태로 표시
   * @param name - blur된 필드의 이름
   */
  const handleBlur = (name: keyof T) => {
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  /**
   * input 요소에 필요한 props를 한 번에 반환하는 함수
   * spread 연산자로 input에 쉽게 적용 가능: <input {...getInputProps("email")} />
   * @param name - input 필드의 이름
   * @returns value, onChange, onBlur를 포함한 객체
   */
  const getInputProps = (name: keyof T) => {
    const value = values[name];
    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChange(name, e.target.value);
    const onBlur = () => handleBlur(name);
    return { value, onChange, onBlur };
  };

  /**
   * 입력값이 변경될 때마다 유효성 검사를 실행
   * validate 함수를 호출하여 에러 메시지를 업데이트
   */
  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
  }, [values, validate]);

  // 폼 상태와 헬퍼 함수들을 반환
  return { values, errors, touched, getInputProps };
}

export default useForm;