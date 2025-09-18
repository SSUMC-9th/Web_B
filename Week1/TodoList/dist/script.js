"use strict";
const toDoForm = document.getElementById("todo-form");
const toDoList = document.getElementById("todo-list");
const completedList = document.getElementById("done-list");
const toDoInput = document.querySelector("#todo-form input");
const TODOS_KEY = "toDos";
const COMPLETED_KEY = "completedTasks";
let toDos = [];
let completedTasks = [];
function saveToDos() {
    localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}
function saveCompletedTasks() {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedTasks));
}
function completeToDo(event) {
    const target = event.target;
    const li = target.parentElement;
    li.remove();
    const completedObj = {
        text: li.firstChild.innerText,
        id: parseInt(li.id),
    };
    toDos = toDos.filter((toDo) => toDo.id !== completedObj.id);
    completedTasks.push(completedObj);
    paintCompletedToDo(completedObj);
    saveToDos();
    saveCompletedTasks();
}
function deleteToDo(event) {
    const target = event.target;
    const li = target.parentElement;
    li.remove();
    completedTasks = completedTasks.filter((task) => task.id !== parseInt(li.id));
    saveCompletedTasks();
}
function handleToDosubmit(event) {
    event.preventDefault();
    if (!toDoInput)
        return;
    const newTodoText = toDoInput.value.trim();
    if (newTodoText === "")
        return;
    toDoInput.value = "";
    const newTodoObj = {
        text: newTodoText,
        id: Date.now(),
    };
    toDos.push(newTodoObj);
    paintToDo(newTodoObj);
    saveToDos();
}
function paintToDo(newTodo) {
    const li = document.createElement("li");
    li.id = newTodo.id.toString();
    li.className = "task-item";
    const span = document.createElement("span");
    span.innerText = newTodo.text;
    const button = document.createElement("button");
    button.innerText = "완료";
    button.addEventListener("click", completeToDo);
    li.appendChild(span);
    li.appendChild(button);
    toDoList.appendChild(li);
}
function paintCompletedToDo(completedTodo) {
    const li = document.createElement("li");
    li.id = completedTodo.id.toString();
    li.className = "task-item";
    const span = document.createElement("span");
    span.innerText = completedTodo.text;
    const button = document.createElement("button");
    button.className = "delete-task";
    button.innerText = "삭제";
    button.addEventListener("click", deleteToDo);
    li.appendChild(span);
    li.appendChild(button);
    completedList.appendChild(li);
}
toDoForm.addEventListener("submit", handleToDosubmit);
const savedToDos = localStorage.getItem(TODOS_KEY);
if (savedToDos !== null) {
    const parsedToDos = JSON.parse(savedToDos);
    toDos = parsedToDos;
    parsedToDos.forEach(paintToDo);
}
const savedCompletedTasks = localStorage.getItem(COMPLETED_KEY);
if (savedCompletedTasks !== null) {
    const parsedCompletedTasks = JSON.parse(savedCompletedTasks);
    completedTasks = parsedCompletedTasks;
    parsedCompletedTasks.forEach(paintCompletedToDo);
}
