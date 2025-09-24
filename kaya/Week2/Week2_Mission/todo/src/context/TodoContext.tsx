import type { TTodo } from '../types/todo'
import { createContext, useState, useContext } from 'react';
import type { PropsWithChildren, ReactNode } from 'react';

interface ITodoContext {
    todos: TTodo[];
    doneTasks: TTodo[];
    addTodo: (text: string) => void;
    completeTask: (task: TTodo) => void;
    deleteTask: (task: TTodo) => void;
}

export const TodoContext = createContext<ITodoContext | undefined>
(undefined);

export const TodoProvider = ({ children }:
PropsWithChildren) => {
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTasks, setDoneTasks] = useState<TTodo[]>([]);

    const addTodo = (text: string): void => {
        const newTask: TTodo = { id: Date.now(), text: text };
        setTodos((prev) => [...prev, newTask]);
    }

    const completeTask = (task: TTodo): void => {
        setTodos((prevTodos): TTodo[] => prevTodos.filter((t): boolean => t.id != task.id));
        setDoneTasks((prevDoneTodos) => [...prevDoneTodos, task]);
    }

    const deleteTask = (task: TTodo): void => {
        setDoneTasks((prevDoneTodo):TTodo[] => prevDoneTodo.filter((t): boolean => t.id != task.id));
    }

    return (
        <TodoContext.Provider
            value={{ todos, doneTasks, addTodo, completeTask, deleteTask}}
        >
            {children}
        </TodoContext.Provider>
    )
}

export const useTodo = (): ITodoContext => {
    const context = useContext(TodoContext);

    // 컨텍스트가 없는 경우
    if (!context) {
        throw new Error(
            'useTodo를 사용하기 위해서는, 무조건 TodoProvider로 감싸야 합니다.'
        );
    }
    // 컨텍스트가 있는 경우
    return context;
}