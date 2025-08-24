import { storage } from './storage';

// Глобальная переменная для отслеживания состояния перенаправления
let isRedirecting = false;

/**
 * Проверяет, действителен ли токен
 */
export const isTokenValid = (): boolean => {
  const token = storage.getToken();
  return Boolean(token);
};

/**
 * Очищает все данные аутентификации и перенаправляет на страницу входа
 */
export const redirectToLogin = (): void => {
  if (isRedirecting) return; // Предотвращаем множественные перенаправления
  
  isRedirecting = true;
  
  // Очищаем все данные
  storage.clearAll();
  
  // Перенаправляем на страницу входа
  window.location.href = '/login';
};

/**
 * Обрабатывает ошибку 401 (Unauthorized) - очищает токены и перенаправляет на вход
 */
export const handleUnauthorizedError = (): void => {
  console.log('Токен истек или недействителен. Перенаправляем на страницу входа...');
  redirectToLogin();
};

/**
 * Создает функцию-обертку для API запросов с автоматической обработкой 401 ошибок
 */
export const createApiRequest = async <T>(
  url: string, 
  options: RequestInit = {}
): Promise<T> => {
  const token = storage.getToken();
  
  // Добавляем токен к заголовкам, если он есть
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // Если получили 401, перенаправляем на вход
    if (response.status === 401) {
      handleUnauthorizedError();
      throw new Error('Unauthorized');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    // Если это ошибка сети или другая ошибка, не связанная с авторизацией
    if (error instanceof Error && error.message !== 'Unauthorized') {
      throw error;
    }
    // Для ошибки авторизации просто пробрасываем её
    throw error;
  }
};

/**
 * Сбрасывает флаг перенаправления (вызывается при успешном входе)
 */
export const resetRedirectFlag = (): void => {
  isRedirecting = false;
};
