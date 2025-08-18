# API Integration Guide

## Ручки для аутентификации

### 1. Ручка входа в систему
**Файл:** `src/services/auth.service.ts` → `signIn()`

**Описание:** Пользователь вводит email и пароль на странице входа

**Эндпоинт:** `POST /v1/client/sign-in/password`
**Headers:** `Content-Type: application/json`
**Body:**
```typescript
{
  email: string;
  password: string;
}
```
**Response:**
```typescript
{
  jwt: string;           // JWT токен для авторизации
  refresh_token: string; // Refresh токен
  user: {
    user_id: string;     // ID пользователя
    email: string;       // Email пользователя
    full_name: string | null; // Полное имя
    orgs: any[];         // Организации пользователя
  }
}
```

---

### 2. Ручка регистрации нового пользователя
**Файл:** `src/services/auth.service.ts` → `signUp()`

**Описание:** Пользователь создает новый аккаунт с email, паролем и именем

**Эндпоинт:** `POST /v1/client/sign-up`
**Headers:** `Content-Type: application/json`
**Body:**
```typescript
{
  email: string;
  password: string;
  full_name?: string;    // Опционально
}
```
**Response:** (тот же формат, что и для входа)
```typescript
{
  jwt: string;           // JWT токен для авторизации
  refresh_token: string; // Refresh токен
  user: {
    user_id: string;     // ID пользователя
    email: string;       // Email пользователя
    full_name: string | null; // Полное имя
    orgs: any[];         // Организации пользователя
  }
}
```

---

## Ручки для ЛК (Личный Кабинет)

### 1. Ручка получения профиля пользователя
**Файл:** `src/services/user.service.ts` → `getUserProfile()`

**Описание:** Пользователь заходит в ЛК, система автоматически загружает его данные из таблицы `users`

**Эндпоинт:** `GET /api/user/profile`
**Headers:** `Authorization: Bearer {JWT_TOKEN}`
**Response:**
```typescript
{
  id: string;           // users.id (UUID из Keycloak)
  email: string;        // users.email
  full_name: string;    // users.full_name
  created_at: string;   // users.created_at
  last_login_at: string; // users.last_login_at
  metadata?: object;    // users.metadata (jsonb)
}
```

---

### 2. Ручка смены пароля
**Файл:** `src/services/user.service.ts` → `changePassword()`

**Описание:** Пользователь вводит текущий и новый пароль в форме настроек

**Эндпоинт:** `POST /api/user/change-password`
**Headers:** `Authorization: Bearer {JWT_TOKEN}`, `Content-Type: application/json`
**Body:**
```typescript
{
  current_password: string;
  new_password: string;
}
```
**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

---

### 3. Ручка подгрузки текущего тарифа
**Файл:** `src/services/payment.service.ts` → `getCurrentSubscription()`

**Описание:** Пользователь заходит в ЛК, система показывает текущий тариф, дату окончания и остаток юнитов на карточке

**Эндпоинт:** `GET /v1/billing/subscription`
**Headers:** `Authorization: Bearer {JWT_TOKEN}`
**Response:** JOIN данных из `user_plans` + `tariff_plans`
```typescript
{
  id: string;              // user_plans.id
  user_id: string;         // user_plans.user_id
  plan_code: string;       // user_plans.plan_code
  started_at: string;      // user_plans.started_at
  expires_at: string;      // user_plans.expires_at
  status: 'active' | 'expired' | 'cancelled';
  plan: {                  // JOIN с tariff_plans
    name: string;          // tariff_plans.name
    price_rub: number;     // tariff_plans.price_rub
    monthly_units: number; // tariff_plans.monthly_units
  }
}
```

---

### 4. Ручка создания ссылки на ЮКассу
**Файл:** `src/services/payment.service.ts` → `createSubscriptionPaymentLink()`

**Описание:** Пользователь нажимает "Продлить подписку", система создает ссылку на оплату и перенаправляет

**Эндпоинт:** `POST /api/payment/create-subscription-link`
**Headers:** `Authorization: Bearer {JWT_TOKEN}`, `Content-Type: application/json`
**Body:**
```typescript
{
  plan_code?: string; // Опционально, если меняет тариф
}
```
**Response:**
```typescript
{
  payment_url: string;  // URL для редиректа на ЮКассу
  order_id: string;     // ID заказа для отслеживания
}
```

---

### 5. Ручка получения следующего списания
**Файл:** `src/services/payment.service.ts` → `getNextBillingInfo()`

**Описание:** Пользователь видит в ЛК когда будет следующее списание

**Эндпоинт:** `GET /api/user/subscription/next-billing`
**Headers:** `Authorization: Bearer {JWT_TOKEN}`
**Response:**
```typescript
{
  next_billing_date: string; // user_plans.expires_at (ISO format)
  amount: number;            // tariff_plans.price_rub
  currency: string;          // "RUB"
}
```

---

### 6. Ручка получения баланса (бонус)
**Файл:** `src/services/payment.service.ts` → `getUserBalance()`

**Описание:** Показывает остаток единиц пользователя для UsageMeter

**Эндпоинт:** `GET /api/user/balance`
**Headers:** `Authorization: Bearer {JWT_TOKEN}`
**Response:**
```typescript
{
  user_id: string;        // user_balances.user_id
  balance_units: number;  // user_balances.balance_units
  updated_at: string;     // user_balances.updated_at
}
```

---

## Использование в компонентах

Все ручки уже интегрированы через React хуки:

- **Login.tsx** использует `useAuth()` для входа в систему
- **Register.tsx** использует `useAuth()` для регистрации нового пользователя
- **App.tsx** использует `useAuth()` для защиты маршрутов
- **Sidebar.tsx** использует `useAuth()` для кнопки выхода
- **PlanCard.tsx** использует `useSubscription()` для отображения тарифа, остатка юнитов и кнопки продления
- **UsageMeter.tsx** использует `useSubscription()` для показа детального использования единиц
- **Settings.tsx** может использовать `useUser()` для профиля и смены пароля

**Новое:** На карточке тарифа теперь отображается:
- Остаток юнитов (balance_units)
- Месячный лимит (monthly_units) 
- Процент использования с круговой диаграммой

## Мок-данные

Пока API не готово, все функции возвращают мок-данные из `src/mock/user.mock.ts` с задержкой для имитации сетевых запросов.

## Токены

Для работы с API нужно реализовать сохранение JWT токенов через `src/utils/storage.ts` (уже готово).

## Конфигурация API

### Проксирование в разработке

В файле `vite.config.ts` настроено проксирование для разработки:

```typescript
server: {
  proxy: {
    '/v1': {
      target: 'http://localhost:8002', // API Gateway
      changeOrigin: true,
      secure: false,
    },
    '/api': {
      target: 'http://localhost:8002', // API Gateway
      changeOrigin: true,
      secure: false,
    }
  }
}
```

Это означает, что:
- Запросы к `/v1/*` и `/api/*` автоматически перенаправляются на `http://localhost:8002`
- Фронтенд работает на `localhost:5173`, а API Gateway на `localhost:8002`
- В продакшене можно настроить переменную окружения `VITE_API_BASE_URL`

### Конфигурационный файл

Все эндпоинты и настройки API находятся в `src/config/api.config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  ENDPOINTS: {
    SIGN_IN: '/v1/client/sign-in/password',
    SIGN_UP: '/v1/client/sign-up',
    // ... другие эндпоинты
  }
};
```
