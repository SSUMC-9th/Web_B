import { useEffect, useState, type ChangeEvent } from "react";

interface UseFormProps<T> {
    initialValue: T;
    validate: (values: T) => Record<keyof T,string>;
}

function UseForm<T>({initialValue, validate} : UseFormProps<T>) {
    const [values, setValues] = useState(initialValue);
    const [touched, setTouched] = useState<Record<string, boolean>>()
    const [errors, setErrors] = useState<Record<string, string>>()

    const handleChange=(name:keyof T, text:string) => {
        setValues({
            ...values, // 불변성 유지(기존 값 유지)
            [name]: text,
        })
    }

    const handleBlur = (name: keyof T) => {
        setTouched({
            ...touched,
            [name]: true,
        })
    }

    const getInputProps = (name: keyof T) => {
        const value = values[name];
        const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChange(name, e.target.value);
        const onBlur = () => handleBlur(name);

        return  {value, onChange, onBlur}
    }


    // values가 변경될 때 마다 에러 검증 로직 실행
    useEffect(()=>  {
        const newErrors = validate(values)
        setErrors(newErrors); // 오류 메세지 업뎃
    }, [validate, values]);

    return {values, errors, touched, getInputProps};
    
}

export default UseForm;