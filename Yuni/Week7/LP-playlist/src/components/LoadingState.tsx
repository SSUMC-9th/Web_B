export default function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        <p className="mt-4 text-gray-400">로딩 중...</p>
      </div>
    </div>
  );
}
