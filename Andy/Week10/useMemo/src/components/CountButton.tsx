import { memo } from 'react';

interface ICountButtonProps {
  onClick: (count: number) => void;
}

const CountButton = ({ onClick }: ICountButtonProps) => {
  console.log('CountButton 렌더링됨');

  return <button onClick={() => onClick(1)}>증가</button>;
}

export default memo(CountButton);