export default function SkeletonCard() {
  return (
    <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
      {/* Shimmer animation with gradient */}
      <div className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-[length:200%_100%] animate-shimmer" />
    </div>
  );
}
