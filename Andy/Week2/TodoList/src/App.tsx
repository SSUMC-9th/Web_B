import './App.css'
import TodoContainer from './components/TodoContainer.tsx'
import { TodoProvider } from './providers/TodoProvider.tsx'

function AppContent() {

  return (
    <TodoProvider>
      <div className="todo-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 className="todo-container__header">할 일 목록</h1>
        </div>
        <TodoContainer />
      </div>
    </TodoProvider>
  );
}

function App() {
  return (
    <AppContent />
  )
}

export default App
