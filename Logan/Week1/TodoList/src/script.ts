
const todoInput=document.getElementById("todo-input") as HTMLInputElement;
const todoForm=document.getElementById("todo-form") as HTMLFormElement;
const todoList=document.getElementById("todo-list") as HTMLUListElement;
const doneList=document.getElementById("done-list") as HTMLUListElement;


// 2. 할일 어떻게 생기는지 type정의
type Todo={
    id:number;
    text:string;
}

let todos: Todo[]=[];
let doneTasks: Todo[]=[];

// 할일 목록을 랜더링 하는 함수를 정의
const renderTasks=(): void=>{

    // 빈상태 만들기 
    todoList.innerHTML='';
    doneList.innerHTML='';


    todos.forEach((todo):void =>{
        const li=createTodoElement(todo, false);
        todoList.appendChild(li);
    });

    doneTasks.forEach((todo):void => {
        const li=createTodoElement(todo, true);
        doneList.appendChild(li);
    })
}; 

// 3. 할일 텍스트 입력처리 함수. (공백 잘라주기)

const getTodoText=():string=>
{
    return todoInput.value.trim();
}

// 4. 할일 추가 처리함수
const addTodo=(text: string): void =>{
    todos.push({id: Date.now(), text});
    todoInput.value='';
    renderTasks();
};

// 5. 할일 상태 변경(완료로 이동)
const completeTodo=(todo: Todo) :void =>{
    todos=todos.filter((t): boolean =>t.id!==todo.id);
    doneTasks.push(todo);
    renderTasks();
}


// 6. 완료된 할일 삭제 함수
const deleteTodo=(todo:Todo): void=>{
    doneTasks=doneTasks.filter((t): boolean =>t.id!==todo.id);
    renderTasks();
}

// 7. 할일 아이템 생성 함수 (완료 여부에 따라 버튼 텍스트나 색상 설정)
const createTodoElement=(todo:Todo, isDone: boolean): HTMLElement=>{
    const li =document.createElement('li');
    li.classList.add('render-container__item');
    li.textContent=todo.text;

    const button=document.createElement('button');
    button.classList.add('render-container__item-button');

    if(isDone)
    {
        button.textContent="삭제";
        button.style.backgroundColor="aqua";
        //button.addEventListener('click', (): (todo: Todo)=>void => deleteTodo);

    }else{
        button.textContent="완료";
        button.style.backgroundColor="lightgreen";
    }

    button.addEventListener('click', (): void=>{
        if(isDone)
        {
            deleteTodo(todo);
        }else{
            completeTodo(todo);
        }
    });

    li.appendChild(button);
    return li;
    
};

            // <div class="render-container__section">
            //     <h2 class="render-container__title">완료</h2>
            //     <ul id="todo-list" class="render-container__list">
            //         <li class="render-container__item">


            //         </li>
            //     </ul>
            // </div>

// 8. 폼 제출 리스너 

todoForm.addEventListener('submit',(event:Event): void =>{
    event.preventDefault();
    const text=getTodoText();
    if(text)
    {
        addTodo(text);
    }
});

renderTasks();







// 오류확인->gpt코드

// 1. html  요소 선택
// const todoInput=document.getElementById("todo-input") as HTMLInputElement;
// const todoForm=document.getElementById("todo-form") as HTMLFormElement;
// const todoList=document.getElementById("todo-list") as HTMLUListElement;
// const doneList=document.getElementById("done-list") as HTMLUListElement;


// // 2. 할일 어떻게 생기는지 type정의
// type Todo={
//     id:number;
//     text:string;
// }

// let todos: Todo[]=[];
// let doneTasks: Todo[]=[];

// // 할일 목록을 랜더링 하는 함수를 정의
// const renderTasks=(): void=>{

//     // 빈상태 만들기 
//     todoList.innerHTML='';
//     doneList.innerHTML='';


//     todos.forEach((todo):void =>{
//         const li=createTodoElement(todo, false);
//         todoList.appendChild(li);
//     });

//     doneTasks.forEach((todo):void => {
//         const li=createTodoElement(todo, true);
//         todoList.appendChild(li);
//     })
// }; 

// // 3. 할일 텍스트 입력처리 함수. (공백 잘라주기)

// const getTodoText=():string=>
// {
//     return todoInput.value.trim();
// }

// // 4. 할일 추가 처리함수
// const addTodo=(text: string): void =>{
//     todos.push({id: Date.now(), text});
//     todoInput.value='';
//     renderTasks();
// };

// // 5. 할일 상태 변경(완료로 이동)
// const completeTodo=(todo: Todo) :void =>{
//     todos=todos.filter((t): Boolean =>t.id!==todo.id);
//     doneTasks.push(todo);
//     renderTasks();
// }


// // 6. 완료된 할일 삭제 함수
// const deleteTodo=(todo:Todo): void=>{
//     doneTasks=doneTasks.filter((t): Boolean =>t.id!==todo.id);
//     renderTasks();
// }

// // 7. 할일 아이템 생성 함수 (완료 여부에 따라 버튼 텍스트나 색상 설정)
// const createTodoElement=(todo:Todo, isDone: boolean): HTMLElement=>{
//     const li =document.createElement('li');
//     li.classList.add('render-container__item');
//     li.textContent=todo.text;

//     const button=document.createElement('button');
//     button.classList.add('render-container__item-button');

//     if(isDone)
//     {
//         button.textContent="삭제";
//         button.style.backgroundColor="aqua";
//         button.addEventListener('click', (): (todo: Todo)=>void => deleteTodo);

//     }else{
//         button.textContent="완료";
//         button.style.backgroundColor="lightgreen";
//     }

//     button.addEventListener('click', (): void=>{
//         if(isDone)
//         {
//             deleteTodo(todo);
//         }else{
//             completeTodo(todo);
//         }
//     });

//     li.appendChild(button);
//     return li;
    
// };

//             // <div class="render-container__section">
//             //     <h2 class="render-container__title">완료</h2>
//             //     <ul id="todo-list" class="render-container__list">
//             //         <li class="render-container__item">


//             //         </li>
//             //     </ul>
//             // </div>

// // 8. 폼 제출 리스너 

// todoForm.addEventListener('submit',(event:Event): void =>{
//     event.preventDefault();
//     const text=getTodoText();
//     if(text)
//     {
//         addTodo(text);
//     }
// });

// renderTasks();