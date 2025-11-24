import React, { useReducer, useState, type ChangeEvent } from "react";

interface IState {
  department: string;
  error: string | null;
}

interface IAction {
  type: "CHANGE_DEPARTMENT" | "RESET";
  payload?: string;
}

function reducer(state: IState, action: IAction) {
  const { type, payload } = action;

  switch (type) {
    case "CHANGE_DEPARTMENT": {
      const newDepartment = payload;
      const hasError = newDepartment !== "카드메이커";
      return {
        ...state,
        department: hasError ? state.department : newDepartment,
        error: hasError
          ? "거부권 행사가능, 카드메이커만 입력가능합니다."
          : null,
      };
    }

    case "RESET": {
      console.log("리셋누름");
      return {
        ...state,
        department: state.department, //유지
        error: null,
      };
    }
    default:
      return state;
  }
}
export default function UseReducerCompany() {
  const [state, dispatch] = useReducer(reducer, {
    department: "Software Developer",
    error: null,
  });

  //const [error, setError]=useState<string|null>(null);
  //   const changeDepartment = (): void => {
  //     if (department !== "카드메이커") {
  //       setError("거부권행사가능");
  //     } else {
  //       setDepartment(department);
  //       setError(null);
  //     }
  //   };
  const [department, setDepartment] = useState("");

  const handleChangeDepartment = (e: ChangeEvent<HTMLInputElement>): void => {
    setDepartment(e.target.value);
  };
  return (
    <div>
      <h1>{state.department}</h1>
      {/* error가 true일때 동작 */}
      {state.error && <p className="text-red-500 font-2xl">{state.error}</p>}

      <input
        className="w=[600px] border mt-10 p-4 rounded-md"
        placeholder="변경하고 싶은 직무 입력해줘. 단 거부권 행사가능"
        value={department}
        onChange={handleChangeDepartment}
      />

      <button
        onClick={(): void =>
          // 버튼에다가 dispatch를 단다.
          // 사용자가 입력한 값(department)이 reducer에 전달된다.
          dispatch({ type: "CHANGE_DEPARTMENT", payload: department })
        }
      >
        직무변경하기
      </button>

      <button
        onClick={(): void => {
          // 버튼에다가 dispatch를 단다.
          // 사용자가 입력한 값(department)이 reducer에 전달된다.
          dispatch({ type: "RESET", payload: department });
          setDepartment("");
        }}
      >
        리셋
      </button>
    </div>
  );
}
