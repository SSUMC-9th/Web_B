import { useAuth } from '../hooks/useAuth';
import { axiosInstance } from '../apis/common';
import { useState } from 'react';

/**
 * DashboardPage - Protected Route 예제
 * 로그인한 사용자만 접근 가능한 페이지입니다
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState('');

  const handlePlayMusic = async () => {
    try {
      setTestResult('음악을 재생하는 중...');
      // 사용자 정보 조회 API 요청
      const response = await axiosInstance.get('/users/me');
      setTestResult('✅ 음악 재생 성공!');
    } catch (error: any) {
      setTestResult('❌ 음악 재생 실패: ' + (error.message || '알 수 없는 에러'));
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">대시보드</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 사용자 정보 카드 */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">사용자 정보</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">이메일</p>
                <p className="text-white font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">이름</p>
                <p className="text-white font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">역할 (Role)</p>
                <p className="text-white font-medium">
                  {user?.role === 'admin' ? (
                    <span className="text-yellow-500">관리자 (Admin)</span>
                  ) : (
                    <span className="text-blue-500">일반 사용자 (User)</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* 인증 상태 카드 */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">인증 상태</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">상태</p>
                <p className="text-green-500 font-medium">✓ 로그인됨</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">접근 권한</p>
                <p className="text-white font-medium">Protected Route 접근 가능</p>
              </div>
            </div>
          </div>
        </div>

        {/* 음악 재생 */}
        <div className="bg-gray-900 rounded-lg p-6 border border-purple-500 border-opacity-30 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-purple-500">🎵 음악 재생</h2>
          <div className="space-y-4">
            <p className="text-gray-300">
              아래 버튼을 클릭하면 음악이 재생됩니다.<br/>
              <span className="text-purple-400">30초 이상 경과 후</span> 버튼을 클릭하면 토큰이 만료되어 자동으로 갱신됩니다.
            </p>
            <button
              onClick={handlePlayMusic}
              className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
            >
              ▶️ 음악 재생하기
            </button>
            {testResult && (
              <div className="bg-gray-800 rounded p-4 mt-3">
                <p className="text-sm font-mono text-gray-300">{testResult}</p>
              </div>
            )}
          </div>
        </div>

        {/* Protected Route 설명 */}
        <div className="bg-gray-900 rounded-lg p-6 border border-pink-500 border-opacity-30">
          <h2 className="text-xl font-semibold mb-4 text-pink-500">Protected Route란?</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              이 페이지는 <span className="text-pink-500 font-semibold">Protected Route</span>로 보호되어 있습니다.
            </p>
            <p>
              즉, 유효한 토큰(access token)이 없으면 이 페이지에 접근할 수 없습니다.
            </p>
            <p>
              만약 로그아웃 후 이 페이지로 직접 접근하려고 하면, 자동으로 로그인 페이지로 리다이렉트됩니다.
            </p>
            <div className="bg-gray-800 rounded p-4 mt-4">
              <p className="text-sm font-mono text-gray-400">
                &lt;ProtectedRoute&gt;<br/>
                &nbsp;&nbsp;&lt;DashboardPage /&gt;<br/>
                &lt;/ProtectedRoute&gt;
              </p>
            </div>
          </div>
        </div>

        {/* RBAC 설명 */}
        {user?.role === 'admin' && (
          <div className="bg-yellow-900 bg-opacity-20 rounded-lg p-6 border border-yellow-500 border-opacity-30 mt-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-500">관리자 전용 컨텐츠</h2>
            <p className="text-gray-300">
              당신은 관리자이므로 이 섹션이 표시됩니다. 이는 <span className="text-yellow-500 font-semibold">RBAC (Role-Based Access Control)</span>의 예시입니다.
            </p>
            <div className="bg-gray-800 rounded p-4 mt-4">
              <p className="text-sm font-mono text-gray-400">
                &lt;ProtectedRoute requiredRole="admin"&gt;<br/>
                &nbsp;&nbsp;&lt;AdminPanel /&gt;<br/>
                &lt;/ProtectedRoute&gt;
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
