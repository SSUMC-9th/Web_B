import NavBar from "./components/NavBar.tsx";
import ColList from "./components/ColList.tsx";
import Modal from "./components/Modal.tsx";
import {Provider} from "react-redux";
import store from "./store/store.ts";

function App() {
  return (
    <Provider store={store}>
      <NavBar />
      <ColList />
      <Modal />
    </Provider>
  )
}

export default App;