const Divider = ({ text = "OR" }: { text?: string }) => (
  <div className="relative my-5">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-white/10" />
    </div>
    <div className="relative flex justify-center">
      <span className="bg-black px-3 text-xs font-medium uppercase tracking-widest text-gray-400">
        {text}
      </span>
    </div>
  </div>
);

export default Divider;
