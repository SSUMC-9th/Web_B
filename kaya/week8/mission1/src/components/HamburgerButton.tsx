interface HamburgerProps {
    onClick: () => void;
    isOpen: boolean;
}


export const HamburgerButton = ({onClick, isOpen}: HamburgerProps) => {
    return (
        <button>
            <div className="w-6 h-5 flex flex-col justify-between">
                <span className="w-full h-1 bg-black rounded-full"></span>
                <span className="w-full h-1 bg-black rounded-full"></span>
                <span className="w-full h-1 bg-black rounded-full"></span>
            </div>
        </button>
    )
}