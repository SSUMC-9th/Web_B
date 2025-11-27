import NavBar from "./components/NavBar.tsx";
import CarList from "./components/CarList.tsx";
import Modal from "./components/Modal.tsx";
import {Provider} from "react-redux";
import store from "./store/store.ts";

function App() {
  return (
    <Provider store={store}>
      <NavBar />
      <CarList />
      <Modal />
    </Provider>
  )
}

export default App;