import { Todo } from './Todo';

class TodoList {
  private todos: Todo[] = [];
  private nextId: number = 1;

  addTodo(title: string): void {
    const newTodo = new Todo(this.nextId++, title);
    this.todos.push(newTodo);
  }

  removeTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }

  getTodos(): Todo[] {
    return this.todos;
  }
}