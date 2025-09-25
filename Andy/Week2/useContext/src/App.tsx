import './App.css'
import { useCounter } from "./context/CounterProvider.tsx";
import { ButtonGroup } from "./components/ButtonGroup.tsx";

function App() {
  const context = useCounter();
  console.log(context)

  return (
    <>
      <h1>{context?.count}</h1>
      <ButtonGroup
        handleIncrement={context.handleIncrement}
        handleDecrement={context.handleDecrement}
      />
    </>
  )
}

export default App
