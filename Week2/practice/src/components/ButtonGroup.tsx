import { useCount } from "../context/CounterProvider";
import Button from "./Button";

const ButtonGroup = () => {

  const { increase, decrease } = useCount();
  return (
      <>
      <Button click = {increase} text = "+1" />
      <Button click = {decrease} text = "-1" />
      </>
  );
};

export default ButtonGroup;