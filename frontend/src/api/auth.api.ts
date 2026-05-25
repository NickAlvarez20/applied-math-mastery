import client from "./client";
import { apiV1 } from "./paths";
import type {
  User,
  AuthTokens,
  LoginPayload,
  RegisterPayload,
} from "@/types/user.types";

interface AuthResponse {
  data: User;
  token: string;
}

export const authAPI = {
  register: (payload: RegisterPayload) =>
    client.post<AuthResponse>(apiV1("/auth/register"), payload),

  login: (payload: LoginPayload) =>
    client.post<AuthResponse>(apiV1("/auth/login"), payload),

  logout: () => client.delete(apiV1("/auth/logout")),

  refresh: (refreshToken: string) =>
    client.post<{ tokens: AuthTokens }>(apiV1("/auth/refresh"), {
      refreshToken,
    }),
};
