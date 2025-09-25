import React, { useState, type FormEvent } from 'react';
import { useTodo } from '../context/TodoContext';



const TodoForm = (): Element => {


    const [input, setInput]= useState<string>('');
    const{addTodo}=useTodo()
    //console.log(context)
   

    // console.log('input: ',input)

    const handleSubmit= (e: FormEvent<HTMLFormElement>) : void =>{
        e.preventDefault();
        console.log('동작함')
        const text=input.trim();

        if(text){
            // addTodo
            addTodo(text);
            setInput('');
        }
    };

    
    return (
        <form onSubmit={handleSubmit} 
        className='todo-container__form'>
            <input 
            value={input}
            onChange={(e): void =>setInput(e.target.value)}
            type='text' 
            className='todo-container__input' 
            placeholder='할일 입력'
            required/>
            <button type='submit' className='todo-container__button'>
                할일 추가
            </button>
                
        </form>
    );
};

export default TodoForm;