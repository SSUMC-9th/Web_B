import { useContext, useState, type FormEvent } from "react";
import type { TTodo } from "../types/todo";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import { TodoContext, useTodo } from "../context/TodoContext";

const Todo=():void=>{

    // 3개의 상태를 정의할거임
    // const [todos, setTodos]=useState<TTodo[]>([]);
    // const [doneTodos, setDoneTodos]=useState<TTodo[]>([]);
    
    const {todos, completeTodo, deleteTodo, doneTodos}=useTodo();
    
    
    
    


    // const completeTodo=(todo: TTodo) : void =>{
    //     setTodos((prevTodos): TTodo[] => prevTodos.filter((t): boolean =>t.id!==todo.id))
    //     setDoneTodos((prevDoneTodos): TTodo[] => [...prevDoneTodos, todo]);
    // }

    // const deleteTodo=(todo: TTodo): void =>{
    //     setDoneTodos((prevDoneTodo): TTodo[] =>
    //     prevDoneTodo.filter((t):Boolean=>t.id!==todo.id))
    // }

    return (
        <div className='todo-container'>
            <h1 className='todo-container__header'>Logan's todo</h1>
            <TodoForm />
            <div className='render-container'>
                <TodoList 
                title="할 일" 
                todos={todos} 
                buttonLabel='완료'
                buttonColor='#28a745'
                onClick={completeTodo}
                />
                <TodoList 
                title="완료" 
                todos={doneTodos} 
                buttonLabel="삭제" 
                buttonColor='#dc3545'
                onClick={deleteTodo}
                />
            </div>
        </div>
    )
};


export default Todo;

export const A=() =>{
        const context=useContext(TodoContext);


    return <div>{context.todos}</div>
}