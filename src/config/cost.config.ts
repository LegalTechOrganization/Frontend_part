// Конфигурация стоимости запросов
// Порог токенов на одну единицу внутренней валюты
export const COST_CONFIG = {
  TOKENS_PER_UNIT: 32000,
};

// Утилита расчёта количества единиц по числу токенов
export const calculateCostUnitsByTokens = (tokens: number): number => {
  const perUnit = COST_CONFIG.TOKENS_PER_UNIT;
  if (!Number.isFinite(tokens) || tokens <= 0) return 1;
  return Math.max(1, Math.ceil(tokens / perUnit));
};


