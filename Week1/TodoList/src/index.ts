import type { Todo } from './model/Todo';
import { TodoList } from './model/TodoList';
import { getTrimmedText } from "./util/TodoUtil.ts";

const todos = new TodoList();

const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;

function render() {
  todoList.innerHTML = '';
  doneList.innerHTML = '';

  todos.getActiveTodos().forEach((todo) => {
    const li = createTodoElement(todo, false);
    todoList.appendChild(li);
  });

  todos.getCompletedTodos().forEach((todo) => {
    const li = createTodoElement(todo, true);
    doneList.appendChild(li);
  });
}

const addTodo = (title: string) => {
  const trimmedTitle = getTrimmedText(title);
  if (trimmedTitle) {
    todos.addTodo(trimmedTitle);
    render();
  }
}

const deleteTodo = (id: number) => {
  todos.deleteTodo(id);
  render();
}

const completeTodo = (id: number) => {
  todos.completeTodo(id);
  render();
}

const createTodoElement = (todo: Todo, isCompleted: boolean): HTMLElement => {
  const li = document.createElement('li');
  li.classList.add('render-container__item');
  li.textContent = todo.title;

  const button = document.createElement('button');
  button.classList.add('render-container__item-button');

  if (todo.completed) {
    button.textContent = '삭제';
    button.style.backgroundColor = '#f44336';
  } else {
    button.textContent = '완료';
    button.style.backgroundColor = '#4CAF50';
  }

  button.addEventListener('click', (event: Event): void => {
    isCompleted ? deleteTodo(todo.id) : completeTodo(todo.id);
  });

  li.appendChild(button);
  return li;
}

todoForm.addEventListener('submit', e => {
  // 폼 제출 시 페이지 리로드 방지
  e.preventDefault();
  addTodo(todoInput.value);
  todoInput.value = '';
});

render();

