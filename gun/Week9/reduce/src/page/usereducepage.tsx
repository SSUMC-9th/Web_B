import { useReducer, useState } from 'react';

interface IState {
    counter: number;
    error: string | null;
}
interface IAction {
    type: 'INCREASE' | 'DECREASE' | 'RESET_TO_ZERO';
    payload?: number;
}

function reducer(state: IState, action: IAction) : IState {
    const {type} = action;

    switch(type) {
        case 'INCREASE': {
            return{
                ...state, //원본값유지
                counter:state.counter +1,
            }   
        }
        case 'DECREASE': {
            return{
                ...state,
                counter:state.counter -1,
            }
        }
        case 'RESET_TO_ZERO': {
            return{
                ...state,
                counter:0,
            }
        }
        default:
            return state;
    }
}


export default function UseReducerPage(){
  const [count, setCount] = useState(0);

  const [state, dispatch] = useReducer(reducer, {
    counter: 0,
    error: null,
  })

  const handleIncrease = (): void => {
    setCount(count + 1);
  }
  console.log(state);
    return (
    <div className='flex flex-col gap-10'>
        <div>
        <h2 className = "text-3xl">useState</h2>
        <h2>useState 훅 사용: {count}</h2>
        <button className='bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700' 
        onClick={handleIncrease}>Increase</button>
        </div>

        <div>
        <h2 className = "text-3xl">useReducer</h2>
        <h2>useReducer 훅 사용: {state.counter}</h2> 
        <button className='bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700' 
        onClick={() => dispatch({
            type: 'INCREASE',
            payload: 3,
        })}>Increase</button> 
        <button className='bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700' 
        onClick={() => dispatch({
            type: 'DECREASE',
        })}>Decrease</button> 
        <button className='bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700' 
        onClick={() => dispatch({
            type: 'RESET_TO_ZERO',
        })}>RESET</button> 
        </div>
    </div>
    );
}