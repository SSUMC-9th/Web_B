import { useCallback, useState } from "react";
import CountButton from "./components/CountButton";
import TextInput from "./components/TextInput";

export default function UseCallbackPage() {
  const [count, setCount] = useState<number>(0);
  const [text, setText] = useState<string>("");

  // useCallback을 씌우면 동일한 객체로 간주해서 리렌더링 방지가능
  const handleIncreaseCount = useCallback(
    (number: number): void => {
      setCount(count + number);
      // 빈 배열은 이 함수가 처음 한번만 만들어져야한다.
      // 함수 내부에서 count 값은 0으로 기억하고 있다.
      // 두번째 클릭을 해도 0+10이 되어서 count가 변하지 않는다.
      // 첫번째 클릭 0+10
      // 두번째 클릭 0+10
    },
    [count] // count가 변할때마다 계산되니까 -> count바뀔때마다 새함수로 교체
  );

  const handleText = useCallback((text: string): void => {
    setText(text);
  }, []);

  return (
    <div>
      <h1>같이 배우는 리액트 useCallback임;</h1>
      <h2>Count: {count}</h2>
      <CountButton onClick={handleIncreaseCount} />

      <h2>Text</h2>
      <div className="flex flex-col">
        <span>{text}</span>
        <TextInput onChange={handleText} />
      </div>
    </div>
  );
}
