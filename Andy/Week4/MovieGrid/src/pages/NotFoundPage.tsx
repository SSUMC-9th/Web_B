export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-8">페이지를 찾을 수 없습니다.</p>
      <a href="/" className="text-red-500 hover:underline">
        홈으로 돌아가기
      </a>
    </div>
  );
}