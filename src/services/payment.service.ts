import type { UserSubscription, UserBalance, PaymentLinkResponse } from '../types/user.types';
import type { ApiResponse } from '../types/api.types';
import { mockUserSubscription, mockUserBalance } from '../mock/user.mock';
import { storage } from '../utils/storage';
import { API_CONFIG, createApiUrl, createAuthHeaders } from '../config/api.config';
import { createApiRequest } from '../utils/auth';

/**
 * Ручка подгрузки текущего тарифа пользователя
 * 
 * Пользователь: заходит в ЛК, система показывает текущий тариф, дату окончания и остаток юнитов
 * Backend: GET /api/user/subscription
 * Headers: Authorization: Bearer {JWT_TOKEN}
 * Response: UserSubscription (план, статус, даты, цена) + join с tariff_plans
 * Примечание: Для отображения баланса на карточке тарифа также используется getUserBalance()
 */
export const getCurrentSubscription = async (): Promise<UserSubscription> => {
  try {
    const token = storage.getToken();
    if (!token) {
      throw new Error('Токен не найден');
    }

    const data = await createApiRequest<UserSubscription>(
      createApiUrl(API_CONFIG.ENDPOINTS.SUBSCRIPTION),
      {
        method: 'GET',
        headers: createAuthHeaders(token),
      }
    );

    return data;
  } catch (error) {
    // Извлекаем понятное сообщение об ошибке
    let errorMessage = 'Ошибка получения данных подписки';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    // Возвращаем мок-данные в случае ошибки
    return mockUserSubscription;
  }
};

/**
 * Ручка создания ссылки на ЮКассу для продления подписки
 * 
 * Пользователь: нажимает "Продлить подписку" в ЛК
 * Backend: POST /api/payment/create-subscription-link
 * Headers: Authorization: Bearer {JWT_TOKEN}
 * Body: { plan_code: string } (опционально, если меняет тариф)
 * Response: { payment_url: string, order_id: string }
 * Redirect: пользователя перенаправляет на payment_url
 */
export const createSubscriptionPaymentLink = async (_planCode?: string): Promise<PaymentLinkResponse> => {
  // TODO: Реализовать запрос к API для создания ссылки на оплату
  // const token = storage.getToken();
  // const response = await fetch('/api/payment/create-subscription-link', {
  //   method: 'POST',
  //   headers: { 
  //     'Authorization': `Bearer ${token}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({ plan_code: planCode })
  // });
  // return response.json();
  
  // Мок-данные для разработки
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        payment_url: 'https://yoomoney.ru/checkout/payments/v2/contract?orderId=mock-order-123',
        order_id: 'mock-order-123'
      });
    }, 800);
  });
};

/**
 * Ручка получения даты следующего списания
 * 
 * Пользователь: видит в ЛК когда будет следующее списание
 * Backend: GET /api/user/subscription/next-billing
 * Headers: Authorization: Bearer {JWT_TOKEN}
 * Response: { next_billing_date: string (ISO), amount: number, currency: string }
 * Данные берутся из user_plans.expires_at + price_rub
 */
export const getNextBillingInfo = async (): Promise<{ next_billing_date: string; amount: number; currency: string }> => {
  // TODO: Реализовать запрос к API для получения информации о следующем списании
  // const token = storage.getToken();
  // const response = await fetch('/api/user/subscription/next-billing', {
  //   headers: { 'Authorization': `Bearer ${token}` }
  // });
  // return response.json();
  
  // Мок-данные для разработки
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        next_billing_date: '2025-02-01T00:00:00Z',
        amount: 5990,
        currency: 'RUB'
      });
    }, 400);
  });
};

/**
 * Ручка получения баланса пользователя
 * 
 * Пользователь: видит остаток единиц в ЛК
 * Backend: GET /api/user/balance
 * Headers: Authorization: Bearer {JWT_TOKEN}
 * Response: UserBalance (balance_units, updated_at)
 */
export const getUserBalance = async (): Promise<UserBalance> => {
  // TODO: Реализовать запрос к API для получения баланса пользователя
  // const token = storage.getToken();
  // const response = await fetch('/api/user/balance', {
  //   headers: { 'Authorization': `Bearer ${token}` }
  // });
  // return response.json();
  
  // Мок-данные для разработки
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockUserBalance), 300);
  });
};

/**
 * Ручка создания ссылки на ЮКассу для докупки юнитов
 *
 * Пользователь: на странице цен выбирает количество доп. юнитов и оплачивает
 * Backend: POST /api/payment/create-topup-link
 * Headers: Authorization: Bearer {JWT_TOKEN}
 * Body: { units: number }
 * Response: { payment_url: string, order_id: string }
 * Redirect: пользователя перенаправляет на payment_url
 */
export const createUnitsTopUpPaymentLink = async (units: number): Promise<PaymentLinkResponse> => {
  // TODO: Реализовать запрос к API для докупки юнитов
  // const token = storage.getToken();
  // const response = await fetch('/api/payment/create-topup-link', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${token}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ units })
  // });
  // return response.json();

  // Мок-данные для разработки
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        payment_url: `https://yoomoney.ru/checkout/payments/v2/contract?orderId=mock-topup-${units}-${Date.now()}`,
        order_id: `mock-topup-${units}-${Date.now()}`,
      });
    }, 600);
  });
};
