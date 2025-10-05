import Navbar from './Navbar';
import ThemeContent from './ThemeContent';
import {ThemeProvider} from "../context/ThemeProvider.tsx";

export default function ContextPage() {

  return (
    <ThemeProvider className="flex flex-col items-center justify-center min-h-screen">
      <Navbar />
      <ThemeContent className="flex-1" />
    </ThemeProvider>
  )
}