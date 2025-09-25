import { createContext } from 'react'
import type { TodoItem } from '../types/todo'

export interface TodoContextType {
  todos: TodoItem[]
  addTodo: (text: string) => void
  toggleTodo: (id: number) => void
  deleteTodo: (id: number) => void
}

export const TodoContext = createContext<TodoContextType | undefined>(undefined)