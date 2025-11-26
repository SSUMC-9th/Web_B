import { useShallow } from "zustand/shallow"
import { useCounterStore } from "../stores/counterStore"
import  CounterButton  from './CounterButton'

export default function Counter() {
    const {count} = useCounterStore(
        // useShallow(얕은 비교)로 각각 렌더링되도록? 
        useShallow((state) => ({
            count: state.count,
        }))
    );
    
    return (
        <div>
            <h1>{count}</h1>
            <CounterButton/>
        </div>
    )
}