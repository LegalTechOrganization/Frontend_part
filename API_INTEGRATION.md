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

---

## Генерация документов (Template Service)

Новый порядок работы: перед запуском генерации необходимо предварительно получить количество токенов во входных документах.

### 0. Подсчёт токенов в документах
- Эндпоинт: `GET /api/tpl/count`
- Заголовки: `Authorization: Bearer {JWT_TOKEN}`
- Ответ:
```typescript
{ tokens: number }
```

### Логика стоимости
- До 32 000 токенов — 1 единица валюты
- 32 001 — 64 000 — 2 единицы
- 64 001 — 96 000 — 3 единицы
- и далее: +1 единица на каждые дополнительные 32 000 токенов

Формула: `costUnits = max(1, ceil(tokens / 32000))`

### 1. Запуск генерации (без изменений в контракте)
- Эндпоинт: `POST /api/tpl/{code}/run` (multipart/form-data)
- Формы: `files[]: File (0..N)`, `instruction?: string`
- Ответ: `202 { job_id: string }`

### 2. Получение статуса задачи
- Эндпоинт: `GET /api/tpl/jobs/{job_id}/status`
- Ответ: `{ status: 'queued'|'processing'|'succeeded'|'failed', progress?: number }`

### 3. Скачивание результата
- Эндпоинты: `GET /api/tpl/jobs/{job_id}/result/docx` и `/pdf` → бинарный ответ

### Поведение на фронтенде
1. Вызываем `POST /api/tpl/count` (multipart: `files[]`, `instruction`).
2. Если `tokens <= TOKENS_PER_UNIT` (см. `src/config/cost.config.ts`), автоматически запускаем `POST /run` и переходим к опросу статуса.
3. Если `tokens > TOKENS_PER_UNIT`, показываем промежуточный шаг с сообщением и “Подробнее” по тарификации.
4. По кнопке запуска отправляем `POST /run` без передачи стоимости; списание валюты считает backend.

### Реализация на фронтенде (моки)
- Файл: `src/services/template.service.ts`
  - `countTemplateTokens(params)` — возвращает `{ tokens }` (мок POST /tpl/count)
  - `precheckAndMaybeRunTemplate(code, params)` — подсчёт; при `tokens <= TOKENS_PER_UNIT` вызывает `runTemplate`, иначе возвращает сообщение, токены и рассчитанную на фронте стоимость для отображения пользователю
  - Списание валюты выполняется на backend; фронтенд стоимость не передаёт

Эндпоинты в конфиге: `src/config/api.config.ts`
```typescript
ENDPOINTS: {
  TEMPLATE_COUNT: (code: string) => `/api/tpl/${code}/count`,
  TEMPLATE_RUN: (code: string) => `/api/tpl/${code}/run`,
  TEMPLATE_STATUS: (jobId: string) => `/api/tpl/jobs/${jobId}/status`,
  TEMPLATE_RESULT: (jobId: string, format: string) => `/api/tpl/jobs/${jobId}/result/${format}`,
}
```
