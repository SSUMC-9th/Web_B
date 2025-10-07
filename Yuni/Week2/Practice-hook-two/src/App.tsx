//상태 관리(useState)
// import { useState } from 'react';
// import { useContext } from 'react';
import ButtonGroup from './components/ButtonGroup';
// import {CounterContext} from './context/CounterProvider';
import {useCount} from './context/CounterProvider';

function App() {
  // const [count, setCount] = useState(0); -> useContext
  // const context = useContext(CounterContext); -> 커스텀 훅 
  const {count} = useCount();

  // const handleIncrement = () => {
  //   setCount(count + 1);
  // };

  // const handleDecrement = () => {
  //   setCount(count - 1);
  // };

  return (
    <>
      {/* <h1>{context?.count}</h1>
      <ButtonGroup
        handleIncrement={context.handleIncrement} //초기값 undefined, ?옵셔널 체이닝 처리 필요
        handleDecrement={context.handleDecrement}
      /> */}
      <h1>{count}</h1>
      <ButtonGroup/>
    </>
  );
}

export default App;