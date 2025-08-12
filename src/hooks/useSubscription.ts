import { useState, useEffect } from 'react';
import type { UserSubscription, UserBalance } from '../types/user.types';
import { 
  getCurrentSubscription, 
  createSubscriptionPaymentLink, 
  getNextBillingInfo,
  getUserBalance 
} from '../services/payment.service';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [nextBilling, setNextBilling] = useState<{ next_billing_date: string; amount: number; currency: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Загружаем все данные параллельно
      const [subscriptionData, balanceData, billingData] = await Promise.all([
        getCurrentSubscription(),
        getUserBalance(),
        getNextBillingInfo()
      ]);
      
      setSubscription(subscriptionData);
      setBalance(balanceData);
      setNextBilling(billingData);
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
    balance,
    nextBilling,
    loading,
    error,
    refetch: fetchSubscriptionData,
    renewSubscription
  };
};
