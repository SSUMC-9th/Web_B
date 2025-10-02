import TodoForm from '../components/TodoForm'
import TodoList from '../components/TodoList'
import { useTodo } from '../context/TodoContext.tsx'

const Todo = () => {
    const {todos, doneTasks, completeTask, deleteTask} = useTodo(); 

    return (
        <div className="todo-container">
            <h1 className="todo-container__header">YONG TODO</h1>
            <TodoForm/>
            <div className="render-container">
                <TodoList
                    title='할 일'
                    todos={todos}
                    buttonLabel='완료'
                    buttonColor='#28a745'
                    onClick={completeTask}
                />
                <TodoList
                    title='완료'
                    todos={doneTasks}
                    buttonLabel='삭제'
                    buttonColor='#dc3545'
                    onClick={deleteTask}
                />
            </div>
        </div>
    )
}

export default Todo;