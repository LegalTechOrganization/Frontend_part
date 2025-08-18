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
 * Backend: POST /api/user/change-password
 * Headers: Authorization: Bearer {JWT_TOKEN}
 * Body: { current_password: string, new_password: string }
 * Response: { success: boolean, message: string }
 */
export const changePassword = async (_data: ChangePasswordRequest): Promise<ApiResponse<null>> => {
  // TODO: Реализовать запрос к API для смены пароля
  // const token = storage.getToken();
  // const response = await fetch('/api/user/change-password', {
  //   method: 'POST',
  //   headers: { 
  //     'Authorization': `Bearer ${token}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(data)
  // });
  // return response.json();
  
  // Мок-данные для разработки
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: null,
        message: 'Пароль успешно изменен'
      });
    }, 1000);
  });
};

/**
 * Ручка обновления профиля пользователя
 * 
 * Пользователь: редактирует имя, email и компанию в кабинете и сохраняет
 * Backend: PUT /api/user/profile
 * Headers: Authorization: Bearer {JWT_TOKEN}
 * Body: { full_name, email, company }
 * Response: UserProfile (обновлённый)
 */
export const updateUserProfile = async (_data: UpdateUserProfileRequest): Promise<ApiResponse<UserProfile>> => {
  // TODO: Реализовать запрос к API для обновления профиля пользователя
  // const token = storage.getToken();
  // const response = await fetch('/api/user/profile', {
  //   method: 'PUT',
  //   headers: {
  //     'Authorization': `Bearer ${token}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(data)
  // });
  // return response.json();

  // Мок-данные для разработки: возвращаем обновлённый профиль
  return new Promise((resolve) => {
    setTimeout(() => {
      const updated: UserProfile = {
        ...mockUserProfile,
        full_name: _data.full_name,
        email: _data.email,
        metadata: {
          ...mockUserProfile.metadata,
          company: _data.company ?? mockUserProfile.metadata?.company
        }
      };
      resolve({ success: true, data: updated, message: 'Профиль обновлён' });
    }, 600);
  });
};
