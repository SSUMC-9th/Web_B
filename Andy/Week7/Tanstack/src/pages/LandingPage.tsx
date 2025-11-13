import { useNavigate } from "react-router-dom";
import { Music, Heart, Users, Sparkles } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-rose-500/20 blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-8 py-20 md:py-32">
          <div className="text-center space-y-8">
            {/* Logo */}
            <div className="inline-block">
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 bg-clip-text text-transparent animate-pulse">
                DOLIGO
              </h1>
            </div>

            {/* Tagline */}
            <p className="text-2xl md:text-3xl text-gray-300 font-light max-w-3xl mx-auto">
              당신의 음악 취향을 공유하고, 새로운 앨범을 발견하세요
            </p>

            {/* Description */}
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              DOLIGO는 음악 애호가들을 위한 소셜 플랫폼입니다.
              <br />
              좋아하는 앨범을 소개하고, 다른 사람들의 취향을 탐색하며,
              <br />
              음악으로 연결되는 새로운 커뮤니티를 경험하세요.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button
                onClick={() => navigate("/signup")}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-2xl hover:scale-105"
              >
                시작하기
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto px-8 py-4 bg-gray-800 text-white rounded-lg font-semibold text-lg hover:bg-gray-700 transition-all border border-gray-700"
              >
                로그인
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          DOLIGO의 특별한 기능
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-pink-500/50 transition-all hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4">
              <Music className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">앨범 공유</h3>
            <p className="text-gray-400">
              좋아하는 앨범을 소개하고 당신만의 음악 스토리를 들려주세요.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-pink-500/50 transition-all hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">좋아요 & 저장</h3>
            <p className="text-gray-400">
              마음에 드는 앨범에 좋아요를 누르고 나중에 다시 찾아보세요.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-pink-500/50 transition-all hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">커뮤니티</h3>
            <p className="text-gray-400">
              같은 취향을 가진 사람들과 연결되고 새로운 음악을 발견하세요.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-pink-500/50 transition-all hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">새로운 발견</h3>
            <p className="text-gray-400">
              다양한 장르와 아티스트를 탐색하며 음악 세계를 넓혀보세요.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="max-w-4xl mx-auto px-8 py-20 text-center">
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            무료로 가입하고 음악 커뮤니티의 일원이 되어보세요
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="px-12 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-2xl hover:scale-105"
          >
            회원가입하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
