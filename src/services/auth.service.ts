import type { ApiResponse } from '../types/api.types';
import { API_CONFIG, createAuthHeaders } from '../config/api.config';
import { storage } from '../utils/storage';

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface SignInResponse {
  jwt: string;
  refresh_token: string;
  user: {
    user_id: string;
    email: string;
    full_name: string | null;
    orgs: any[];
  };
}

export type SignUpResponse = SignInResponse;

/**
 * Ручка входа в систему
 * 
 * Пользователь: вводит email и пароль на странице входа
 * Backend: POST /v1/client/sign-in/password
 * Body: { email: string, password: string }
 * Response: SignInResponse (jwt, refresh_token, user)
 */
export const signIn = async (data: SignInRequest): Promise<SignInResponse> => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.SIGN_IN, {
      method: 'POST',
      headers: createAuthHeaders(),
      body: JSON.stringify(data),
      credentials: 'include' // Для получения HTTP-Only cookies
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Ошибка входа: ${response.status}`);
    }

    const result = await response.json();

    // Сохраняем токены и пользователя в storage
    if (result.jwt) {
      storage.setToken(result.jwt);
    }
    if (result.refresh_token) {
      storage.setRefreshToken(result.refresh_token);
    }
    if (result.user) {
      storage.setUser(result.user);
    }

    return result;
  } catch (error) {
    console.error('Ошибка при входе в систему:', error);
    throw error;
  }
};

/**
 * Ручка регистрации нового пользователя
 * 
 * Пользователь: вводит email, пароль и имя на странице регистрации
 * Backend: POST /v1/client/sign-up
 * Body: { email: string, password: string, full_name?: string }
 * Response: SignUpResponse (jwt, refresh_token, user)
 */
export const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.SIGN_UP, {
      method: 'POST',
      headers: createAuthHeaders(),
      body: JSON.stringify(data),
      credentials: 'include' // Для получения HTTP-Only cookies
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Ошибка регистрации: ${response.status}`);
    }

    const result = await response.json();

    // На регистрации не сохраняем токены — редиректим на страницу входа
    return result;
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    throw error;
  }
};

/**
 * Выход из системы
 */
export const signOut = async (): Promise<void> => {
  try {
    const refreshToken = storage.getRefreshToken();
    const accessToken = storage.getToken();
    
    if (!refreshToken) {
      // Нет refresh_token локально — просто локальный логаут
      storage.clearAll();
      return;
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

    const resp = await fetch(API_CONFIG.ENDPOINTS.LOGOUT, {
      method: 'POST',
      headers,
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      console.warn('Logout failed', resp.status, text);
    }
    
    // Очищаем локальное хранилище
    storage.clearAll();
  } catch (error) {
    console.error('Ошибка при выходе из системы:', error);
    // Даже если запрос не удался, очищаем локальные данные
    storage.clearAll();
  }
};

/**
 * Получение текущего токена
 */
export const getAccessToken = (): string | null => {
  return storage.getToken();
};

/**
 * Проверка, авторизован ли пользователь
 */
export const isAuthenticated = (): boolean => {
  return Boolean(storage.getToken());
};
