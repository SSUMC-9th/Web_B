import type { TTodo } from '../types/todo'

interface TodoListProps {
    title: string;
    todos?: TTodo[];
    buttonLabel: string;
    buttonColor: string;
    // completeTodo, deleteTodo 모두 올 수 있음
    onClick: (todo: TTodo) => void;
}

const TodoList = ({
    title,
    todos,
    buttonLabel,
    buttonColor,
    onClick
}: TodoListProps) => {
    return (
        <div className="render-container__section">
            <h2 className="render-container__title">{title}</h2>
            <ul className="render-container__list">
                {todos?.map((task): any => (
                    <li key={task.id} className="render-container__item">
                        {task.text}
                        <button 
                            className="render-container__item-button"
                            style={{backgroundColor: buttonColor}}
                            onClick={(): void => onClick(task)}
                        >
                            {buttonLabel}
                        </button>
                    </li> 
                ))}
            </ul>
        </div>        
    )
};

export default TodoList;