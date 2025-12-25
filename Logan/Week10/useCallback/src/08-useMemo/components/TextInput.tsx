import { memo } from "react";

interface ITextInput {
  onChange: (text: string) => void;
}

const TextInput = ({ onChange }: ITextInput) => {
  console.log("텍스트인풋 렌더됨");

  return (
    <input
      type="text"
      className="border p-4 rounded-lg"
      onChange={(e): void => onChange(e.target.value)} // input창에 있는 값 받기
    />
  );
};
export default TextInput; // 컴포넌트를 캐시한다.
