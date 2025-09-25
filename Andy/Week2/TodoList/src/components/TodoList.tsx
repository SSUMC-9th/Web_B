import type { TodoItem } from "../types/todo";

interface TodoListProps {
  title: string
  todos: TodoItem[]
  buttonText: string
  buttonColor: string
  onButtonClick: (id: number) => void
  listId?: string
}

const TodoList = ({
  title,
  todos,
  buttonText,
  buttonColor,
  onButtonClick,
  listId
}: TodoListProps) => {
  return (
    <div className="render-container__section">
      <h2 className="render-container__title">{title}</h2>
      <ul id={listId} className="render-container__list">
        {todos.map((item: TodoItem) => (
          <li key={item.id} className="render-container__item">
            <span className="render-container__item-text">{item.text}</span>
            <button
              style={{ backgroundColor: buttonColor }}
              className="render-container__item-button"
              onClick={() => onButtonClick(item.id)}
            >
              {buttonText}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList;