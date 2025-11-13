import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import type { User } from '../types/auth.types';
import { STORAGE_KEYS } from '../constants/key';
import { getMe } from '../apis/auth';

export default function GoogleCallbackPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState('');

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const userId = searchParams.get('userId');
        const name = searchParams.get('name');
        const email = searchParams.get('email');
        const avatar = searchParams.get('avatar');

        console.log('🔐 Google 콜백 받음:', { accessToken, userId, name, email });

        if (accessToken && userId && name) {
            (async () => {
                try {
                    // Refresh Token 저장
                    if (refreshToken) {
                        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
                    }

                    // 임시 사용자 정보로 로그인 (getMe 호출을 위해 필요)
                    const tempUser: User = {
                        id: parseInt(userId),
                        email: email || '',
                        name: name,
                        avatar: avatar || undefined,
                        role: 'user',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };

                    login(accessToken, tempUser);

                    // getMe API로 완전한 사용자 정보 조회
                    try {
                        const meResponse = await getMe();
                        if (meResponse.status) {
                            // 서버에서 받은 완전한 정보로 user 업데이트
                            const completeUser: User = {
                                id: meResponse.data.id,
                                name: meResponse.data.name,
                                email: meResponse.data.email,
                                bio: meResponse.data.bio,
                                avatar: meResponse.data.avatar,
                                role: 'user',
                                createdAt: new Date(meResponse.data.createdAt),
                                updatedAt: new Date(meResponse.data.updatedAt),
                            };
                            login(accessToken, completeUser);
                            console.log('✅ 완전한 사용자 정보 조회 성공:', completeUser);
                        }
                    } catch (meError) {
                        console.warn('⚠️ getMe 호출 실패, 기본 정보로 진행:', meError);
                        // getMe 실패해도 이미 로그인된 상태이므로 계속 진행
                    }

                    console.log('✅ Google 로그인 성공!', { user: tempUser, token: accessToken });

                    // 홈으로 리다이렉트
                    navigate('/', { replace: true });
                } catch (err) {
                    console.error('❌ Google 콜백 처리 에러:', err);
                    setError('Google 로그인 처리 중 오류가 발생했습니다.');
                }
            })();
        } else {
            console.error('❌ 필수 파라미터 누락:', { accessToken, userId, name });
            setError('로그인 정보가 불완전합니다. 다시 시도해주세요.');
        }
    }, [searchParams, login, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
            <div className="text-center">
                {error ? (
                    <>
                        <div className="text-red-500 text-lg mb-4">{error}</div>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                        >
                            로그인 페이지로 돌아가기
                        </button>
                    </>
                ) : (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto"></div>
                        <p className="text-gray-400">Google 로그인 처리 중...</p>
                    </>
                )}
            </div>
        </div>
    );
}
