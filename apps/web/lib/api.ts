import { clearAuthToken, getAuthToken, setAuthToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export interface User {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export class ApiError extends Error {
  readonly status: number;
  readonly userMessage: string;
  readonly body?: string;

  constructor(status: number, userMessage: string, body?: string) {
    super(userMessage);
    this.name = 'ApiError';
    this.status = status;
    this.userMessage = userMessage;
    this.body = body;
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

export function isUnauthorizedError(err: unknown): boolean {
  return isApiError(err) && err.status === 401;
}

export function getErrorMessage(err: unknown): string {
  if (isApiError(err)) return err.userMessage;
  if (err instanceof Error) return err.message;
  return 'Something went wrong';
}

export function parseApiError(status: number, body: string): ApiError {
  if (status === 401) {
    try {
      const parsed = JSON.parse(body) as { error?: string };
      if (parsed.error) {
        if (parsed.error === 'Unauthorized') {
          return new ApiError(status, 'Session expired. Please sign in again.', body);
        }
        return new ApiError(status, parsed.error, body);
      }
    } catch {
      /* not JSON */
    }
    return new ApiError(status, 'Session expired. Please sign in again.', body);
  }
  if (status >= 500) {
    return new ApiError(status, 'Server error. Try again in a moment.', body);
  }

  try {
    const parsed = JSON.parse(body) as { error?: string };
    if (parsed.error) {
      return new ApiError(status, parsed.error, body);
    }
  } catch {
    /* not JSON */
  }

  const trimmed = body.trim().slice(0, 120);
  if (trimmed) {
    return new ApiError(status, trimmed, body);
  }

  return new ApiError(status, `Request failed (${status})`, body);
}

export { setAuthToken, getAuthToken, clearAuthToken };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  let res: Response;

  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(0, 'Cannot reach server. Check your connection.');
  }

  if (!res.ok) {
    const body = await res.text();
    throw parseApiError(res.status, body || res.statusText);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  register: (email: string, password: string, displayName?: string) =>
    request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  listConversations: () => request<Conversation[]>('/api/conversations'),

  createConversation: (title?: string) =>
    request<Conversation>('/api/conversations', {
      method: 'POST',
      body: JSON.stringify(title ? { title } : {}),
    }),

  deleteConversation: (id: string) =>
    request<void>(`/api/conversations/${id}`, { method: 'DELETE' }),

  listMessages: (conversationId: string) =>
    request<Message[]>(`/api/conversations/${conversationId}/messages`),

  sendMessage: (conversationId: string, content: string) =>
    request<{ user: Message; assistant: Message }>(
      `/api/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        body: JSON.stringify({ content }),
      },
    ),
};
