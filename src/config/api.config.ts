// Конфигурация API
export const API_CONFIG = {
  // Базовый URL для API (в разработке используется проксирование через Vite)
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  
  // Таймауты для запросов
  TIMEOUT: 10000, // 10 секунд
  
  // Заголовки по умолчанию
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // Эндпоинты
  ENDPOINTS: {
    // Аутентификация
    SIGN_IN: '/v1/client/sign-in/password',
    SIGN_UP: '/v1/client/sign-up',
    LOGOUT: '/v1/client/logout',
    
    // Пользователи
    USER_PROFILE: '/v1/client/me',
    CHANGE_PASSWORD: '/v1/client/change-password',
    UPDATE_PROFILE: '/v1/client/update',
    
    // Подписки и платежи
    SUBSCRIPTION: '/v1/billing/subscription',
    NEXT_BILLING: '/api/user/subscription/next-billing',
    USER_BALANCE: '/api/user/balance',
    CREATE_SUBSCRIPTION_LINK: '/api/payment/create-subscription-link',
    CREATE_TOPUP_LINK: '/api/payment/create-topup-link',
    
    // Шаблоны документов
    TEMPLATE_RUN: (code: string) => `/api/tpl/${code}/run`,
    TEMPLATE_STATUS: (jobId: string) => `/api/tpl/jobs/${jobId}/status`,
    TEMPLATE_RESULT: (jobId: string, format: string) => `/api/tpl/jobs/${jobId}/result/${format}`,
  }
};

// Функция для создания полного URL
export const createApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Функция для создания заголовков с авторизацией
export const createAuthHeaders = (token?: string): Record<string, string> => {
  const headers = { ...API_CONFIG.DEFAULT_HEADERS };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

