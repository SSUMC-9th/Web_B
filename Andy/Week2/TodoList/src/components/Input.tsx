import { useState, type FormEvent } from "react";

interface InputProps {
  onAddTodo: (text: string) => void
}

const Input = ({ onAddTodo }: InputProps) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (text) {
      onAddTodo(text)
      setInputValue("");
    }
  }
  return (
    <form id="todo-form" className="todo-container__form" onSubmit={handleSubmit}>
      <input
        type="text"
        id="todo-input"
        className="todo-container__input"
        placeholder="할 일을 입력하세요"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        required
      />
      <button type="submit" className="todo-container__button">
        할 일 추가
      </button>
    </form>
  )
}

export default Input;
