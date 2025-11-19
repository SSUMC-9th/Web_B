interface buttonprops {
  click?: () => void;
  text: string;
}
const button = ({click, text} : buttonprops) => {
  return <button onClick={click}>{text}</button>
}

export default button;