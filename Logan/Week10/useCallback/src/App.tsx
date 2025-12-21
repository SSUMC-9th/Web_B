import "./App.css";
import UseCallbackPage from "./07-useCallback-memo/UseCallbackPage";
import UseMemoPage from "./08-useMemo/UseMemoPage";

function App() {
  return (
    <main className="flex flex-col justify-center items-center h-dvh">
      {/* <UseCallbackPage /> */}
      <UseMemoPage />
    </main>
  );
}

export default App;
