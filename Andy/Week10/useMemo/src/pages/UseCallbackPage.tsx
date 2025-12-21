import { useMemo, useState } from 'react';

function heavyComputation() {
  let result = 0;
  for (let i = 0; i < 1000999999; i++) {
    result += i;
  }

  return result;
}

export default function UseCallbackPage() {
  const [count, setCount] = useState(heavyComputation());

  const handleIncrease = () => {
    console.log('Increase button clicked');
    setCount((prevCount) => prevCount + 1);
  };

  return (
    <div>
      <h1>Use Callback Page</h1>
      <p>Count: {count}</p>
      <button onClick={handleIncrease}>Increase</button>
    </div>
  );
}