import React from "react";
import { useCounterStore, type CounterState } from "../stores/CounterStore";
import { useShallow } from "zustand/shallow";
import CounterButton from "./CounterButton";

const Counter = () => {
  // 사용법1
  // const count = useCounterStore((state) => state.count);

  // 사용법2 객체에서 봅아오기 안되냐

  //   const count = useCounterStore((state): CounterState => state);
  //   console.log(count);

  //사용법3_ 구조분해 할당 가져오기
  //   const { count, increment, decrement } = useCounterStore(
  //     (state): CounterState => state
  //   );

  // anti pattern

  //   const { count, increment, decrement } = useCounterStore((state) => ({
  //     count: state.count,
  //     increment: state.increment,
  //     decrement: state.decrement,
  //   }));

  // 그냥 이렇게 써도됨
  // 우리가 random을 뽑아쓰지 않더라도.. 이렇게 같이 묶으면 random컴포넌트에도 영향을 준다.

  // 램덤번호가 바뀌는 것이 count에 영향을 주지않는다.
  const { count } = useCounterStore(
    useShallow((state) => ({
      count: state.count,
    }))
  );

  // 개별구독을 하는게 좋다

  return (
    <div>
      <h1>{count}</h1>
      <CounterButton />
    </div>
  );
};

export default Counter;
