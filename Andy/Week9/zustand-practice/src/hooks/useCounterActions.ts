import { useCounterStore } from "../stores/counterStore.ts";
import type { Actions } from "../types/CounterState.ts";

/**
 * Atomic Selector => 모든 값을 개별로 꺼내야 한다는 규칙.
 *
 * actions의 객체는 한 번 정의되기에 함수의 reference는 불변
 * 컴포넌트가 항상 동일한 객체를 바라보기에 렌더링에 영향을 주지 않음
 * -> 테스트 용이해지고 재사용성 증가함
 *
 * 다르게 말하면 여러 액션을 사용할 때 일일이 꺼내야 해서 번거로울 순 있겠음
 */

export const useCounterActions = () =>
  useCounterStore((state): Actions => state.actions);
