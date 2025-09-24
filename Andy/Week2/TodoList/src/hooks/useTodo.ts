import { useContext } from 'react'
import { TodoContext } from '../contexts/todoContext'

export const useTodoContext = () => {
  const context = useContext(TodoContext)
  if (context === undefined) {
    throw new Error('useTodoContext는 TodoProvider 안에서만 사용될 수 있습니다.')
  }
  return context
}