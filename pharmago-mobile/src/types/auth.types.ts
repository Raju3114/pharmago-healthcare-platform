export type Role = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: Role;
  profileImageUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role?: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (response: AuthResponse) => void;
  clearAuth: () => void;
  updateUser: (user: User) => void;
}
