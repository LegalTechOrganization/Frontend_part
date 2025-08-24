// Типы для работы с пользователями и подписками

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  last_login_at: string | null;
  is_deleted: boolean;
  metadata?: {
    realm?: string;
    tariff?: string;
    custom_roles?: string[];
    kc_linked_at?: string;
    company?: string; // Название компании пользователя (для отображения в профиле)
  };
}

export interface TariffPlan {
  plan_code: string;
  name: string;
  monthly_units: number;
  price_rub: number;
  is_active: boolean;
  created_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_code: string;
  started_at: string;
  expires_at: string;
  auto_renew: boolean;
  status: 'active' | 'expired' | 'cancelled';
  created_at: string;
  remaining_units: number;
  next_debit: string;
  tariff_properties: string[];
  plan?: TariffPlan; // Joined data
}

export interface UserBalance {
  user_id: string;
  balance_units: number;
  updated_at: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface PaymentLinkResponse {
  payment_url: string;
  order_id: string;
}

// Запрос на обновление профиля пользователя из ЛК
export interface UpdateUserProfileRequest {
  full_name: string;
  email: string;
  company?: string;
}
