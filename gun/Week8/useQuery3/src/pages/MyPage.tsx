import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AutoContext";
// 필요한 Hooks 및 API 함수 임포트
import useGetMyInfo from "../hooks/queries/useGetMyInfo"; 
// ⭐ 임포트 경로 수정 ⭐
import { useUpdateUser } from "../hooks/mutations/userMutation"; 
import { User, Image, AlignLeft, Upload, LogOut, CheckCircle, AlertTriangle, Edit, Save, X } from "lucide-react"; 

const MyPage = () => {
    const { logout, accessToken } = useAuth(); 
    const navigate = useNavigate();

    // ⭐ 1. 모드 토글 상태 추가: false면 조회 모드, true면 수정 모드 ⭐
    const [isEditing, setIsEditing] = useState(false);

    // 2. 조회 훅: 사용자 정보를 불러옵니다.
    const { 
        data: meResponse, 
        isPending: isMePending, 
        isError: isMeError,
        refetch 
    } = useGetMyInfo(accessToken);
    const initialUser = meResponse?.data;

    // 3. 수정 폼 상태 및 파일 관련 상태
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    // 아바타는 URL 또는 Base64 Data URL을 저장
    const [avatar, setAvatar] = useState(''); 
    const [selectedFileName, setSelectedFileName] = useState('');
    const [fileError, setFileError] = useState<string | null>(null);

    // 4. 수정 훅: React Query의 mutate 사용
    const { mutate: updateUserMutate, isPending: isUpdating } = useUpdateUser();

    // 5. 오류 및 성공 메시지 상태
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // 데이터 로드 시 폼 상태 초기화 (초기 로드 또는 수정 취소 시 사용)
    useEffect(() => {
        if (initialUser) {
            setName(initialUser.name || '');
            setBio(initialUser.bio || '');
            setAvatar(initialUser.avatar || '');
        }
    }, [initialUser]);

    /** 파일 선택 시 호출되어 이미지를 Data URL (Base64)로 변환합니다. */
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileError(null);
        const file = e.target.files?.[0];
        if (!file) {
            setSelectedFileName('');
            return;
        }

        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            const errorMsg = `파일 크기가 너무 큽니다. 5MB 이하의 파일을 선택해 주세요. (현재: ${(file.size / 1024 / 1024).toFixed(2)}MB)`;
            console.error(errorMsg);
            setFileError(errorMsg);
            setSelectedFileName('');
            setAvatar(initialUser?.avatar || ''); 
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatar(reader.result as string);
            setSelectedFileName(file.name);
        };
        reader.onerror = () => {
            const errorMsg = "파일을 읽는 데 실패했습니다.";
            console.error(errorMsg);
            setFileError(errorMsg);
            setSelectedFileName('');
            setAvatar(initialUser?.avatar || '');
        };
        reader.readAsDataURL(file);
    };

    /** 수정 취소 핸들러 */
    const handleCancelEdit = () => {
        // 로컬 상태를 initialUser 데이터로 복원
        if (initialUser) {
            setName(initialUser.name || '');
            setBio(initialUser.bio || '');
            setAvatar(initialUser.avatar || '');
        }
        setSelectedFileName('');
        setFileError(null);
        setMessage(null);
        setIsEditing(false); // 조회 모드로 전환
    }

    /** 사용자 정보 저장 핸들러 */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!name.trim()) {
            setMessage({ type: 'error', text: '닉네임은 필수 항목입니다.' });
            return;
        }
        if (fileError) {
            setMessage({ type: 'error', text: '파일 오류를 먼저 해결해 주세요.' });
            return;
        }

        updateUserMutate({ name, bio, avatar }, {
            onSuccess: () => {
                setMessage({ type: 'success', text: '프로필 정보가 성공적으로 업데이트되었습니다.' });
                setSelectedFileName('');
                // 쿼리 무효화 후 데이터 리로드 -> useEffect가 상태를 다시 초기화함
                refetch(); 
                setIsEditing(false); // ⭐ 저장 후 조회 모드로 전환 ⭐
            },
            onError: (error) => {
                setMessage({ type: 'error', text: '업데이트 실패: ' + (error as Error).message });
            }
        });
    };
    
    /** 로그아웃 핸들러 */
    const handleLogout = async () => {
        await logout();
        navigate("/");
    }


    if (isMePending) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-indigo-300 font-semibold">사용자 정보 로딩 중...</div>;
    }

    if (isMeError || !initialUser) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-900 p-10 text-center text-red-400">프로필 정보를 불러올 수 없습니다. 로그인 상태를 확인해 주세요.</div>;
    }
    
    // UI
    return (
        // ⭐ 배경색 gray-900 적용 ⭐
        <div className="min-h-screen bg-gray-900 p-4 pt-16">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto border border-indigo-100/50">
                
                <h2 className="text-3xl font-extrabold text-indigo-700 mb-2 text-center">
                    {isEditing ? '프로필 수정' : '마이페이지'}
                </h2>
                <p className="text-gray-500 mb-8 text-center text-sm">
                    {isEditing ? '변경할 정보를 입력하고 저장하세요.' : '내 프로필 정보를 확인하고 수정할 수 있습니다.'}
                </p>

                {/* 메시지 표시 영역 */}
                {message && (
                    <div className={`flex items-center p-4 mb-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                        message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'
                    }`}>
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-3" /> : <AlertTriangle className="w-5 h-5 mr-3" />}
                        {message.text}
                    </div>
                )}

                {/* 폼 시작: isEditing이 true일 때만 handleSubmit을 연결합니다. */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* ⭐ 1. 아바타 & 닉네임/소개 영역 (가로형) ⭐ */}
                    {/* isEditing 여부와 관계없이 가로 레이아웃 유지 */}
                    <div className="flex flex-row space-x-8 items-start border-b border-gray-200 pb-8 mb-8">
                        
                        {/* 아바타 (왼쪽 고정, 수정 모드일 때 파일 선택 영역 포함) */}
                        <div className="w-1/3 flex-shrink-0 flex flex-col items-center space-y-4">
                            <img 
                                src={isEditing ? avatar : initialUser.avatar || "https://placehold.co/100x100/94A3B8/ffffff?text=Avatar"} 
                                alt="아바타 미리보기" 
                                className="w-28 h-28 rounded-full object-cover ring-4 ring-indigo-500 shadow-lg transition duration-300 transform hover:scale-105"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "https://placehold.co/100x100/94A3B8/ffffff?text=Error";
                                }}
                            />
                             {/* 3. 아바타 파일 선택 (수정 모드일 때만 표시) */}
                            {isEditing && (
                                <div className="p-3 border border-gray-100 rounded-xl bg-indigo-50/50 shadow-inner w-full max-w-xs">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">새 프로필 사진 선택</h3>
                                    
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="hidden"
                                        disabled={isUpdating}
                                    />
                                    <label 
                                        htmlFor="avatar-upload"
                                        className={`w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-bold rounded-lg transition duration-150 cursor-pointer shadow-md ${
                                            isUpdating 
                                                ? 'bg-gray-300 text-gray-500' 
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                    >
                                        <Upload className="w-4 h-4" />
                                        <span>{selectedFileName ? '이미지 변경됨' : '이미지 파일 선택'}</span>
                                    </label>
                                    
                                    <p className="mt-2 text-xs text-gray-600 truncate">
                                        {selectedFileName 
                                            ? selectedFileName
                                            : (avatar.length > 50 && avatar.startsWith('data:image')) 
                                                ? 'Base64 이미지 로드됨' 
                                                : `현재 아바타: ${initialUser.avatar ? 'URL 사용 중' : '기본 아바타'}`
                                        }
                                    </p>
                                    
                                    {/* 파일 오류 메시지 */}
                                    {fileError && (
                                        <p className="mt-2 text-xs font-medium text-red-600">
                                            <AlertTriangle className="w-3 h-3 inline mr-1"/> {fileError}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {/* 2. 닉네임 및 소개 필드 (오른쪽 확장) */}
                        <div className="w-2/3 space-y-4">
                            
                            {/* 닉네임 */}
                            <div className="space-y-1">
                                <label htmlFor="name-input" className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                                    <User className="w-4 h-4 text-indigo-500" />
                                    <span>닉네임 (필수)</span>
                                </label>
                                {isEditing ? (
                                    <input
                                        id="name-input"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="새 닉네임을 입력하세요"
                                        className="text-black w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
                                        disabled={isUpdating}
                                    />
                                ) : (
                                    // ⭐ 조회 모드: 수정 모드와 유사한 간격 유지 ⭐
                                    <p className="w-full p-3 bg-gray-100 rounded-lg text-lg font-bold text-gray-800">{initialUser.name}</p>
                                )}
                            </div>

                            {/* 한 줄 소개 */}
                            <div className="space-y-1">
                                <label htmlFor="bio-input" className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                                    <AlignLeft className="w-4 h-4 text-indigo-500" />
                                    <span>한 줄 소개</span>
                                </label>
                                {isEditing ? (
                                    <textarea
                                        id="bio-input"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="자신을 소개하는 한 줄을 입력하세요 (선택 사항)"
                                        rows={3}
                                        className="text-black w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition resize-none shadow-sm"
                                        disabled={isUpdating}
                                    />
                                ) : (
                                    // ⭐ 조회 모드: 수정 모드와 유사한 간격 유지 ⭐
                                    <p className="w-full p-3 bg-gray-100 rounded-lg text-gray-600 whitespace-pre-wrap italic">{initialUser.bio || '작성된 소개가 없습니다.'}</p>
                                )}
                            </div>
                            
                            {/* 이메일 (조회 모드에서만 표시) */}
                            {!isEditing && (
                                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                                    이메일: <span className="font-medium text-gray-800">{initialUser.email}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* 4. 버튼 섹션 (폼 내부) */}
                    <div className="pt-4 flex justify-between space-x-4">
                        {isEditing ? (
                            <>
                                {/* 저장 버튼 (type="submit") */}
                                <button
                                    type="submit"
                                    disabled={isUpdating || !name.trim() || !!fileError}
                                    className="flex-1 py-3 bg-indigo-600 text-white font-bold text-lg rounded-xl hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-300 shadow-xl"
                                >
                                    {isUpdating ? '저장 중...' : <span className="flex items-center justify-center"><Save className="w-5 h-5 mr-2" /> 저장</span>}
                                </button>
                                {/* 취소 버튼 (type="button") */}
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    disabled={isUpdating}
                                    className="flex-1 py-3 bg-white text-gray-700 font-bold text-lg rounded-xl border border-gray-300 hover:bg-gray-100 transition duration-300 disabled:bg-gray-200 shadow-md"
                                >
                                    <span className="flex items-center justify-center"><X className="w-5 h-5 mr-2" /> 취소</span>
                                </button>
                            </>
                        ) : (
                            // 조회 모드일 때는 이 영역은 비워둡니다.
                            null 
                        )}
                    </div>
                </form>

                {/* 5. 조회 모드 버튼 (폼 외부, 버그 방지) */}
                {!isEditing && (
                    <button
                        type="button" 
                        onClick={() => setIsEditing(true)}
                        className="w-full py-3 bg-indigo-500 text-white font-bold text-lg rounded-xl hover:bg-indigo-600 transition duration-300 shadow-lg mt-4"
                    >
                        <span className="flex items-center justify-center"><Edit className="w-5 h-5 mr-2" /> 프로필 수정</span>
                    </button>
                )}

                {/* 로그아웃 버튼 (항상 표시) */}
                <button
                    className="
                        w-full 
                        mt-4 
                        py-3 
                        flex items-center justify-center
                        bg-white 
                        text-red-500 
                        text-sm 
                        font-semibold 
                        rounded-xl 
                        border border-red-200
                        transition duration-300 ease-in-out
                        hover:bg-red-50
                        focus:outline-none focus:ring-4 focus:ring-red-100
                    "
                    onClick={handleLogout}
                    disabled={isUpdating} // 수정 중일 때는 로그아웃 방지
                >
                    <LogOut className="w-5 h-5 mr-2" />
                    로그아웃
                </button>
            </div>
        </div>
    );
};

export default MyPage;