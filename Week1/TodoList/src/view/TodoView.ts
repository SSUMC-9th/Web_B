import type { Todo } from '../model/Todo';
import type { TodoController } from "../controller/TodoController.ts";

export class TodoView {
  private todoInput: HTMLInputElement;
  private todoForm: HTMLFormElement;
  private activeList: HTMLUListElement;
  private completedList: HTMLUListElement;
  private controller?: TodoController;

  constructor() {
    this.todoInput = document.getElementById('todo-input') as HTMLInputElement;
    this.todoForm = document.getElementById('todo-form') as HTMLFormElement;
    this.activeList = document.getElementById('todo-list') as HTMLUListElement;
    this.completedList = document.getElementById('done-list') as HTMLUListElement;
  }
  
  setController(controller: TodoController): void {
    this.controller = controller;
    this.initFormListener();
  }

  private initFormListener(): void {
    // 폼 제출 이벤트 리스너 등록
    this.todoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.controller) {
        this.controller.addTodo(this.todoInput.value);
        this.todoInput.value = '';
      }
    });
  }

  render(activeTodos: Todo[], completedTodos: Todo[]): void {
    this.renderActiveTodos(activeTodos);
    this.renderCompletedTodos(completedTodos);
  }

  private renderActiveTodos(todos: Todo[]): void {
    this.activeList.innerHTML = '';
    todos.forEach(todo => {
      const li = this.createTodoElement(todo, false);
      this.activeList.appendChild(li);
    });
  }

  private renderCompletedTodos(todos: Todo[]): void {
    this.completedList.innerHTML = '';
    todos.forEach(todo => {
      const li = this.createTodoElement(todo, true);
      this.completedList.appendChild(li);
    });
  }

  private createTodoElement(todo: Todo, isCompleted: boolean): HTMLElement {
    const li = document.createElement('li');
    li.classList.add('render-container__item');
    li.textContent = todo.title;

    const button = document.createElement('button');
    button.classList.add('render-container__item-button');

    if (isCompleted) {
      button.textContent = '삭제';
      button.style.backgroundColor = '#f44336';
      button.addEventListener('click', () => {
        if (this.controller) {
          this.controller.deleteTodo(todo.id);
        }
      });
    } else {
      button.textContent = '완료';
      button.style.backgroundColor = '#4CAF50';
      button.addEventListener('click', () => {
        if (this.controller) {
          this.controller.completeTodo(todo.id);
        }
      });
    }
    li.appendChild(button);
    return li;
  }
}