import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Crown, Check, CreditCard, Loader2 } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { useToast } from './Toast';

const PlanCard = () => {
    const { subscription, balance, nextBilling, loading, error, renewSubscription } = useSubscription();
    const { showToast } = useToast();
    const navigate = useNavigate();

    // Функция для перевода свойств тарифа в понятные названия
    const getFeatureName = (property: string): string => {
        const featureNames: Record<string, string> = {
            'unlimited_api_calls': 'Безлимитные API вызовы',
            'unlimited_storage': 'Безлимитное хранилище',
            'priority_support': 'Приоритетная поддержка',
            'custom_integration': 'Кастомная интеграция',
            'advanced_analytics': 'Расширенная аналитика',
            'dedicated_server': 'Выделенный сервер',
            'basic_support': 'Базовая поддержка',
            'standard_storage': 'Стандартное хранилище',
            'api_access': 'Доступ к API',
            'document_analysis': 'Анализ документов',
            'prompt_library': 'Библиотека промптов'
        };
        
        return featureNames[property] || property;
    };

    const handleRenewSubscription = async () => {
        try {
            await renewSubscription();
            showToast({
                title: 'Подписка продлена',
                description: 'Ваша подписка успешно продлена',
                variant: 'success',
                durationMs: 3000
            });
        } catch (error) {
            showToast({
                title: 'Ошибка продления',
                description: error instanceof Error ? error.message : 'Не удалось продлить подписку',
                variant: 'error',
                durationMs: 5000
            });
        }
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) {
            return 'Не указано';
        }
        
        try {
            // Пробуем разные форматы даты
            let date: Date;
            
            // Если это строка с двойным Z (например: 2026-08-24T18:19:55.565744+00:00Z)
            if (dateString.includes('+00:00Z')) {
                // Убираем +00:00Z и добавляем обычный Z
                const cleanDateString = dateString.replace('+00:00Z', 'Z');
                date = new Date(cleanDateString);
            }
            // Если это ISO строка с Z в конце
            else if (dateString.includes('T') && dateString.includes('Z')) {
                date = new Date(dateString);
            }
            // Если это ISO строка без Z
            else if (dateString.includes('T')) {
                date = new Date(dateString + 'Z');
            }
            // Если это просто строка с датой
            else {
                date = new Date(dateString);
            }
            
            // Проверяем, что дата валидна
            if (isNaN(date.getTime())) {
                return 'Неверный формат даты';
            }
            
            return date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (error) {
            return 'Ошибка форматирования даты';
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gold/20 flex items-center justify-center h-96">
                <Loader2 className="animate-spin text-gold" size={32} />
            </div>
        );
    }

    if (error || !subscription) {
        return (
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-red-200 text-center">
                <p className="text-red-600">Ошибка загрузки данных подписки</p>
                <p className="text-sm text-ink/60 mt-2">{error}</p>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-white to-gold/5 rounded-3xl p-8 shadow-xl border border-gold/20 relative overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold/20 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-gold to-gold/80 rounded-2xl flex items-center justify-center">
                            <Crown className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-playfair font-semibold text-ink">
                                {subscription.plan?.name || 'Неизвестный тариф'}
                            </h2>
                            <p className="text-ink/60">
                                Статус: {subscription.status === 'active' ? 'Активен' : 'Неактивен'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="text-right">
                        <div className="text-3xl font-playfair font-semibold text-ink">
                            ₽{subscription.plan?.price_rub?.toLocaleString('ru-RU') || '0'}
                        </div>
                        <div className="text-ink/60 text-sm">в месяц</div>
                    </div>
                </div>

                {/* Баланс юнитов */}
                <div className="bg-gold/5 rounded-2xl p-4 mb-6 border border-gold/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-ink/60 mb-1">Остаток юнитов</p>
                            <p className="text-2xl font-semibold text-ink">
                                {subscription.remaining_units?.toLocaleString('ru-RU') || '0'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-ink/60 mb-1">Из месячного лимита</p>
                            <p className="text-lg text-ink/80">
                                {subscription.plan?.monthly_units?.toLocaleString('ru-RU') || '0'}
                            </p>
                        </div>
                        <div className="ml-4">
                            <div className="w-16 h-16 relative">
                                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                                    <path
                                        d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                                        fill="none"
                                        stroke="#f3f4f6"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                                        fill="none"
                                        stroke="#C7A358"
                                        strokeWidth="2"
                                        strokeDasharray={`${((subscription.remaining_units || 0) / (subscription.plan?.monthly_units || 1)) * 100}, 100`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-medium text-ink">
                                        {Math.round(((subscription.remaining_units || 0) / (subscription.plan?.monthly_units || 1)) * 100)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Свойства тарифа */}
                <div className="space-y-3 mb-8">
                    {subscription.tariff_properties?.map((property, index) => (
                        <motion.div
                            key={property}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Check size={12} className="text-white" />
                            </div>
                            <span className="text-ink/80">{getFeatureName(property)}</span>
                        </motion.div>
                    ))}
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={handleRenewSubscription}
                        className="flex-1 flex items-center justify-center gap-3 bg-gold text-paper px-6 py-4 rounded-2xl hover:bg-gold/90 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                    >
                        <CreditCard size={20} />
                        Продлить подписку
                    </button>
                    <button onClick={() => navigate('/prices')} className="px-6 py-4 border border-ink/20 rounded-2xl text-ink/70 hover:bg-ink/5 transition-all duration-200">
                        Изменить план
                    </button>
                </div>

                <div className="mt-6 pt-6 border-t border-ink/10">
                    <div className="flex justify-between text-sm">
                        <span className="text-ink/60">Следующее списание</span>
                        <span className="text-ink font-medium">
                            {subscription.next_debit ? formatDate(subscription.next_debit) : 'Загрузка...'}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PlanCard;
