import ButtonGroup from "./components/ButtonGroup";
import {useCount} from "./context/CounterProvider";
import Text from "./components/text";

function App() {
  const {count}= useCount();


return (
      <>
      <Text />
      <h1>{count}</h1>
      <ButtonGroup />
      </>
);
};

export default App;