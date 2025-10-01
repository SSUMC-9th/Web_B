interface ButtonProps {
  children: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function Button(
  { children, onClick, disabled }: ButtonProps) {
  return (
    <button
      className="rounded-lg bg-neutral-900 px-6 py-2.5 mx-2 text-white font-medium border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 active:bg-neutral-700 disabled:bg-neutral-950 disabled:text-neutral-600 disabled:cursor-not-allowed disabled:border-neutral-900 transition-all duration-200"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}