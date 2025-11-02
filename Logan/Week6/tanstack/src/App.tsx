import "./App.css";
import { useCustomFetch } from "./hooks/useCustomFetch";

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const { data, isPending, isError } = useCustomFetch<User>(
    "https://jsonplaceholder.typicode.com/users/1"
  );
  console.log(isPending);
  if (isError) {
    return <div>응 에러야 빨리고쳐</div>;
  }

  if (isPending) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <h1>Tastack Query</h1>
      {data?.name}
      {/* {JSON.stringify(data)} */}
    </>
  );
}

export default App;
