import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

interface ThemeContentProps {
  className?: string;
}

export default function ThemeContent({ className }: ThemeContentProps) {
  const themeContext = useContext(ThemeContext);

  return (
    <div className={className} style={{
      backgroundColor: themeContext?.theme === 'DARK' ? '#333' : '#fff',
      color: themeContext?.theme === 'DARK' ? '#fff' : '#333',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h3>현재: {themeContext?.theme}</h3>
    </div>
  );
}