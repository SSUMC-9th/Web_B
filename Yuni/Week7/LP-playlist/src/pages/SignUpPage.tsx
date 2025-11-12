import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { emailSchema, passwordSchema, nicknameSchema } from "../schemas/signup.schema";
import { postSignup } from "../apis/auth";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // 폼 데이터
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // 에러 상태
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordCheckError, setPasswordCheckError] = useState("");
  const [nicknameError, setNicknameError] = useState("");

  // 이메일 유효성 검사
  const validateEmail = (value: string) => {
    try {
      emailSchema.parse(value);
      setEmailError("");
    } catch (error: any) {
      setEmailError(error.issues?.[0]?.message || error.errors?.[0]?.message || "이메일이 유효하지 않습니다");
    }
  };

  // 비밀번호 유효성 검사
  const validatePassword = (value: string) => {
    try {
      passwordSchema.parse(value);
      setPasswordError("");
    } catch (error: any) {
      setPasswordError(error.issues?.[0]?.message || error.errors?.[0]?.message || "비밀번호가 유효하지 않습니다");
    }
  };

  // 비밀번호 확인 검사
  const validatePasswordCheck = (value: string) => {
    if (password !== value) {
      setPasswordCheckError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordCheckError("");
    }
  };

  // 닉네임 유효성 검사
  const validateNickname = (value: string) => {
    try {
      nicknameSchema.parse(value);
      setNicknameError("");
    } catch (error: any) {
      setNicknameError(error.issues?.[0]?.message || error.errors?.[0]?.message || "닉네임이 유효하지 않습니다");
    }
  };

  // 단계별 다음 버튼 활성화 조건
  const isStep1Valid = email && !emailError;
  const isStep2Valid = password && passwordCheck && !passwordError && !passwordCheckError;
  const isStep3Valid = nickname && !nicknameError;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await postSignup({
        email,
        password,
        name: nickname,
        avatar: profileImage || undefined,
      });

      if (response.status) {
        console.log('✅ 회원가입 성공!', response.data);
        alert('회원가입이 완료되었습니다!');
        navigate('/login');
      } else {
        alert(response.message || '회원가입에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('❌ 회원가입 실패:', error);
      alert(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-4 mb-8 relative">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
              className="text-white hover:text-gray-300 transition absolute left-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-2xl font-semibold">회원가입 ({step}/3)</h2>
          </div>

          {step === 1 ? (
            <>
              <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition mb-6">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium">구글 로그인</span>
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gray-700"></div>
                <span className="text-gray-500 text-sm">OR</span>
                <div className="flex-1 h-px bg-gray-700"></div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg mb-6">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-white">{email}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* 1단계: 이메일 */}
            {step === 1 && (
              <>
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  type="email"
                  placeholder="이메일을 입력해주세요!"
                  className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-pink-500 transition mb-4 placeholder-gray-500"
                />
                {emailError && (
                  <div className="text-red-500 text-sm mb-4">{emailError}</div>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStep1Valid}
                  className={`w-full px-6 py-3 rounded-lg font-medium ${
                    !isStep1Valid
                      ? 'bg-gray-600 text-white cursor-not-allowed opacity-50'
                      : 'bg-gray-800 text-white hover:bg-gray-700 transition'
                  }`}
                >
                  다음
                </button>
              </>
            )}

            {/* 2단계: 비밀번호 */}
            {step === 2 && (
              <>
                <input
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  type="password"
                  placeholder="비밀번호를 입력해주세요!"
                  className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-pink-500 transition mb-4 placeholder-gray-500"
                />
                {passwordError && (
                  <div className="text-red-500 text-sm mb-4">{passwordError}</div>
                )}

                <input
                  value={passwordCheck}
                  onChange={(e) => {
                    setPasswordCheck(e.target.value);
                    validatePasswordCheck(e.target.value);
                  }}
                  type="password"
                  placeholder="비밀번호를 다시 한 번 입력해주세요!"
                  className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-pink-500 transition mb-4 placeholder-gray-500"
                />
                {passwordCheckError && (
                  <div className="text-red-500 text-sm mb-4">{passwordCheckError}</div>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStep2Valid}
                  className={`w-full px-6 py-3 rounded-lg font-medium ${
                    !isStep2Valid
                      ? 'bg-gray-600 text-white cursor-not-allowed opacity-50'
                      : 'bg-gray-800 text-white hover:bg-gray-700 transition'
                  }`}
                >
                  다음
                </button>
              </>
            )}

            {/* 3단계: 프로필 이미지 + 닉네임 */}
            {step === 3 && (
              <>
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-pink-500 rounded-full p-2 cursor-pointer hover:bg-pink-600 transition">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-gray-400 text-sm">프로필 이미지를 추가해주세요</p>
                </div>

                <input
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    validateNickname(e.target.value);
                  }}
                  type="text"
                  placeholder="닉네임을 입력해주세요!"
                  className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-pink-500 transition mb-4 placeholder-gray-500"
                />
                {nicknameError && (
                  <div className="text-red-500 text-sm mb-4">{nicknameError}</div>
                )}

                <button
                  type="submit"
                  disabled={!isStep3Valid}
                  className={`w-full px-6 py-3 rounded-lg font-medium ${
                    !isStep3Valid
                      ? 'bg-gray-600 text-white cursor-not-allowed opacity-50'
                      : 'bg-pink-500 text-white hover:bg-pink-600 transition'
                  }`}
                >
                  회원가입 완료
                </button>
              </>
            )}
          </form>
        </div>
      </main>
    </>
  );
}
