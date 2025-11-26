import {Provider} from 'react-redux'
import './App.css'
import Navbar from './components/Navbar';
import CartList from './components/CartList';
import store from './store/store';


function App() {
  return (
    <Provider store={store}>
      <Navbar/>
      <CartList/>
    </Provider>
  )
}

export default App
