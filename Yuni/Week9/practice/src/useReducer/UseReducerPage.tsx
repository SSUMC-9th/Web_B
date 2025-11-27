import { useReducer, useState, type ReactElement } from 'react';

interface IState {
  counter: number;
}

type IAction =
  | { type: 'INCREASE'; payload: number }
  | { type: 'DECREASE' }
  | { type: 'RESET_TO_ZERO' };

function reducer(state: IState, action: IAction): IState {
  switch (action.type) {
    case 'INCREASE': {
      return {
        ...state,
        counter: state.counter + action.payload,
      };
    }
    case 'DECREASE': {
      return {
        ...state,
        counter: state.counter - 1,
      };
    }
    case 'RESET_TO_ZERO': {
      return {
        ...state,
        counter: 0,
      };
    }

    default:
      return state;
  }
}


export default function UseReducerPage(): ReactElement {
  //1. useState를 이용한 카운터 구현
  const [count, setCount] = useState(0);
  //2. useReducer를 이용한 카운터 구현
  const [state, dispatch] = useReducer(reducer, {
    counter : 0,
  })
  const handleIncrease = (): void => {
    setCount(count + 1);
  };

return (
  <div className='flex flex-col gap-10'>
    <div>
      <h2 className='text-3xl'>useState</h2>
      <h2>useState 훅 사용: {count}</h2>
      <button onClick={handleIncrease}>Increase</button>
    </div>

    <div>
      <h2 className='text-3xl'>useReducer</h2>
      <h2>useReducer 훅 사용: {state.counter}</h2>
      <button onClick={()=>dispatch(
        {
            type: 'INCREASE',
            payload: 3,
        }
      )}>Increase</button>
      <button onClick={()=>dispatch(
        {type: 'DECREASE'}
      )}>Decrease</button>
      <button onClick={()=>dispatch(
        {type: 'RESET_TO_ZERO'}
      )}>Reset to Zero</button>
    </div>
  </div>
);

}
