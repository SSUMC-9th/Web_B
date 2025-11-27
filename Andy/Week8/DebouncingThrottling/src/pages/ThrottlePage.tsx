import {useEffect, useState} from "react";
import useThrottle from "../hooks/useThrottle.ts";

const ThrottlePage = () => {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useThrottle(() => {
    setScrollY(window.scrollY);
  }, 2000);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Throttle Page</h1>
      <p>ScrollY: {scrollY}px</p>
    </div>
  )
};

export default ThrottlePage;