import { useState } from 'react'
import './App.css'
import List from './components/List'
import Input from './components/Input'
import type { TodoItem } from './types/todo'

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([/* 초기값은 빈 배열 */])

  const addTodo = (text: string) => {
    const newTodo: TodoItem = {
      id: Date.now(),
      text,
      done: false
    }
    setTodos([...todos, newTodo])
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <>
      <div className="todo-container">
        <h1 className="todo-container__header">할 일 목록</h1>
        <Input onAddTodo={addTodo} />
        <List todos={todos} onToggleTodo={toggleTodo} onDeleteTodo={deleteTodo} />
      </div>
    </>
  )
}

export default App
