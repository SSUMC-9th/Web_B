import { useCounterStore } from "../stores/counterStore.ts";
import { useShallow } from "zustand/react/shallow";
import CounterButton from "./CounterButton.tsx";

export default function Counter() {
  // 리랜더링 테스트를 위해 상태 전체를 선택
  // const { count, increment, decrement } = useCounterStore(
  //   (state) => state
  // );

  const { count } = useCounterStore(
    useShallow((state) => ({
      count: state.count,
      increment: state.actions.increment,
      decrement: state.actions.decrement,
    }))
  );

  return (
    <>
      <h1>Counter: {count}</h1>
      <CounterButton />
    </>
  )
}