interface ErrorStateProps {
  message?: string;
}

export default function ErrorState({ message = "오류가 발생했습니다" }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <p className="text-red-400 text-lg font-semibold">❌ {message}</p>
        <p className="text-gray-400 mt-2 text-sm">다시 시도해주세요</p>
      </div>
    </div>
  );
}
