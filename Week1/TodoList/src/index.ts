import { TodoList } from './model/TodoList';
import { TodoView } from './view/TodoView';
import { TodoController } from './controller/TodoController';

// MVC 패턴으로 애플리케이션 초기화
const model = new TodoList();
const view = new TodoView();
const controller = new TodoController(model, view);
