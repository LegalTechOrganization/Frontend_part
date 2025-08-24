import type { UserProfile, ChangePasswordRequest, UpdateUserProfileRequest } from '../types/user.types';
import type { ApiResponse } from '../types/api.types';
import { mockUserProfile } from '../mock/user.mock';
import { storage } from '../utils/storage';
import { API_CONFIG, createApiUrl, createAuthHeaders } from '../config/api.config';
import { createApiRequest } from '../utils/auth';

/**
 * Ручка получения профиля пользователя
 * 
 * Пользователь: заходит в ЛК, система показывает его данные
 * Backend: GET /v1/client/me
 * Headers: Authorization: Bearer {JWT_TOKEN}
 * Response: UserProfile (user_id, email, full_name, metadata)
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const token = storage.getToken();
    if (!token) {
      throw new Error('Токен не найден');
    }

    const data = await createApiRequest<UserProfile>(
      createApiUrl(API_CONFIG.ENDPOINTS.USER_PROFILE),
      {
        method: 'GET',
        headers: createAuthHeaders(token),
      }
    );

    // Кешируем пользователя локально только для UX (не токены)
    storage.setUser(data);
    return data;
  } catch (error) {
    // Извлекаем понятное сообщение об ошибке
    let errorMessage = 'Ошибка получения данных подписки';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    // Возвращаем мок-данные для разработки
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
    const response = await createApiRequest<ApiResponse<null>>(
      createApiUrl(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD),
      {
        method: 'POST',
        headers: createAuthHeaders(token),
        body: JSON.stringify({
          old_password: data.current_password,
          new_password: data.new_password
        })
      }
    );

    return { success: true, data: null, message: 'Пароль успешно изменен' };
  } catch (error) {
    // Извлекаем понятное сообщение об ошибке
    let errorMessage = 'Ошибка смены пароля';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    throw new Error(errorMessage);
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
    const updatedUserData = await createApiRequest<UserProfile>(
      createApiUrl(API_CONFIG.ENDPOINTS.UPDATE_PROFILE),
      {
        method: 'PATCH',
        headers: createAuthHeaders(token),
        body: JSON.stringify({
          full_name: data.full_name
        })
      }
    );
    
    // Обновляем кеш пользователя
    storage.setUser(updatedUserData);

    return { 
      success: true, 
      data: updatedUserData, 
      message: 'Профиль обновлён' 
    };
  } catch (error) {
    // Извлекаем понятное сообщение об ошибке
    let errorMessage = 'Ошибка обновления профиля';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    throw new Error(errorMessage);
  }
};
