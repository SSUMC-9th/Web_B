import './App.css'
import List from "./components/List.tsx";

function App() {
  const name = "홍준우"
  const nickname = "Andy"
  const school = "숭실대학교"
  // as const : 리터럴 타입으로 지정해줌
  const array = ['춘식이', '라이언', '어피치'] as const
  return (
    <>
      <strong className={"school"}>{school}</strong>
      <p className={"description"}>{`${nickname}/${name}`}</p>
      <ul>
        {array.map((item, index) => (
         <List key={index} name={item}/>
        ))}
      </ul>
    </>
  )
}

export default App