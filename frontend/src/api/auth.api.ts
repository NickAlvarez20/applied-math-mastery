import client from "./client";
import type {
  User,
  AuthTokens,
  LoginPayload,
  RegisterPayload,
} from "@/types/user.types";

export const authAPI = {
  register: (payload: RegisterPayload) =>
    client.post<{ data: User; tokens: AuthTokens }>(
      "/api/v1/auth/register",
      payload,
    ),

  login: (payload: LoginPayload) =>
    client.post<{ data: User; tokens: AuthTokens }>(
      "/api/v1/auth/login",
      payload,
    ),

  logout: () => client.delete("/api/v1/auth/logout"),

  refresh: (refreshToken: string) =>
    client.post<{ tokens: AuthTokens }>("/api/v1/auth/refresh", {
      refreshToken,
    }),
};
