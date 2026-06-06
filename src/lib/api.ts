import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
});

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'authUser';

interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId: string;
  organizationName?: string;
}

interface RetriableRequest {
  _retry?: boolean;
  url?: string;
  headers?: Record<string, string>;
}

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  getUser: (): StoredUser | null => {
    const user = localStorage.getItem(USER_KEY);
    if (!user) return null;

    try {
      return JSON.parse(user) as StoredUser;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },
  setSession: (token: string, refreshToken: string, user?: StoredUser) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = authStorage.getRefreshToken();
    if (!refreshToken) return null;

    const response = await axios.post('/api/auth/refresh', { refreshToken });
    authStorage.setSession(response.data.token, response.data.refreshToken, response.data.user);
    return response.data.token as string;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config as RetriableRequest | undefined;
    const isAuthEndpoint = originalRequest?.url?.startsWith('/auth/');

    if ((status === 401 || status === 403) && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const token = await refreshAccessToken();
        if (token) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch {
        authStorage.clearSession();
        window.dispatchEvent(new Event('auth:logout'));
      }
    }

    return Promise.reject(error);
  },
);
