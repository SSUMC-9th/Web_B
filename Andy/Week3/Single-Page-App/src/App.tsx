import './App.css'
const HomePage = () => <h1>홈 페이지</h1>
const AndyPage = () => <h1>앤디 페이지</h1>
const AeongPage = () => <h1>앵 페이지</h1>
const HullPage = () => <h1>헐 페이지</h1>

function App() {
  const { pathname } = window.location;

  switch (pathname) {
    case '/home':
      return <HomePage/>
    case '/andy':
      return <AndyPage/>
    case '/aeong':
      return <AeongPage/>
    case '/hull':
      return <HullPage/>
    default:
      return <h1>404 Not Found</h1>;
  }
}

export default App
