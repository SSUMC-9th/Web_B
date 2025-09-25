import './App.css'
import List, {type Tech} from './components/List'; //Tech 타입 import

function App() {
  const nickname = '유니';
  const sweetPotato = "고구마";
  const array = ['REACT', 'NEXT', 'VUE', 'SVELTE', 'ANGULAR', 'REACT-NATIVE'] as const;
  return (
    <>
      <strong className ='school'>숭실대학교</strong>
      <p style = {{
        color:'purple', 
        fontWeight:'bold', 
        fontSize:'3rem'}}
      >
        {nickname}/남지윤
      </p>
      <h1>{`${nickname}는 ${sweetPotato}를 좋아합니다.`}</h1>
      <ul>
        {array.map((item, idx) => (
          <List key={idx} tech={item} /> //item의 타입은 기본적으로 string타입으로 추론 
        ))} 
      </ul>
    </>
  )
}

export default App