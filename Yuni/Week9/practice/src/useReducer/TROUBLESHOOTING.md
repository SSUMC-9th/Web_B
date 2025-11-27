# useReducer 트러블슈팅 가이드

## 발생한 문제

useReducer 구현 중 타입 에러 2개가 발생했다.

### 에러 1: Property 'counter' does not exist on type 'ReactElement'

```
Error: Property 'counter' does not exist on type 'ReactElement<unknown, string | JSXElementConstructor<any>>'.
```

**발생 위치:** `<h2>useReducer 훅 사용: {state.counter}</h2>`

### 에러 2: Expected 0 arguments, but got 1

```
Error: Expected 0 arguments, but got 1.
```

**발생 위치:** `dispatch({type: 'RESET_TO_ZERO'})`

---

## 원인 분석

### 근본 원인

```typescript
// 잘못된 코드
const [state, dispatch] = useReducer(UseReducerPage, {
  counter: 0,
})
```

`useReducer`의 첫 번째 인자에 **reducer 함수 대신 컴포넌트 함수**(`UseReducerPage`)를 전달했다.

### 연쇄 효과

1. `useReducer`가 `UseReducerPage` 함수를 reducer로 인식
2. `state`의 타입이 `IState`가 아닌 `ReactElement`로 추론됨
3. `state.counter`에 접근 불가 (ReactElement에는 counter 속성이 없음)
4. `dispatch`는 `UseReducerPage` 함수를 호출하는 것으로 작동 시도
5. `UseReducerPage`는 매개변수가 없으므로 인자 전달 불가

---

## 해결 방법

### 수정 전

```typescript
const [state, dispatch] = useReducer(UseReducerPage, {
  counter: 0,
})
```

### 수정 후

```typescript
const [state, dispatch] = useReducer(reducer, {
  counter: 0,
})
```

### 변경 사항

- `UseReducerPage` → `reducer` 함수로 변경
- 실제 reducer 함수를 useReducer의 첫 번째 인자로 전달

---

## 동작 원리

### useReducer의 올바른 사용법

```typescript
useReducer(reducerFunction, initialState)
```

- **첫 번째 인자:** 상태 업데이트 로직을 담은 reducer 함수
- **두 번째 인자:** 초기 상태 값

### reducer 함수 구조

```typescript
function reducer(state: IState, action: IAction): IState {
  switch (action.type) {
    case 'INCREASE':
      return { ...state, counter: state.counter + 1 }
    case 'DECREASE':
      return { ...state, counter: state.counter - 1 }
    case 'RESET_TO_ZERO':
      return { ...state, counter: 0 }
    default:
      return state
  }
}
```

- 현재 상태와 액션을 받아 새로운 상태를 반환
- dispatch로 호출될 때마다 실행됨

---

## 예방 방법

1. **타입 체크:** IDE의 타입 에러 메시지를 주의깊게 읽기
2. **함수 확인:** 함수명과 함수 정의를 정확히 일치시키기
3. **useReducer 구조 숙지:** reducer 함수와 컴포넌트 함수를 혼동하지 않기
4. **테스트:** 각 action type마다 dispatch가 정상 작동하는지 확인하기

---

## 결과

수정 후 모든 기능이 정상 작동:

- useState 카운터: Increase 버튼으로 증가
- useReducer 카운터: Increase, Decrease, Reset to Zero 버튼으로 상태 관리
- 모든 타입 에러 해결
