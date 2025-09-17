import type { Todo } from './Todo';

export class TodoList {
  private activeTodos: Todo[] = [];
  private completedTodos: Todo[] = [];
  private nextId: number = 1;

  addTodo(title: string): void {
    const newTodo: Todo = {
      id: this.nextId++,
      title,
      completed: false
    };
    this.activeTodos.push(newTodo);
  }

  deleteTodo(id: number): void {
    this.completedTodos = this.completedTodos.filter(todo => todo.id !== id);
  }

  completeTodo(id: number): void {
    const todo = this.activeTodos.find(t => t.id === id);
    if (todo) {
      const completedTodo: Todo = {
        // 스프레드 연산자: 객체의 모든 속성을 복사
        ...todo,
        // completed를 true로 덮어쓰기
        completed: true
      };
      // completedTodos에 추가
      this.completedTodos.push(completedTodo);
      // activeTodos에서 제거
      this.activeTodos = this.activeTodos.filter(t => t.id !== id);
    }
  }

  getActiveTodos(): Todo[] {
    return this.activeTodos;
  }

  getCompletedTodos(): Todo[] {
    return this.completedTodos;
  }
}