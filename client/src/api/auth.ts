import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import { logger } from '@lark-apaas/client-toolkit/logger';
import type {
  RegisterRequest,
  LoginRequest,
  User,
  GoogleAuthStatus,
} from '@shared/api.interface';

// Global CSRF protection: add X-Requested-With header to all non-GET requests
axiosForBackend.interceptors.request.use((config) => {
  const method = (config.method || 'get').toLowerCase();
  if (method !== 'get') {
    config.headers.set('X-Requested-With', 'XMLHttpRequest');
  }
  return config;
});

const USER_KEY = 'globalecom_user';

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__ls_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function getStoredUser(): User | null {
  if (!isLocalStorageAvailable()) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User): void {
  if (!isLocalStorageAvailable()) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeStoredUser(): void {
  if (!isLocalStorageAvailable()) return;
  localStorage.removeItem(USER_KEY);
}

export async function register(dto: RegisterRequest): Promise<{ user: User }> {
  logger.info('[auth] register', dto.email);
  const { data } = await axiosForBackend.post<{ user: User }>('/api/auth/register', dto);
  setStoredUser(data.user);
  return data;
}

export async function login(dto: LoginRequest): Promise<{ user: User }> {
  logger.info('[auth] login', dto.email);
  const { data } = await axiosForBackend.post<{ user: User }>('/api/auth/login', dto);
  setStoredUser(data.user);
  return data;
}

export async function getMe(): Promise<User | null> {
  logger.info('[auth] me');
  try {
    const { data } = await axiosForBackend.get<User | null>('/api/auth/me');
    return data;
  } catch (err) {
    logger.warn('[auth] me failed', err);
    return null;
  }
}

export async function getGoogleStatus(): Promise<GoogleAuthStatus> {
  const { data } = await axiosForBackend.get<GoogleAuthStatus>('/api/auth/google/status');
  return data;
}

export async function mergeCart(sessionId: string): Promise<{ success: boolean }> {
  const { data } = await axiosForBackend.post<{ success: boolean }>(
    '/api/auth/merge-cart',
    { sessionId },
  );
  return data;
}

export async function refreshToken(): Promise<User> {
  logger.info('[auth] refresh token');
  const { data } = await axiosForBackend.post<{ user: User }>('/api/auth/refresh');
  setStoredUser(data.user);
  return data.user;
}

export async function logout(): Promise<void> {
  try {
    await axiosForBackend.post('/api/auth/logout', {});
  } catch (err) {
    logger.warn('[auth] logout api failed', err);
  }
  removeStoredUser();
}
