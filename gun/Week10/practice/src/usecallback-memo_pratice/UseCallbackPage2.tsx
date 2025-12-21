import { useCallback, useState } from "react";
import CountButton from "./components/CountButton";
import TextInput from "./components/TextInput";

export default function UseCallbackPage2() {
  const [count, setCount] = useState<number>(0);
  const [text, setText] = useState<string>('');

  const handleIncreaseCount = useCallback((number: number) => {
    setCount(count + number);
  }, [count]);

  const handleText = useCallback((text: string) => {
    setText(text)
  }, [text]);

  return (
    <>
      <div>
        <h1>리엑트 callback</h1>
        <h2>Count : {count}</h2>
        <CountButton onClick={handleIncreaseCount}/>
        <h2>Text</h2>
        <div className='flex flex-col'>
            <span>{text}</span>
            <div></div>
            <TextInput onChange={handleText}/>
        </div>
      </div>
    </>
  );
}