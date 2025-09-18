

// 1. HTML 요소 선택

// id="todo-input"인 요소를 찾아, 이게 <input>임을 TypeScript에게 알려주고(HTMLInputElement로 타입 단언),
// 그걸 todoInput이라는 상수에 담는다. 이제 .value 같은 input 전용 속성을 안전하게 쓸 수 있다.

const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;


// 2. 할 일이 어떻게 생긴 애인지 Type을 정의 

// // Todo 타입 정의
//  i → id는 number 타입, text-> string 타입을 가지는 객체

type Todo = {
    id: number;
    text: string;
};

// 할 일 목록(todos)과 완료된 목록(doneTasks)을 저장할 배열
// 각각 Todo 객체들의 빈 배열로 선언
let todos: Todo[] = [];
let doneTasks: Todo[] = [];

// 할 일 목록 렌더링 하는 함수를 정의

// renderTasks 화살표 함수이며 () 매개변수를 받지 않고 void로 아무것도 반환하지 않는다.

// 1. todoList(ul) 안에 들어 있던 <li> 를 전부 없앰
//    doneList(ul) 안에 들어 있던 <li> 를 전부 없앰

const renderTasks = () : void => {
    todoList.innerHTML = '';
    doneList.innerHTML = '';


//      2-1 todos 배열에 들어 있는 모든 객체를 하나씩 꺼내 반복실행(forEach) 
//          각 객체는 todo라는 이름으로 받아옴, void로 반환 값은 없다.

// //   2-2 todo 객체 하나를 <li> 태그로 변환, 완료되지 않았으니 false로 설정

//      2-3 방금 만든 <li를> <ul id="todo-list"> 안에 넣는다.

    todos.forEach((todo) : void => {
        const li = createTodoElement(todo, false);
        todoList.appendChild(li);
    });

//     3-1 doneTasks 배열에 들어 있는 모든 객체를 하나씩 꺼내 반복실행(forEach) 
//         각 객체는 todo라는 이름으로 받아옴, 타입은 void로 반환 값은 없다.

// //  3-2  todo 객체 하나를 <li> 태그로 변환, 완료되었으니 true로 설정

//     3-3  방금 만든 <li를> <ul id="todo-list"> 안에 넣는다.

    doneTasks.forEach((todo) : void => {
        const li = createTodoElement(todo, true);
        doneList.appendChild(li);
    });

};
// 3. 할 일 텍스트 입력 처리 함수 () 매개변수를 받지 않음
//    타입은 string , 반환값은 trim(공백을 뺀) todoInput의 value(사용자의 입력값)을 가져옴.

const getTodoText = (): string => {
    return todoInput.value.trim();
};

// 4. 할 일 추가 처리 함수 
// // 매개변수 Todo의 text(string 타입 -> 할 일 내용)을 받아옴 / void로 반환 값 X
// // 1. todos 배열에 새로운 객체(Todo)를 push(넣는다)
// //    id는 Date.now() -> 지금 시각을 숫자로 반환 / text는 함수로 받은 문자열
// // 2. 입력칸이 다시 공백으로 초기화
// // 3. renderTasks 함수 불러옴.

const addTodo = (text: string) : void => {
    todos.push({ id: Date.now(), text});
    todoInput.value = '';
    renderTasks();
};

// 5. 할 일 상태 변경
// // 매개변수 todo(Todo 타입 객체 하나)를 받아옴 / void로 반환 값 X
// // 1. todos.filter는 배열에서 조건을 반족하는 요소만 남긴다
// //    매개변수 todo.id와 todos 배열의 id (t.id)와 다른 것만 남긴다.
// //    -> 결국 완료된 todo 객체는 todos 배열에서 빠지게 된다.
// // 2. doneTasks 배열에 새로운 객체(todo)를 push(넣는다).
// // 3. renderTasks 함수 불러옴.

const completeTodo = (todo: Todo) : void => {
    todos = todos.filter((t) : boolean => t.id !== todo.id);
    doneTasks.push(todo);
    renderTasks();
}

// 6. 완료된 할 일 삭제 함수
// // 매개변수 todo(Todo 타입 객체 하나)를 받아옴 / void로 반환 값 X
// // 1. doneTasks.filter는 배열에서 조건을 반족하는 요소만 남긴다
// //    매개변수 todo.id와 doneTasks 배열의 id (t.id)와 다른 것만 남긴다.
// //    -> 결국 완료된 todo 객체는 doneTasks 배열에서 빠지게 된다.
// // 2. renderTasks 함수 불러옴.
const deleteTodo = (todo: Todo) : void => {
    doneTasks = doneTasks.filter((t) : boolean => t.id !== todo.id);
    renderTasks();
}
// 7. 할 일 아이템 생성 함수
// // 매개변수 todo(Todo 타입 객체 하나)와 boolean(true, false) 타입을 받아옴
// // 반환 타입: HTMLLIElement → <li> 요소 하나를 반드시 돌려줌
// // 1-1. 새로운 li 태그를 만든다.
// // 1-2. CSS 클래스 render-container__item을 추가
// // 1-3. li 안의 글자로 todo.text를 넣는다.

const createTodoElement = (todo: Todo, isDone: boolean) : HTMLLIElement => {
    const li = document.createElement('li');
    li.classList.add('render-container__item');
    li.textContent = todo.text;

// // 2-1. 새로운 button 태그를 만든다. 
// // 2-2. CSS 클래스 render-container__item-button 추가
    const button = document.createElement('button');
    button.classList.add('render-container__item-button');

// // 2-3. isDone(boolean)이 True라면 버튼 text는 삭제와 color는 빨간색
// //                       False라면 버튼 text는 완료와 color는 파란색
    if (isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#dc3545';
    }   else {
        button.textContent = '완료';
        button.style.backgroundColor = '#007bff';
    }

    // 3. button에서 click 이벤트 시 사용자가 클릭 시 발생 함수 / void로 반환 값 X
    //  3-1 isDone이 True라면 deleteTodo 함수 활성화(doneTasks 배열에서 빠짐)
    //  3-1 isDone이 false라면 completeTodo 함수 활성화(todos 배열에서 빠지고 doneTasks 배열 추가)
    button.addEventListener('click', () : void => {
        if (isDone) {
            deleteTodo(todo);
        } else {
            completeTodo(todo);
        }
    });
    // 4. <li> 자식 태그로 button 들어감
    //    <li>를 반환
    li.appendChild(button);
    return li;
};

// 8. 폼 제출 이벤트 리스너.
// // todoForm에서 submit 이벤트로 사용자가 입력 후 Enter or 버튼 누를 때 발생 함수 / void로 반환 값 X
// // -함수 내용-
// // 1. preventDefault-submit의 기본 동작(새로고침)을 막아주는 함수
// // 2-1. getTodoText(입력값 value)를 불러와 상수 text로 설정
// // 2-2. text가 공백이 아닐 시 addTodo(text) 함수 불러옴

todoForm.addEventListener('submit', (event: Event) : void => {
    event.preventDefault();
    const text = getTodoText();
    if (text) {
        addTodo(text);
    }
});

// 앱 시작 시점 renderTasks 함수 불러옴
renderTasks();