import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import UseCallbackPage from "./pages/UseCallbackPage.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UseCallbackPage />
  </StrictMode>,
)
