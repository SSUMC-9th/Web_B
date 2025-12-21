import { useReducer, useState, type ChangeEvent } from "react";

interface IState {
    department: string;
    error: string | null;
}

interface IAction {
  type: 'CHANGE_DEPARTMENT' | 'RESET';
  payload?: string; 
}

function reducer(state: IState, action: IAction){
  const { type, payload } = action;
  
  switch (type) {
    case 'CHANGE_DEPARTMENT': {
      const newDepartment = payload;
      const hasError = newDepartment !== '카드 메이커'; 
        return {
        ...state,
        department: hasError ? state.department : newDepartment,
        error: hasError ? '거부권 행사가능, 카드 메이커' : null
      };
    }
    default:
      return state;
  }
}

export function UseReducerCompany(){
    const [state, dispatch] = useReducer(reducer, {
        department: 'Software Developer',
        error: null,
    });
    
    const [error, setError] = useState<string | null>(null);
    const [department, setDepartment] = useState('');
    const handleChangeDepartment = (e: ChangeEvent<HTMLInputElement>) : void => {
      setDepartment(e.target.value);
    }

    return (
          <div className="max-w-md p-6 border rounded-lg shadow-sm space-y-4">
    {/* 현재 직무 */}
    <h1 className="text-2xl font-semibold text-gray-800">
      현재 직무: {state.department}
    </h1>

    {/* 에러 메시지 */}
    {state.error && (
      <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
        {state.error}
      </p>
    )}

    {/* 입력 영역 */}
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-600">
        변경할 직무
      </label>
      <input
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="변경하시고 싶은 직무를 입력하세요 (카드메이커만 허용)"
        value={department}
        onChange={handleChangeDepartment}
      />
    </div>

    {/* 버튼 */}
    <button
      onClick={() =>
        dispatch({ type: 'CHANGE_DEPARTMENT', payload: department })
      }
      className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition"
    >
      직무 변경하기
    </button>
  </div>
    );
}