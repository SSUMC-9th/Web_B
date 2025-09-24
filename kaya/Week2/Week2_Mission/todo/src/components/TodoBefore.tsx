import { useState } from 'react';
import type { FormEvent } from 'react';
import type { TTodo } from '../types/todo';

const TodoBefore = () => {
    const [text, setText] = useState("");
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTasks, setDoneTasks] = useState<TTodo[]>([]);
    
    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const trimmed = text.trim();
        if (trimmed) {
            const newTask: TTodo = { id: Date.now(), text: trimmed };
            setTodos((prev) => [...prev, newTask]);
            setText("");
        }
    }

    const completeTask = (task: TTodo): void => {
        setTodos((prevTodos): TTodo[] => prevTodos.filter((t): boolean => t.id != task.id));
        setDoneTasks((prevDoneTodos) => [...prevDoneTodos, task]);
    }

    const deleteTask = (task: TTodo): void => {
        setDoneTasks((prevDoneTodo):TTodo[] => prevDoneTodo.filter((t): boolean => t.id != task.id));
    }

    return (
        <div className="todo-container">
            <h1 className="todo-container__header">YONG TODO</h1>
            <form onSubmit={handleSubmit} className="todo-container__form">
                <input 
                    type="text"
                    className="todo-container__input"
                    placeholder="할 일 입력"
                    value={text}
                    onChange={(e): void => setText(e.target.value)}
                    required
                />
                <button type="submit" className="todo-container__button">
                    할 일 추가
                </button>
            </form>
        <div className="render-container">
            <div className="render-container__section">
                <h2 className="render-container__title">할 일</h2>
                <ul className="render-container__list">
                    {todos.map((task): any => (
                        <li key={task.id} className="render-container__item">
                            {task.text}
                            <button 
                                className="render-container__item-button"
                                style={{backgroundColor: "#28a745"}}
                                onClick={() => completeTask(task)}
                            >
                                완료
                            </button>
                        </li> 
                    ))}
                </ul>
            </div>
            <div className="render-container__section">
                <h2 className="render-container__title">완료</h2>
                <ul className="render-container__list">
                    {doneTasks.map((task) => (
                        <li key={task.id} className="render-container__item">
                            {task.text}
                            <button 
                                className="render-container__item-button"
                                style={{backgroundColor: "#dc3545"}}
                                onClick={(): void => deleteTask(task)}
                            >
                                삭제
                            </button>                            
                        </li> 
                    ))}
                </ul>
            </div>
            </div>
        </div>
    );
};

export default TodoBefore;