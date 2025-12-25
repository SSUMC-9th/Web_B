import { memo } from 'react';

interface TextInputProps {
  onChange: (text: string) => void;
}

const TextInput = ({ onChange }: TextInputProps) => {
  console.log('TextInput 렌더링됨');

  return (
    <input
      type="text"
      onChange={(e) => onChange(e.target.value)}
      placeholder="텍스트를 입력하세요"
    />
  );
}

export default memo(TextInput);