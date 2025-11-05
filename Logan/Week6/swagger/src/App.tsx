import "./App.css";

interface Pet {
  id: number;
  name: string;
  category?: string;
  photoUrls: string[];
  tags?: Tag[];
  status?: Status;
}

interface Tag {
  id: number;
  name: string;
}

type Status = "available" | "pending" | "sold";

import { useState } from "react";

function App() {
  const [pets, setPets] = useState<Pet[]>([]);
  return (
    <>
      <h1>Pets</h1>
      <ul>
        {pets.map((pet) => (
          <li key={pet.id}>{pet.name}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
