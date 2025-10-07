const toDoForm = document.getElementById("todo-form") as HTMLFormElement;
const toDoList = document.getElementById("todo-list") as HTMLUListElement;
const completedList = document.getElementById("done-list") as HTMLUListElement;
const toDoInput = document.querySelector<HTMLInputElement>("#todo-form input");

// 로컬 스토리지 키
const TODOS_KEY = "toDos";
const COMPLETED_KEY = "completedTasks";

interface Task {
    text: string;
    id: number;
}

let toDos: Task[] = [];
let completedTasks: Task[] = [];

// 로컬 스토리지에 할 일 목록 저장
function saveToDos(): void {
    localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}

// 로컬 스토리지에 완료된 할 일 목록 저장
function saveCompletedTasks(): void {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedTasks));
}

// 할 일 완료
function completeToDo(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const li = target.parentElement as HTMLLIElement;
    li.remove();

    const completedObj: Task = {
        text: (li.firstChild as HTMLElement).innerText,
        id: parseInt(li.id),
    };

    toDos = toDos.filter((toDo) => toDo.id !== completedObj.id);

    completedTasks.push(completedObj);
    paintCompletedToDo(completedObj);

    saveToDos();
    saveCompletedTasks();
}

// 할 일 삭제
function deleteToDo(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const li = target.parentElement as HTMLLIElement;
    li.remove();

    // completedTasks 배열에서도 제거
    completedTasks = completedTasks.filter(
        (task) => task.id !== parseInt(li.id)
    );

    saveCompletedTasks();
}

// 새 할 일 추가
function handleToDosubmit(event: Event): void {
    event.preventDefault();
    if (!toDoInput) return;
    const newTodoText = toDoInput.value.trim();
    if (newTodoText === "") return; // 빈 값 방지
    toDoInput.value = "";

    const newTodoObj: Task = {
        text: newTodoText,
        id: Date.now(), // 고유 ID
    };

    toDos.push(newTodoObj);
    paintToDo(newTodoObj);
    saveToDos();
}

// 전달받은 할 일을 화면에 표시
function paintToDo(newTodo: Task): void {
    const li = document.createElement("li");
    li.id = newTodo.id.toString();
    li.className = "task-item";

    const span = document.createElement("span");
    span.innerText = newTodo.text;

    const button = document.createElement("button");
    // button.className = "complete-task";
    button.innerText = "완료";
    button.addEventListener("click", completeToDo);

    li.appendChild(span);
    li.appendChild(button);
    toDoList.appendChild(li);
}

// 완료된 할 일을 화면에 표시
function paintCompletedToDo(completedTodo: Task): void {
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

// 이벤트 리스너
toDoForm.addEventListener("submit", handleToDosubmit);

// 저장된 할 일 불러오기
const savedToDos = localStorage.getItem(TODOS_KEY);
if (savedToDos !== null) {
    const parsedToDos: Task[] = JSON.parse(savedToDos);
    toDos = parsedToDos;
    parsedToDos.forEach(paintToDo);
}

// 저장된 완료된 할 일 불러오기
const savedCompletedTasks = localStorage.getItem(COMPLETED_KEY);
if (savedCompletedTasks !== null) {
    const parsedCompletedTasks: Task[] = JSON.parse(savedCompletedTasks);
    completedTasks = parsedCompletedTasks;
    parsedCompletedTasks.forEach(paintCompletedToDo);
}
