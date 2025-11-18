// src/pages/home.tsx
const HomePage = () => {
  return <>
  <div className="min-h-screen flex flex-col items-center justify-center gap-30 bg-gradient-to-br from-slate-600 via-slate-300 to-slate-100 text-slate-800 px-4 py-10">
        <h1 className="text-4xl font-black tracking-tight">이것은 홈페이지요</h1>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/승환"
            className="inline-flex items-center rounded-xl bg-slate-900 text-white px-4 py-2 shadow transition hover:bg-slate-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            승환이 먹으러가자~!
          </a>
          <a
            href="/장준영"
            className="inline-flex items-center rounded-xl bg-emerald-600 text-white px-4 py-2 shadow transition hover:bg-emerald-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            준영이 먹으러가자~!
          </a>
        </div>
      </div>
  </>
  };

export default HomePage;