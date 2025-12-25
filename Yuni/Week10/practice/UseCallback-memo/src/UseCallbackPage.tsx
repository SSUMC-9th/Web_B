import { useCallback, useState, type JSX } from 'react';
import CountButton from './components/CountButton';
import TextInput from './components/TextInput';

export default function UseCallbackPage(): JSX.Element {
  const [count, setCount] = useState<number>(0);
  const [text, setText] = useState<string>('');

  //함수값 캐싱으로 동일한 함수 참조 유지
  const handleIncreaseCount = useCallback(
    (number: number): void => {
      setCount(count + number);
      // 빈 배열 : 함수가 처음 한번만 만들어져야 한다. 
      // 함수 내부 count 값은 0으로 기억됨 -> 항상 0+10 (첫 번째 클릭도, 두 번째 클릭도)
    },
    [count]
  );

  const handleText = useCallback(
    (text: string): void => {
    setText(text);
  }, []);

  return (
    <div>
      <h1>같이 배우는 리액트 useCallback편</h1>

      <h2>Count : {count}</h2>
      <CountButton onClick={handleIncreaseCount} />

      <h2>Text</h2>
      <div className="flex flex-col">
        <span>{text}</span>
        <TextInput onChange={handleText} />
      </div>
    </div>
  );
}
