import { useCounterActions } from "../hooks/useCounterActions.ts";

export default function CounterButton() {
  const { increment, decrement } = useCounterActions();

  return (
    <>
      <button onClick={decrement}>감소</button>
      <button onClick={increment}>증가</button>
    </>
  );
}
