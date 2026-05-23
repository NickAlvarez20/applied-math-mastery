export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  role: "student" | "admin";
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}
