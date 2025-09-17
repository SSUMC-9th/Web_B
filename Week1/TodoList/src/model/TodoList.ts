import { Todo } from './Todo';

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

  removeTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }

  toggleTodo(id: number): void {
    this.todos = this.todos.map(todo =>
      // 스프레드 연산자: 기존 객체의 모든 속성을 복사함.
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  }

  getActiveTodos(): Todo[] {
    return this.todos.filter(todo => !todo.completed);
  }

  getCompletedTodos(): Todo[] {
    return this.todos.filter(todo => todo.completed);
  }
}