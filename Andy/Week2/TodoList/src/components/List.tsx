import type { TodoItem } from "../types/todo";

interface ListProps {
  todos: TodoItem[]
  onToggleTodo: (id: number) => void
  onDeleteTodo: (id: number) => void
}

const List = ({ todos, onToggleTodo, onDeleteTodo }: ListProps) => {
  const pendingTodos = todos.filter(todo => !todo.done)
  const completedTodos = todos.filter(todo => todo.done)
  return (
    <div className="render-container">
      <div className="render-container__section">
        <h2 className="render-container__title">할 일</h2>
        <ul id="todo-list" className="render-container__list">
          {pendingTodos.map((item: TodoItem) => (
            <li key={item.id} className="render-container__item">
              <span className="render-container__item-text">{item.text}</span>
              <button style={
                { backgroundColor: '#4CAF50' }
              } className="render-container__item-button" onClick={() => onToggleTodo(item.id)}>완료</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="render-container__section">
        <h2 className="render-container__title">완료</h2>
        <ul id="done-list" className="render-container__list">
          {completedTodos.map((item: TodoItem) => (
            <li key={item.id} className="render-container__item">
              <span className="render-container__item-text">{item.text}</span>
              <button style={
                { backgroundColor: '#f44336' }
              } className="render-container__item-button" onClick={() => onDeleteTodo(item.id)}>삭제</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default List;