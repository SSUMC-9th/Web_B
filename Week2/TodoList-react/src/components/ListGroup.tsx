import List from './List';
import type { Todo } from '../types/todo';

interface listGroupProps {
    todos : Todo[];
    completedTasks : Todo[];
    handleCompleted : (todo : Todo) => void;
    handleDelete : (todo : Todo) => void;
}

const listGroup = ({todos, completedTasks, handleCompleted, handleDelete} : listGroupProps) => {
    return (
        <div className="task-lists">
          {/*할일목록*/}
          <List
            tasks={todos} //todos
            handleTodos={handleCompleted} //handleCompleted
            titleText={'할 일'}
            buttonText={'완료'}
          />
          {/*완료목록*/}
          <List
            tasks={completedTasks} //completedTasks
            handleTodos={handleDelete} //handleDelete
            titleText={'완료'}
            buttonText={'삭제'}
          />
        </div>
    )
}

export default listGroup;