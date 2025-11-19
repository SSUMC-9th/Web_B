interface FabProps { onClick: () => void }
export function FloatingCreateButton({ onClick }: FabProps) {
    return (
        <button
        aria-label="Create LP"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-3xl text-white shadow-xl hover:bg-pink-400"
        onClick={onClick}
        >
        +</button>
    )
}