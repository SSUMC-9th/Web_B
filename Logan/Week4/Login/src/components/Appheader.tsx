const AppHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="text-lg font-bold text-pink-500">돌려돌려LP판</div>
        <div className="flex items-center gap-2">
          <button className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10">
            로그인
          </button>
          <button className="rounded-md bg-pink-600 px-3 py-1.5 text-sm text-white hover:bg-pink-700">
            회원가입
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
