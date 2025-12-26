import {useState, useMemo} from 'react';
import TextInput from './components/TextInput';
import { findPrimeNumbers } from './utils/math';

export default function UseMemoPage() {
    console.log('rerender');

    const [limit, setLimit] = useState<number>();
    const [text, setText] = useState('');

    const handleChangeText = (text: string): void => {
        setText(text);
    }

    const primes = useMemo((): number[] => findPrimeNumbers(limit ?? 0), [limit]);

    return (
        <div>
        <h1>같이 배우는 리액트: useMemo편</h1>
        <label>
            숫자 입력 (소수 찾기):
            <input
            type = 'number'
            value={limit}
            className='border p-4 rounded-lg'
            onChange={(e) => setLimit(Number(e.target.value))}
            />
        </label>

        <h2> 소수 리스트: </h2>
        <div className='flex flex-wrap gap-2'>
            {primes.map((prime) => (
                <div key={prime}>{prime}</div>
            ))}
        </div>
        <label>
            {text}
            다른 입력 테스트: <TextInput onChange={handleChangeText}/>
        </label>
        </div>
    )
}
