import type { UserProfile, ChangePasswordRequest, UpdateUserProfileRequest } from '../types/user.types';
import type { ApiResponse } from '../types/api.types';
import { mockUserProfile } from '../mock/user.mock';
import { storage } from '../utils/storage';
import { API_CONFIG, createAuthHeaders } from '../config/api.config';

/**
 * Ручка получения профиля пользователя из БД
 * 
 * Пользователь: заходит в ЛК, система автоматически загружает его данные
 * Backend: GET /api/user/profile
 * Headers: Authorization: Bearer {JWT_TOKEN}
 * Response: UserProfile (id, email, full_name, created_at, last_login_at, metadata)
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  const token = storage.getToken();
  if (!token) {
    throw new Error('Токен отсутствует. Авторизуйтесь заново.');
  }

  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.USER_PROFILE, {
      headers: createAuthHeaders(token)
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Необходима повторная авторизация');
      }
      throw new Error(`Ошибка получения профиля: ${response.status}`);
    }

    const userData = await response.json();
    // Кешируем пользователя локально только для UX (не токены)
    storage.setUser(userData);
    return userData;
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    
    // Если API недоступен, возвращаем мок-данные для разработки
    console.warn('Используются мок-данные для разработки');
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUserProfile), 500);
    });
  }
};

/**
 * Ручка смены пароля пользователя
 * 
 * Пользователь: вводит текущий и новый пароль в форме настроек
 * Backend: POST /v1/client/change-password
 * Headers: Authorization: Bearer {JWT_TOKEN}
 * Body: { old_password: string, new_password: string }
 * Response: { success: boolean, message: string }
 */
export const changePassword = async (data: ChangePasswordRequest): Promise<ApiResponse<null>> => {
  const token = storage.getToken();
  if (!token) {
    throw new Error('Токен отсутствует. Авторизуйтесь заново.');
  }

  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, {
      method: 'POST',
      headers: createAuthHeaders(token),
      body: JSON.stringify({
        old_password: data.current_password,
        new_password: data.new_password
      })
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Необходима повторная авторизация');
      }
      throw new Error(`Ошибка смены пароля: ${response.status}`);
    }

    return { success: true, data: null, message: 'Пароль успешно изменен' };
  } catch (error) {
    console.error('Ошибка при смене пароля:', error);
    throw error;
  }
};

/**
 * Ручка обновления профиля пользователя
 * 
 * Пользователь: редактирует имя, email и компанию в кабинете и сохраняет
 * Backend: PATCH /v1/client/update
 * Headers: Authorization: Bearer {JWT_TOKEN}
 * Body: { full_name }
 * Response: UserProfile (обновлённый)
 */
export const updateUserProfile = async (data: UpdateUserProfileRequest): Promise<ApiResponse<UserProfile>> => {
  const token = storage.getToken();
  if (!token) {
    throw new Error('Токен отсутствует. Авторизуйтесь заново.');
  }

  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, {
      method: 'PATCH',
      headers: createAuthHeaders(token),
      body: JSON.stringify({
        full_name: data.full_name
      })
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Необходима повторная авторизация');
      }
      throw new Error(`Ошибка обновления профиля: ${response.status}`);
    }

    // Получаем обновлённые данные пользователя
    const updatedUserData = await response.json();
    
    // Обновляем кеш пользователя
    storage.setUser(updatedUserData);

    return { 
      success: true, 
      data: updatedUserData, 
      message: 'Профиль обновлён' 
    };
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    throw error;
  }
};
