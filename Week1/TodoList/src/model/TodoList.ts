import type { Todo } from './Todo';

export class TodoList {
  private todos: Todo[] = [];
  private nextId: number = 1;

  addTodo(title: string): void {
    const newTodo: Todo = {
      id: this.nextId++,
      title,
      completed: false
    };
    this.todos.push(newTodo);
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }

  completeTodo(id: number): void {
    const todo = this.todos.find(t => t.id === id);
    todo && todo.completed;
  }

  getActiveTodos(): Todo[] {
    return this.todos.filter(todo => !todo.completed);
  }

  getCompletedTodos(): Todo[] {
    return this.todos.filter(todo => todo.completed);
  }
}