import React from "react";

const FloatingButton = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div>
      <button
        className="fixed bottom-15 right-15
        bg-pink-500 hover:bg-pink-300
        text-white p-3 rounded-full shadow-lg
        transition-all duration-1000
        "
        onClick={scrollToTop}
      >
        젤위로.
      </button>
    </div>
  );
};

export default FloatingButton;
