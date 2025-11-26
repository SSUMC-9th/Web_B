import {
  type ChangeEvent,
  useReducer,
  useState
} from "react";

interface IState {
  department: string;
  error: string | null;
}

interface IAction {
  type: 'CHANGE_DEPARTMENT' | 'RESET';
  payload?: string;
}

function reducer(state: IState, action: IAction) {
  const { type, payload } = action;

  switch (type) {
    case 'CHANGE_DEPARTMENT': {
      const newDepartment = payload || '';
      const hasError = newDepartment === 'Developer';
      return {
        ...state,
        department: hasError ? state.department : newDepartment,
        error: hasError ? '개발자는 싫습니다!' : null,
      }
    }
    default:
      return state;
  }
}

export default function UseReducerCompany() {
  const [state, dispatch] = useReducer(reducer, {
    department: 'Student',
    error: null,
  });

  const [department, setDepartment] = useState('');

  const handleChangeDepartment = (e: ChangeEvent<HTMLInputElement>) => {
    setDepartment(e.target.value);
  };

  return (
    <div>
      <h1>{state.department}</h1>
      {state.error && <p className="text-red-500 font-2-xl">{state.error}</p>}

      <p>변경하고 싶은 직무를 입력해주세요</p>

      <input
        placeholder={"직무를 입력해주세요."}
        value={department}
        onChange={handleChangeDepartment}
      />
      <button
        onClick={() =>
          dispatch({ type: 'CHANGE_DEPARTMENT', payload: department })
        }
      >
        직무 변경하기
      </button>
      <button onClick={() => dispatch({ type: 'RESET' })}>초기화</button>
    </div>
  );
}