import React, { useMemo, useState } from 'react';

function heavyComputation(): number {
  let result = 0;
  for (let i = 0; i < 1_000_000_0; i++) {
    result += i;
  }
  return result;
}

export default function UseCallbackPage() {
  const [count, setCount] = useState(heavyComputation());

  const handleIncrease = (): void => {
    console.log('increase');
    setCount((prev): number => prev + 1);
  };

  return (
    <>
      <h3>{count}</h3>
      <button onClick={handleIncrease}>증가</button>
    </>
  );
}