import { TodoList } from '../model/TodoList';
import { TodoView } from '../view/TodoView';
import { getTrimmedText } from '../util/TodoUtil';

export class TodoController {
  private model: TodoList;
  private view: TodoView;

  constructor(model: TodoList, view: TodoView) {
    this.model = model;
    this.view = view;
    this.view.setController(this);
    this.updateView();
  }

  addTodo(title: string): void {
    const trimmedTitle = getTrimmedText(title);
    if (trimmedTitle) {
      this.model.addTodo(trimmedTitle);
      this.updateView();
    }
  }

  completeTodo(id: number): void {
    this.model.completeTodo(id);
    this.updateView();
  }

  deleteTodo(id: number): void {
    this.model.deleteTodo(id);
    this.updateView();
  }

  private updateView(): void {
    const activeTodos = this.model.getActiveTodos();
    const completedTodos = this.model.getCompletedTodos();
    this.view.render(activeTodos, completedTodos);
  }
}