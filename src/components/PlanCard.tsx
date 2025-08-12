import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Crown, Check, CreditCard, Loader2 } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

const PlanCard = () => {
    const { subscription, balance, nextBilling, loading, error, renewSubscription } = useSubscription();
    const navigate = useNavigate();

    const features = [
        '1000 юнитов на чаты с AI в месяц',
        'Анализ документов до 1 ГБ',
        'Доступ к библиотеке промптов',
        'Приоритетная поддержка',
        'API интеграции'
    ];

    const handleRenewSubscription = async () => {
        try {
            await renewSubscription();
        } catch (error) {
            console.error('Ошибка при продлении подписки:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
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
                                {balance?.balance_units?.toLocaleString('ru-RU') || '0'}
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
                                        strokeDasharray={`${((balance?.balance_units || 0) / (subscription.plan?.monthly_units || 1)) * 100}, 100`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-medium text-ink">
                                        {Math.round(((balance?.balance_units || 0) / (subscription.plan?.monthly_units || 1)) * 100)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 mb-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Check size={12} className="text-white" />
                            </div>
                            <span className="text-ink/80">{feature}</span>
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
                            {nextBilling ? formatDate(nextBilling.next_billing_date) : 'Загрузка...'}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PlanCard;
