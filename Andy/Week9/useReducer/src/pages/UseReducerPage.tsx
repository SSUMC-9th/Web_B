import { useReducer, useState } from "react";

// 1. state에 대한 type 정의
interface IState {
  counter: number;
}

// 2. reducer에 대한 type 정의
interface IAction {
  type: 'INCREASE' | 'DECREASE' | 'RESET_TO_ZERO';
  payload: number;
}

function reducer(state: IState, action: IAction) {
  const { type, payload } = action;

  switch (type) {
    case 'INCREASE': {
      return {
        ...state,
        counter: state.counter + payload,
      }
    }
    case 'DECREASE': {
      return {
        ...state,
        counter: state.counter - payload,
      }
    }
    case 'RESET_TO_ZERO': {
      return {
        ...state,
        counter: payload,
      }
    }
    default:
      return state;
  }
}

export default function UseReducerPage() {
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState('');

  const [state, dispatch] = useReducer(reducer, {
    counter: 0,
  });
  const [reducerInput, setReducerInput] = useState('');

  const handleIncrease = () => {
    setCount((prev) => prev + 1);
  }

  const handleDecrease = () => {
    setCount((prev) => prev - 1);
  }

  const handleSetValue = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      setCount(value);
      setInputValue('');
    }
  }

  const handleReducerSetValue = () => {
    const value = parseInt(reducerInput);
    if (!isNaN(value)) {
      dispatch({ type: 'RESET_TO_ZERO', payload: value });
      setReducerInput('');
    }
  }

  return (
    <>
      <div className="card">
        <h2>useState</h2>
        <p>count is {count}</p>
        <div>
          <button onClick={handleIncrease}>Increase</button>
          <button onClick={handleDecrease}>Decrease</button>
        </div>
        <div>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
          />
          <button onClick={handleSetValue}>Set Value</button>
        </div>
      </div>

      <div className="card">
        <h2>useReducer</h2>
        <p>count is {state.counter}</p>
        <div>
          <button onClick={() => dispatch({ type: 'INCREASE', payload: 1 })}>
            Increase
          </button>
          <button onClick={() => dispatch({ type: 'DECREASE', payload: 1 })}>
            Decrease
          </button>
          <button onClick={() => dispatch({ type: 'RESET_TO_ZERO', payload: 0 })}>
            Reset to Zero
          </button>
        </div>
        <div>
          <input
            type="number"
            value={reducerInput}
            onChange={(e) => setReducerInput(e.target.value)}
            placeholder="Enter value"
          />
          <button onClick={handleReducerSetValue}>Set Value</button>
        </div>
      </div>
    </>
  );
}