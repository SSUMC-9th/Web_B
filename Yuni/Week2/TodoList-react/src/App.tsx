import './App.css'
import { useList } from './context/CounterProvider';
import InputForm from './components/inputForm'
import ListGroup from './components/ListGroup';

function App() {
  const context = useList();
  return (
    <div className="App">
      <div className="todo">
        <h1 className="todo__title">YONG TODO</h1>
        {/*입력창*/}
        <InputForm 
          handleSubmmit={context.handleSubmmit}
          input={context.input}
          setInput={context.setInput}
        />
        <ListGroup
          todos = {context.todos}
          completedTasks={context.completedTasks}
          handleCompleted={context.handleCompleted}
          handleDelete={context.handleDelete}
        />
      </div>
    </div>
  )
}

export default App