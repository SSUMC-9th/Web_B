import './App.css'

function App() {
  const name = "홍준우"
  const nickname = "Andy"
  const school = "숭실대학교"
  return (
    <>
      <strong className={"school"}>{school}</strong>
      <p className={"description"}>{`${nickname}/${name}`}</p>
    </>
  )
}

export default App