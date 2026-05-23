export interface APIResponse<T> {
  data: T;
  count?: number;
}

export interface APIError {
  error: string;
  code?: string;
  details?: string;
}

export type RequestStatus = "idle" | "loading" | "success" | "error";
