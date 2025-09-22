const tuple0: [string, boolean, number] = [
  '춘식이',
  true,
  42
];

tuple0[0] = '고구마';

const tuple1: readonly [string, number][] = [
  ['Alice', 30],
  ['Bob', 25],
  ['Charlie', 35]
];
tuple1[0][0] = "Dave";

/* as const의 추론:
 * readonly [
 *   readonly ["Alice", 30],
 *   readonly ["Bob", 25],
 *   readonly ["Charlie", 35]
 * ]
 * 그치만 tuple2는 [string, number][] 타입이라서
 * tuple2[0][0] = "Dave"; 가능
 */
const tuple2: [string, number][] = [
  ['Alice', 30],
  ['Bob', 25],
  ['Charlie', 35]
] as const;
tuple2[0][0] = "Dave";

console.log(tuple2);

/* tuple3는 readonly 속성이라서
 * tuple3[0][0] = "Dave"; 불가능
 * push, pop 같은 메서드도 불가능
 */
const tuple3 = [
  ['Alice', 30],
  ['Bob', 25],
  ['Charlie', 35],
] as const;
// tuple3[0][0] = "Dave";
// tuple3.push(['Dave', 40]);