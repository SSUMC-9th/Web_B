import { useState, useReducer, type ReactElement } from 'react';

interface IState {
  department: string;
  error: string | null;
}

interface IAction {
  type: 'CHANGE_DEPARTMENT' | 'RESET';
  payload?: string;
}

function reducer(state: IState, action: IAction): IState {
  const { type, payload } = action;   // 'payload' is assigne...

  switch (type) {
    case 'CHANGE_DEPARTMENT': {
        const newDepartment = payload ? payload.trim().toLowerCase() : '';
        const hasError = newDepartment !== '카드메이커';
        return {
            ...state,
            department: hasError ? state.department : (payload || state.department),
            error: hasError ? 'Only 카드메이커 is allowed' : null,
        };
    }
    default:
      return state;
  }
}

export default function UseReducerCompany(): ReactElement {
  const [state, dispatch] = useReducer(reducer, {   // 'state...
    department: 'Software Development',
    error: null,
  });

  const [department, setDepartment] =  useState('');

  const handleChangeDepartment = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDepartment(e.target.value);
  };

  return (
    <div className='flex flex-col gap-4 p-6'>
      <h1 className='text-3xl font-bold'>{state.department}</h1>
      {state.error && <p className='text-red-500 font-2xl'>{state.error}</p>}
      <input
        className='w-[600px] border mt-10 p-4 rounded-md'
        placeholder='변경하시고 싶은 직무를 입력해주세요. 단 거부권 행사 가능'
        value={department}
        onChange={handleChangeDepartment}
      />
      <button
        className='w-[600px] bg-blue-500 text-white p-2 rounded-md font-semibold hover:bg-blue-600'
        onClick={() => dispatch({ type: 'CHANGE_DEPARTMENT', payload: department })}
      >
        직무 변경하기
      </button>
    </div>
  );
}   