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
  plan_code: 'pro1500',
  name: 'Pro Plan',
  monthly_units: 1500.0,
  price_rub: 1500,
  is_active: true,
  created_at: '2024-01-01T00:00:00Z'
};

export const mockUserSubscription: UserSubscription = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  user_id: 'user123',
  plan_code: 'pro1500',
  started_at: '2024-01-15T10:30:00Z',
  expires_at: '2024-02-15T10:30:00Z',
  auto_renew: true,
  status: 'active',
  created_at: '2024-01-15T10:30:00Z',
  remaining_units: 1250.5,
  next_debit: '2024-02-15T10:30:00Z',
  tariff_properties: [
    'unlimited_api_calls',
    'unlimited_storage',
    'priority_support',
    'custom_integration',
    'advanced_analytics',
    'dedicated_server'
  ],
  plan: mockTariffPlan
};

export const mockUserBalance: UserBalance = {
  user_id: 'user-123-456-789',
  balance_units: 750, // Увеличу остаток для более реалистичного отображения
  updated_at: '2025-01-20T14:25:00Z'
};
