import { useMemo, useState } from 'react';
import type {JSX} from 'react';
import TextInput from './components/TextInput';
import { findPrimeNumbers } from './utils/math';

export default function UseMemoPage(): JSX.Element {
  console.log('rerender');

  const [limit, setLimit] = useState<number>();
  const [text, setText] = useState('');

  const handleChangeText = (text: string): void => {
    setText(text);
  };

  // const primes = findPrimeNumbers(limit);
  const primes = useMemo(() => findPrimeNumbers(limit), [limit]);

  return (
    <div className = 'flex flex-col gap-4 h-dvh'>
      <h1>같이 배우는 리액트 useMemo편</h1>

      <label>
        숫자 입력 (소수 찾기):
        <input
          type="number"
          value={limit}
          className="border p-4 rounded-lg"
          onChange={(e): void => setLimit(Number(e.target.value))}
        />
      </label>

      <h1>소수 리스트:</h1>
      <div className = 'flex flex-wrap gap-2'>
        {primes.map((prime) => (
          <span key={prime} className="mr-2">
            {prime}&nbsp;
          </span>
        ))}
      </div>

      <label>
        {text}
        다른 입력 테스트:
        <TextInput onChange={handleChangeText} />
      </label>
    </div>
  );

}
