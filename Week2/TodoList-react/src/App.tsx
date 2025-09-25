import './App.css'
import { useState } from 'react';
import type { FormEvent } from 'react'; //타입 전용 import, verbaatimModuleSyntax에러 해결
import InputForm from './components/inputForm'

function App() {

  interface Todo {
    text: string;
    id: number;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>(''); //String 안됨 

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

  //todos에서 완료된 요소를 지워야 함
  const handleCompleted = (todo : Todo) => {
    setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
    setCompletedTasks((prevCompletedTask) => [...prevCompletedTask, todo]);
  };

  //completedTask에서 삭제된 요소를 지워야 함
  const handleDelete = (completedTask : Todo) => {
    setCompletedTasks((prevCompletedTask) => prevCompletedTask.filter((t) => t.id !== completedTask.id));
  };

  return (
    <div className="App">
      <div className="todo">
        <h1 className="todo__title">YONG TODO</h1>
        {/*입력창*/}
        <InputForm 
          handleSubmmit={handleSubmmit}
          input={input}
          setInput={setInput}
        />
        {/*할일목록*/}
        <div className="task-lists">
          <div className="task-list">
            <h2 className="task-list__title">할 일</h2>
            <ul className="task-list__items">
              {/* <li className="task-list__item">
                <span></span>
                <button className="task-list__button">완료</button>
              </li> */}
              {todos.map((todo) => (
                <li className="task-list__item">
                  <span>{todo.text}</span>
                  <button 
                    // onClick = {handleCompleted(todo)} 렌더링 시점에 함수 실행 
                    onClick = {() => handleCompleted(todo)} //클릭 시점에 실행 
                    className="task-list__button">
                    완료
                  </button>
                </li>
              ))} 
            </ul>
          </div>
        {/*완료목록*/}
          <div className="task-list">
            <h2 className="task-list__title">완료</h2>
            <ul className="task-list__items">
              {/* <li className="task-list__item">
                <span></span>
                <button className="task-list__button--delete">삭제</button>
              </li> */}
              {completedTasks.map((completedTask) => (
                <li className="task-list__item">
                  <span>{completedTask.text}</span>
                  <button 
                    onClick = {() => handleDelete(completedTask)}
                    className="task-list__button--delete">
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App