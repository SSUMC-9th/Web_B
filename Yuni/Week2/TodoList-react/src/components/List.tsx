import type { Todo } from '../types/todo';

interface ListProps {
    tasks:Todo[];
    handleTodos : (todo : Todo) => void;
    titleText:string;
    buttonText:string;
}

const List= ({tasks, handleTodos, titleText, buttonText} : ListProps) => {
    return (
          <div className="task-list">
            <h2 className="task-list__title">{titleText}</h2>
            <ul className="task-list__items">
              {tasks.map((task) => (
                <li className="task-list__item">
                  <span>{task.text}</span>
                  <button 
                    onClick = {() => handleTodos(task)} //클릭 시점에 실행 
                    className="task-list__button">
                    {buttonText}
                  </button>
                </li>
              ))} 
            </ul>
          </div>
    )
}

export default List;