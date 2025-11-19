// 사용자 정보 타입
export type User = {
  id: number;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  role?: 'admin' | 'user'; // RBAC를 위한 역할 필드
  createdAt: Date;
  updatedAt: Date;
};

// 인증 상태 타입
export type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
};
