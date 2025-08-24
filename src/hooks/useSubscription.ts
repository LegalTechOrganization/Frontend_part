import { useState, useEffect } from 'react';
import type { UserSubscription, UserBalance } from '../types/user.types';
import { 
  getCurrentSubscription, 
  createSubscriptionPaymentLink
} from '../services/payment.service';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Загружаем данные подписки (теперь включает remaining_units и next_debit)
      const subscriptionData = await getCurrentSubscription();
      
      setSubscription(subscriptionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки данных подписки');
    } finally {
      setLoading(false);
    }
  };

  const renewSubscription = async (planCode?: string) => {
    try {
      setError(null);
      const paymentLink = await createSubscriptionPaymentLink(planCode);
      
      // Перенаправляем пользователя на ЮКассу
      window.location.href = paymentLink.payment_url;
      
      return paymentLink;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания ссылки на оплату';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  return {
    subscription,
    // Для обратной совместимости оставляем balance и nextBilling
    balance: subscription ? {
      user_id: subscription.user_id,
      balance_units: subscription.remaining_units,
      updated_at: subscription.created_at
    } : null,
    nextBilling: subscription ? {
      next_billing_date: subscription.next_debit,
      amount: subscription.plan?.price_rub || 0,
      currency: 'RUB'
    } : null,
    loading,
    error,
    refetch: fetchSubscriptionData,
    renewSubscription
  };
};
