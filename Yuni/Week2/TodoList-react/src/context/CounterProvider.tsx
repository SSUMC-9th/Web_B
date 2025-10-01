import { createContext, useContext, useState } from 'react';
import type {ReactNode} from 'react';
import type { Todo } from '../types/todo';
import type { FormEvent } from 'react'; //타입 전용 import, verbaatimModuleSyntax에러 해결

//Context의 타입 정의
interface CounterContextType {
    input : string
    setInput: React.Dispatch<React.SetStateAction<string>>; // React.Dispatch<React.SetStateAction<string>>타입 
    todos : Todo[],
    completedTasks : Todo[], 
    handleCompleted : (todo : Todo) => void, 
    handleDelete : (todo : Todo) => void
    handleSubmmit : (e : FormEvent<HTMLFormElement>) => void
}

//Context 생성 
export const CounterContext = createContext<CounterContextType | undefined>(
    undefined
);

//Context Provider 생성 
export const CounterProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>(''); //String 안됨 

  const handleCompleted = (todo : Todo) => {
    setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
    setCompletedTasks((prevCompletedTask) => [...prevCompletedTask, todo]);
  };
  const handleDelete = (completedTask : Todo) => {
    setCompletedTasks((prevCompletedTask) => prevCompletedTask.filter((t) => t.id !== completedTask.id));
  };
  const handleSubmmit = (e : FormEvent<HTMLFormElement>):void => {
    e.preventDefault();
    const text = input.trim();
    if (text) {
      const newTodo = {id: Date.now(), text}; //프로퍼티와 변수명 같음, 축약형
      setTodos((prevTodos)=> [...prevTodos, newTodo]); //기존 todos배열을 가져온 뒤, 뒤에 newTodo 추가 
    }
    setInput('');
    console.log(e); 
    // SyntheticBaseEvent {_reactName: 'onSubmit', _targetInst: null, type: 'submit', nativeEvent: SubmitEvent, target: form.todo__form, …}
  };

  return (
    <CounterContext.Provider
      value={{ input, setInput, todos, completedTasks, handleCompleted, handleDelete, handleSubmmit }}
    >
      {children}
    </CounterContext.Provider>
  );
};

// CounterProvider.tsx 맨 아래 추가
export const useList = () => {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error(
      'useList는 반드시 CountProvider 내부에서 사용되어야 합니다.'
    );
  }
  return context;
};