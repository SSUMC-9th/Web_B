export const LpCardSkeleton = () => {
  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg animate-pulse">
      <div className="aspect-square bg-gray-800"></div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>
  );
};
