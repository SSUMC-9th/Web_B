import { useTodoContext } from "../hooks/useTodo";
import TodoList from "./TodoList";
import TodoInput from "./TodoInput.tsx";

const TodoContainer = () => {
  const { todos, toggleTodo, deleteTodo } = useTodoContext();
  const pendingTodos = todos.filter(todo => !todo.done)
  const completedTodos = todos.filter(todo => todo.done)

  return (
    <>
      <TodoInput />
      <div className="render-container">
          <TodoList
            title="할 일"
            todos={pendingTodos}
            buttonText="완료"
            buttonColor="#4CAF50"
            onButtonClick={toggleTodo}
            listId="todo-list"
          />
          <TodoList
            title="완료"
            todos={completedTodos}
            buttonText="삭제"
            buttonColor="#f44336"
            onButtonClick={deleteTodo}
            listId="done-list"
          />
      </div>
    </>
  )
}

export default TodoContainer;