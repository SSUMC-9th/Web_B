export interface Actions {
  increment: () => void;
  decrement: () => void;
  random: () => void;
}

export interface CounterState {
  count: number;
  randomNumber: number;

  actions: Actions;
}