import React from "react";
import { useCounterStore } from "../stores/CounterStore";
import { useShallow } from "zustand/shallow";

export default function RandomNumberGenerator() {
  // 방법1 . useShallow사용
  //   const { randomNumber, random } = useCounterStore(
  //     useShallow((state) => ({
  //       randomNumber: state.randomNumber,
  //       random: state.random,
  //     }))
  //   );

  // 방법2. 개별구독

  const randomNumber = useCounterStore((state) => state.randomNumber);
  const random = useCounterStore((state) => state.actions.random);
  return (
    <div>
      <h1>{randomNumber}</h1>
      <button onClick={random}>램덤 번호 생성기</button>
    </div>
  );
}
