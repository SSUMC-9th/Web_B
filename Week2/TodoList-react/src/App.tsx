import './App.css'
import { useState } from 'react';
import type { FormEvent } from 'react'; //타입 전용 import, verbaatimModuleSyntax에러 해결
import InputForm from './components/inputForm'
import type { Todo } from './types/todo'
import ListGroup from './components/ListGroup';

function App() {

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
        <ListGroup
          todos = {todos}
          completedTasks={completedTasks}
          handleCompleted={handleCompleted}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  )
}

export default App