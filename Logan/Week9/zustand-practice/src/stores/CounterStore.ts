// 보일러 플레이트?가 간단하다.

import { create } from "zustand";
import { devtools } from "zustand/middleware";

// 상태에대한 정의

interface CounterActions {
  increment: () => void;
  decrement: () => void;
  random: () => void;
}

export interface CounterState {
  // value
  count: number;
  // randomNumber
  randomNumber: number;

  // action
  actions: CounterActions;
}

// 소괄호 중괄호  ( { })로 하면, return 안붙여도 됨
// zustand의 set을 활용하기
export const useCounterStore = create<CounterState>()(
  devtools( (set) => ({
    count: 0,
    randomNumber: 0,

    actions: {
      increment: (): void =>
        // set( partialOrUpdater, shouldReplace= false, actionName)
        set(
          (state) => ({
            count: state.count + 1,
          }),
          false, // false나 undefined로 설정
          "increment"
        ),

      decrement: (): void => {
        return set(
          (state) => ({
            count: state.count - 1,
          }),
          false,
          "decrement"
        );
      },

      // 0~99 램덤숫자만들기
      random: () => {
        set(
          () => ({
            randomNumber: Math.floor(Math.random() * 100),
          }),
          false,
          "random"
        );
      },
    },
  }))
);

// action에 관한 훅을 하나 만들 수 있다.
export const useCounterActions = (): CounterActions =>
  useCounterStore((state): CounterActions => state.actions);

// Atomic Selectior-> 모든 값은 개별로 꺼내야한다는 규칙

// actions의 객체는 한번 정의했기땜ㄴ에, 함수의 참조가 바뀌지않는다.
// 컴포넌트가 항상 동일한 객체를 바라보기 때문에 렌더링에 문제가없음

// immer 미들웨어도 써봐;
