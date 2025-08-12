import type { UserProfile, UserSubscription, TariffPlan, UserBalance } from '../types/user.types';

// Мок-данные для разработки
export const mockUserProfile: UserProfile = {
  id: 'user-123-456-789',
  email: 'alexander.petrov@lawfirm.ru',
  full_name: 'Петров Александр Сергеевич',
  created_at: '2024-01-15T10:30:00Z',
  last_login_at: '2025-01-20T14:25:00Z',
  is_deleted: false,
  metadata: {
    realm: 'main',
    tariff: 'professional',
    custom_roles: ['editor', 'viewer'],
    kc_linked_at: '2024-01-15T10:30:00Z',
    company: 'ООО «Право и Порядок»'
  }
};

export const mockTariffPlan: TariffPlan = {
  plan_code: 'professional',
  name: 'Профессиональный',
  monthly_units: 1000,
  price_rub: 5990,
  period_days: 30,
  is_active: true,
  created_at: '2024-01-01T00:00:00Z'
};

export const mockUserSubscription: UserSubscription = {
  id: 'sub-789-123-456',
  user_id: 'user-123-456-789',
  plan_code: 'professional',
  started_at: '2025-01-01T00:00:00Z',
  expires_at: '2025-02-01T00:00:00Z',
  auto_renew: true,
  status: 'active',
  last_payment_order: 'order-456-789-123',
  created_at: '2025-01-01T00:00:00Z',
  plan: mockTariffPlan
};

export const mockUserBalance: UserBalance = {
  user_id: 'user-123-456-789',
  balance_units: 750, // Увеличу остаток для более реалистичного отображения
  updated_at: '2025-01-20T14:25:00Z'
};
