import React, { useReducer, useState } from "react";

// 1. state에 대한 interface
interface IState {
  counter: number;
  error: string | null;
}

// 2. reducer에 대한 interface
interface IACtion {
  type: "INCREASE" | "DECREASE" | "RESET_TO_ZERO";
  payload?: number;
}

// 3. reducer function 만들기

function reducer(state: IState, action: IACtion): IState {
  const { type, payload } = action;
  console.log(state);
  console.log(action);

  switch (type) {
    case "INCREASE": {
      return {
        // 원본배열을 유지해줘야한다. error에 대한 거 살려놓기
        ...state,
        counter: state.counter + payload,
      };
    }

    case "DECREASE": {
      return {
        ...state,
        counter: state.counter - payload,
      };
    }

    case "RESET_TO_ZERO": {
      return {
        ...state,
        // counter: (state.counter = 0),/ 원본state를 건드리지 마라을 아예 지정해야함
        counter: 0,
      };
    }

    default:
      return state;
  }
}

export default function UseReducerPage() {
  const [count, setCount] = useState(0);

  const handleIncrease = () => {
    setCount(count + 1);
  };

  const [state, dispatch] = useReducer(reducer, {
    counter: 0,
    error: null,
  });

  return (
    <div className="flex flex-col gap=10">
      <div>
        <h2 className="text-3xl">useState</h2>
        <h2>useState훅 사용 : {count}</h2>
        <button onClick={handleIncrease}>Increase</button>
      </div>
      <div>
        <h2 className="text-3xl">useReducer</h2>
        <h2>useReducer훅 사용 : {state.counter}</h2>
        {/* dispatch를 이용해서 증가해주는 동작을 할건데 dispatch( {중괄호~}) */}
        <button
          onClick={() =>
            dispatch({
              type: "INCREASE",
              payload: 3,
            })
          }
        >
          Increase
        </button>
        <button
          onClick={() =>
            dispatch({
              type: "DECREASE",
              payload: 5,
            })
          }
        >
          Decrease
        </button>

        <button
          onClick={() =>
            dispatch({
              type: "RESET_TO_ZERO",
            })
          }
        >
          RESET_TO_ZERO
        </button>
      </div>
    </div>
  );
}
