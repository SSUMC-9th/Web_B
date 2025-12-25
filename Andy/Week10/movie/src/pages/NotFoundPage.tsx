import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary text-text-primary px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-pink mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">페이지를 찾을 수 없습니다</h2>
        <p className="text-text-tertiary text-lg mb-10 max-w-md mx-auto">
          죄송합니다. 요청하신 페이지가 존재하지 않거나, 잘못된 경로로 접근하셨습니다.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary-pink hover:bg-opacity-80 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
