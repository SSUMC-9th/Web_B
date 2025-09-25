import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar() {
  const themeContext = useContext(ThemeContext);

  return (
    <nav>
      <h2>다크 모드</h2>
      <button
        onClick={() => themeContext?.toggleTheme()}
      >
        {themeContext?.theme === 'DARK' ? '☀️' : '🌙'}
      </button>
    </nav>
  );
}
