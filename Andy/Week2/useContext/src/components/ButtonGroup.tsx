interface ButtonGroupProps {
  handleIncrement?: () => void;
  handleDecrement?: () => void;
}

export const ButtonGroup = ({
  handleIncrement,
  handleDecrement,
}: ButtonGroupProps) => {
  return (
    <div>
      <button onClick={handleDecrement}>-</button>
      <button onClick={handleIncrement}>+</button>
    </div>
  );
}