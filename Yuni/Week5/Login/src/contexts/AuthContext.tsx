import { createContext, useCallback, useEffect, useState } from 'react';
import type { AuthContextType, User } from '../types/auth.types';

// AuthContext 생성
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 로컬 스토리지에서 토큰 복원
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setIsLoading(false);
  }, []);

  // 로그인 처리
  const login = useCallback((accessToken: string, user: User) => {
    setAccessToken(accessToken);
    setUser(user);

    // 로컬 스토리지에 저장
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
  }, []);

  // 로그아웃 처리
  const logout = useCallback(() => {
    setAccessToken(null);
    setUser(null);

    // 로컬 스토리지에서 제거
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }, []);

  const value: AuthContextType = {
    user,
    accessToken,
    isLoading,
    isAuthenticated: !!accessToken,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
