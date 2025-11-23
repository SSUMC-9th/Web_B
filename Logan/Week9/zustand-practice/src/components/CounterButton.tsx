import { useCounterActions } from "../stores/CounterStore";

export default function CounterButton() {
  // 가독성 굿
  const { increment, decrement } = useCounterActions();

  return (
    <>
      <button onClick={increment}>증가</button>
      <button onClick={decrement}>감소</button>
    </>
  );
}
