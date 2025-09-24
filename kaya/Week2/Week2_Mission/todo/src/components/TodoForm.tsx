import { useState } from "react";
import type { FormEvent } from "react";
import { useTodo } from '../context/TodoContext'

const TodoForm = () => {
    const [text, setText] = useState("");
    const {addTodo} = useTodo();

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const trimmed = text.trim();
        if (trimmed) {
            addTodo(trimmed);
            setText("");
        }
    }  

    return(
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
    )
};

export default TodoForm;