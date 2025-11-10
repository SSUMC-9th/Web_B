import React from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm
     transition-opacity duration-300 z-40 
     ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={onClose}
    >
      사이드바입니다.
    </div>
  );
};

export default Sidebar;
