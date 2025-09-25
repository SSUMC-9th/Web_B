import { useState } from 'react';

function App() {
  const [count, setCount] = useState<number>(0);
  // function increase() {
  //   setCount(count + 1);
  // }
  const increase = () => {
    setCount(count + 1);
  }
  
  // function decrease() {
  //   setCount(count - 1);
  // }
  const decrease = () => {
    setCount(count - 1);
  }
  return (
    <>
      <h1>{count}</h1>
      <button onClick={increase}>숫자 증가</button>
      <button onClick={decrease}>숫자 감소</button>
    </>
  );
}

export default App;