import React from "react";
import { memo } from "react";

interface ICountButton {
  onClick: (count: number) => void;
}

const CountButton = ({ onClick }: ICountButton) => {
  console.log("카운트버튼 렌더됨");
  return (
    <button className="border p-2 rounded-lg" onClick={(): void => onClick(10)}>
      카운트증가
    </button>
  );
};

export default memo(CountButton);
