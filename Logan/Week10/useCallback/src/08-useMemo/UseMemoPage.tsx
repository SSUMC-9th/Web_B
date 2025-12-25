import React, { useMemo, useState } from "react";
import TextInput from "./components/TextInput";
import { findPrimeNumber } from "./utils/math";

export default function UseMemoPage() {
  console.log("리렌더일어남");

  const [limit, setLimit] = useState(0);
  const [text, setText] = useState("");

  const handleChangeText = (text: string) => {
    setText(text);
  };

  //   const primes = findPrimeNumber(limit);
  const primes = useMemo((): number[] => findPrimeNumber(limit), [limit]);

  return (
    <div className="flex flex-col gap-4">
      <h1>같이 배우는 리액트: useMemo편</h1>
      <label>
        숫자입력(소수찾기):
        <input
          type="number"
          value={limit}
          className="border p-4 rounded-lg"
          onChange={(e): void => setLimit(Number(e.target.value))}
        />
      </label>

      <h2>소수 리스트: </h2>
      <div className="flex flex-wrap">
        {primes.map((prime) => (
          <div key={prime}>{prime}&nbsp;</div>
        ))}
      </div>

      <label>
        {text}
        다른 입력 테스트: <TextInput onChange={handleChangeText} />
      </label>
    </div>
  );
}
