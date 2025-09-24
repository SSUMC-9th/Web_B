import './App.css'
import { useState } from 'react';

function App() {
  interface Task {
    text: string;
    id: number;
  }
  const [todos, setTodos] = useState<Task[]>([]);
  const [dones, setDones] = useState<Task[]>([]);
  const [input, setInput] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() === '') return;
    const newTask: Task = {
      text: input,
      id: Date.now(),
    };
    setTodos([...todos, newTask]);
    setInput('');
  };

  const handleComplete = (id: number) => {
    const taskToComplete = todos.find((task) => task.id === id);
    if (taskToComplete) {
      setTodos(todos.filter((task) => task.id !== id));
      setDones([...dones, taskToComplete]);
    }
  };

  const handleDelete = (id: number) => {
    setDones(dones.filter((task) => task.id !== id));
  };    
  
  return (
    <div className="App">
      <div className="todo">
        <h1 className="todo__title">YONG TODO</h1>
        <form className="todo__form" onSubmit={handleSubmit}>
          <input
            className="todo__input"
            type="text"
            placeholder="할 일 입력"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="todo__button">할 일 추가</button>
    </form>
        <div className="task-lists">
          <div className="task-list task-list--todo">
            <h2 className="task-list__title">할 일</h2>
        <ul className="task-list__items">
          {todos.map((task) => (
            <li key={task.id} className="task-list__item">
              <span>{task.text}</span>
              <button onClick={() => handleComplete(task.id)}>완료</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="task-list task-list--done">
        <h2 className="task-list__title">완료</h2>
        <ul className="task-list__items">
          {dones.map((task) => (
            <li key={task.id} className="task-list__item">
              <span>{task.text}</span>
              <button onClick={() => handleDelete(task.id)}>삭제</button>
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