const age: 30 | 31 = 30;

const person0: { name: string; age: number } = { name: "Alice", age: 30 };

// 임의의 문자열 키를 허용, 그 값은 any 타입
const person1: { name: string; age: number; [key: string]: any } = {
  name: "Andy",
  age: 31,
  city: "New York"
};

const scores: { [subject: string]: number } = {
  math: 95,
  english: 88,
  science: 92
};

const person: { name: string; age?: number; } = {
  name: "Andy"
}