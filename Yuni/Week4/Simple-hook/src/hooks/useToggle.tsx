import { useState } from "react";

export default function useToggle() {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen((prev) => !prev);

    return { isOpen, toggle };
}

