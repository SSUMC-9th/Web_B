import { useCounterStore } from "../stores/counterStore.ts";
import { useShallow } from "zustand/react/shallow";

export default function RandomNumberGenerator() {
  // const { randomNumber, random } = useCounterStore(
  //   (state) => state
  // );

  const { randomNumber, random } = useCounterStore(
    useShallow((state) => ({
      randomNumber: state.randomNumber,
      random: state.actions.random,
    }))
  )

  return (
    <>
      <h1>Random Number: {randomNumber}</h1>
      <button onClick={random}>랜덤 숫자 생성</button>
    </>
  )
}