import React from 'react';

interface InputFormProps {
  handleSubmmit: (e: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>; //이게 뭐여
}

const inputForm = ({handleSubmmit, input, setInput} : InputFormProps) => {
    return (
        <form onSubmit = {handleSubmmit} className="todo__form">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="todo__input"
            type="text"
            placeholder="할 일 입력"
          />
          <button className="todo__button">할 일 추가</button>
        </form>
    );
};

export default inputForm