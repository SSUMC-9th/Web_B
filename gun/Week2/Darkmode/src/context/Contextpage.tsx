
import Navbar from './Navbar';
import ThemeContent from "./ThemeContent";
import { ThemeProvider } from "./ThemeProvider";


export default function Contextpage() {
  return (
    <>
      <ThemeProvider>
        <div className='flex flex-col items-center justify center min-h-screen'>
          <main className = 'flex-1 w-full'>
          <Navbar />
          <ThemeContent/>
          </main>
        </div>
      </ThemeProvider>
    </>
  )
}
