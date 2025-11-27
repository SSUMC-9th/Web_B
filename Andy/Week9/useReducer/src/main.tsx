import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import UseReducerPage from "./pages/UseReducerPage.tsx";
import UseReducerCompany from "./pages/UseReducerCompany.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UseReducerPage />
    <UseReducerCompany />
  </StrictMode>,
)
