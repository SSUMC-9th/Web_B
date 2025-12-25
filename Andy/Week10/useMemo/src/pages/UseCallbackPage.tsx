import {useCallback, useState} from 'react';
import TextInput from "../components/TextInput.tsx";
import CountButton from "../components/CountButton.tsx";

// function heavyComputation() {
//   let result = 0;
//   for (let i = 0; i < 100000000; i++) {
//     result += i;
//   }
//
//   return result;
// }

// export default function UseCallbackPage() {
//   const [count, setCount] = useState(heavyComputation);
//
//   const handleIncrease = () => {
//     console.log('Increase button clicked');
//     setCount((prevCount) => prevCount + 1);
//   };
//
//   return (
//     <div>
//       <h1>Use Callback Page</h1>
//       <p>Count: {count}</p>
//       <button onClick={handleIncrease}>증가</button>
//     </div>
//   );
// }

export default function UseCallbackPage() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  const handleIncreaseCount = useCallback((number: number) => {
    setCount(prev => prev + number);
  }, []);

  const handleChangeText = useCallback((inputText: string) => {
    setText(inputText);
  }, []);

  return (
    <div>
      <h1>Use Callback Page</h1>
      <p>Count: {count}</p>
      <p>Text: {text}</p>
      <CountButton onClick={handleIncreaseCount} />
      <TextInput onChange={handleChangeText} />
    </div>
  );
}