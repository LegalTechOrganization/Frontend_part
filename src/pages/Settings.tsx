import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Check, Star, Zap } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { createSubscriptionPaymentLink, createUnitsTopUpPaymentLink } from '@/services/payment.service';
import { useToast } from '@/components/Toast';

const Settings = () => {
    const [isYearly, setIsYearly] = useState(false);
    const [extraUnits, setExtraUnits] = useState(50);
    const { subscription } = useSubscription();
    const { showToast } = useToast();
    
    const basePricingPlans = useMemo(() => ([
        {
            name: 'Начальный',
            monthlyPrice: 0,
            credits: 50,
            description: 'Попробуйте сервис бесплатно',
            features: [
                '50 юнитов в месяц',
                'Основные шаблоны документов',
                'AI-ассистент для генерации',
                'Поддержка по email'
            ],
            current: subscription?.plan_code === 'starter',
            buttonText: subscription?.plan_code === 'starter' ? 'Текущий план' : 'Перейти на Начальный',
            color: 'from-gray-500 to-gray-600'
        },
        {
            name: 'Стандартный',
            monthlyPrice: 1990,
            credits: 300,
            description: 'Для регулярной работы',
            features: [
                '300 юнитов в месяц',
                'Все шаблоны документов',
                'AI-ассистент для генерации',
                'Приоритетная поддержка',
                'Сохранение документов'
            ],
            current: subscription?.plan_code === 'standard',
            buttonText: subscription?.plan_code === 'standard' ? 'Текущий план' : 'Перейти на Стандартный',
            color: 'from-blue-500 to-blue-600'
        },
        {
            name: 'Профессиональный',
            monthlyPrice: 5990,
            credits: 1000,
            description: 'Для профессиональной работы',
            features: [
                '1000 юнитов в месяц',
                'Полный доступ к всем функциям',
                'Продвинутые AI-инструменты',
                'Неограниченное хранилище',
                'Персональные шаблоны',
                'Приоритет в обработке'
            ],
            popular: true,
            current: subscription?.plan_code === 'professional',
            buttonText: subscription?.plan_code === 'professional' ? 'Текущий план' : 'Перейти на Про',
            color: 'from-gold to-gold/80'
        },
        {
            name: 'Корпоративный',
            monthlyPrice: 'От 9,990 ₽',
            credits: 'Давайте обсудим',
            description: 'Для команд и компаний',
            features: [
                'Индивидуальное количество юнитов',
                'Корпоративные шаблоны',
                'Командная работа и управление',
                'Персональный менеджер',
                'Приоритетная техподдержка',
                'Индивидуальные настройки'
            ],
            enterprise: true,
            current: subscription?.plan_code === 'enterprise',
            buttonText: subscription?.plan_code === 'enterprise' ? 'Текущий план' : 'Связаться с нами',
            color: 'from-purple-600 to-purple-700'
        }
    ]), [subscription]);
    
    const calculatePrice = (monthlyPrice: number | string, isYearly: boolean) => {
        if (monthlyPrice === 0) return { price: 0, period: 'бесплатно', savings: null };
        if (typeof monthlyPrice !== 'number') return { price: monthlyPrice, period: '', savings: null };
        
        if (isYearly) {
            const yearlyPrice = Math.round((monthlyPrice as number) * 12 * 0.83); // 17% скидка
            const savings = monthlyPrice * 12 - yearlyPrice;
            return { 
                price: yearlyPrice, 
                period: 'в год', 
                savings: `экономия ${savings.toLocaleString()} ₽`
            };
        }
        
        return { price: monthlyPrice, period: 'в месяц', savings: null };
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
        >
            <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold/80 rounded-2xl flex items-center justify-center">
                        <DollarSign className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-playfair font-semibold text-ink">Цены</h1>
                    </div>
                </div>
                <p className="text-ink/60 text-lg mb-8">Выберите подходящий тарифный план</p>
                
                {/* Переключатель месяц/год */}
                <div className="flex items-center justify-center gap-4 bg-white rounded-2xl p-2 shadow-lg border border-ink/10 max-w-sm mx-auto">
                    <button 
                        onClick={() => setIsYearly(false)}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                            !isYearly 
                                ? 'bg-gold text-paper shadow-md' 
                                : 'text-ink/60 hover:text-ink'
                        }`}
                    >
                        Месяц
                    </button>
                    <button 
                        onClick={() => setIsYearly(true)}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 relative ${
                            isYearly 
                                ? 'bg-gold text-paper shadow-md' 
                                : 'text-ink/60 hover:text-ink'
                        }`}
                    >
                        Год
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            -17%
                        </div>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {basePricingPlans.map((plan, index) => {
                    const pricing = calculatePrice(plan.monthlyPrice, isYearly);
                    return (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`relative bg-white rounded-3xl p-6 shadow-lg border ${
                            plan.popular 
                                ? 'border-gold shadow-xl ring-2 ring-gold/20 transform scale-105' 
                                : plan.enterprise
                                    ? 'border-purple-200 shadow-xl'
                                    : 'border-ink/5'
                        }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <div className="bg-gold text-paper px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                                    <Star size={16} />
                                    Популярный
                                </div>
                            </div>
                        )}

                        <div className="text-center mb-6">
                            {/* Иконка тарифа */}
                            <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                                {plan.name === 'Начальный' && <Zap className="text-white" size={20} />}
                                {plan.name === 'Стандартный' && <Check className="text-white" size={20} />}
                                {plan.name === 'Профессиональный' && <Star className="text-white" size={20} />}
                                {plan.name === 'Корпоративный' && <DollarSign className="text-white" size={20} />}
                            </div>
                            
                            <h3 className="text-lg sm:text-xl font-playfair font-semibold text-ink mb-3">{plan.name}</h3>
                            
                            {/* Кредиты */}
                            <div className="mb-3">
                                <span className="text-xl sm:text-2xl font-bold text-gold">
                                    {typeof plan.credits === 'number' ? `${plan.credits}` : plan.credits}
                                </span>
                                <span className="text-ink/60 text-sm ml-1">
                                    {typeof plan.credits === 'number' ? 'юнитов' : ''}
                                </span>
                            </div>
                            
                            {/* Цена */}
                            <div className="mb-3">
                                <span className="text-2xl sm:text-3xl font-bold text-ink">
                                    {pricing.price === 0 ? 'Бесплатно' : 
                                     typeof pricing.price === 'number' ? `${pricing.price.toLocaleString()} ₽` : pricing.price}
                                </span>
                                {pricing.period && (
                                    <div className="text-ink/60 text-sm">{pricing.period}</div>
                                )}
                                {pricing.savings && (
                                    <div className="text-green-600 text-xs font-medium mt-1">{pricing.savings}</div>
                                )}
                            </div>
                            
                            <p className="text-ink/60 text-sm">{plan.description}</p>
                        </div>

                        <div className="space-y-3 mb-6">
                            {plan.features.map((feature, featureIndex) => (
                                <div key={featureIndex} className="flex items-start gap-2">
                                    <div className="w-4 h-4 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check size={10} className="text-gold" />
                                    </div>
                                    <span className="text-ink/80 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>

                         <button 
                            onClick={async () => {
                                if (plan.current) return;
                                try {
                                  const code = plan.name === 'Начальный' ? 'starter' : plan.name === 'Стандартный' ? 'standard' : plan.name === 'Профессиональный' ? 'professional' : 'enterprise';
                                  const link = await createSubscriptionPaymentLink(code);
                                  window.location.href = link.payment_url;
                                } catch (e) {
                                  showToast({ variant: 'error', title: 'Не удалось создать оплату', description: e instanceof Error ? e.message : 'Попробуйте позже' });
                                }
                            }}
                            className={`w-full py-3 rounded-xl font-medium transition-all duration-200 text-sm ${
                                plan.current 
                                    ? 'bg-ink/10 text-ink/60 cursor-not-allowed'
                                    : plan.popular
                                        ? 'bg-gold text-paper hover:bg-gold/90 shadow-lg'
                                        : plan.enterprise
                                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                                            : 'border-2 border-gold text-gold hover:bg-gold hover:text-paper'
                            }`}
                            disabled={plan.current}
                        >
                            {plan.buttonText}
                        </button>
                    </motion.div>
                    );
                })}
            </div>
            
            {/* Докупка юнитов */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-16 mb-12"
            >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100 shadow-lg">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <DollarSign className="text-white" size={28} />
                        </div>
                        
                        <h3 className="text-2xl font-playfair font-semibold text-ink mb-4">
                            Нужно больше юнитов?
                        </h3>
                        
                        <p className="text-ink/70 text-lg mb-8 max-w-2xl mx-auto">
                            Если ваших юнитов не хватило на месяц, вы можете докупить дополнительные юниты по выгодной цене
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mb-8">
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">9 ₽</div>
                                <div className="text-ink/60">за юнит</div>
                            </div>
                            
                            <div className="w-px h-12 bg-ink/20 hidden sm:block"></div>
                            
                            <div className="text-center">
                                <div className="text-xl sm:text-2xl font-semibold text-ink mb-2">Минимум</div>
                                <div className="text-ink/60">10 юнитов</div>
                            </div>
                            
                            <div className="w-px h-12 bg-ink/20 hidden sm:block"></div>
                            
                            <div className="text-center">
                                <div className="text-xl sm:text-2xl font-semibold text-ink mb-2">До конца</div>
                                <div className="text-ink/60">месяца</div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-blue-200 w-full md:flex-1">
                                <button 
                                    onClick={() => setExtraUnits(Math.max(10, extraUnits - 10))}
                                    className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <span className="text-blue-600 font-bold">−</span>
                                </button>
                                <input 
                                    type="number" 
                                    value={extraUnits} 
                                    onChange={(e) => setExtraUnits(Math.max(10, parseInt(e.target.value) || 10))}
                                    min="10" 
                                    step="10"
                                    className="flex-1 text-center text-lg font-semibold bg-transparent outline-none"
                                />
                                <button 
                                    onClick={() => setExtraUnits(extraUnits + 10)}
                                    className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <span className="text-blue-600 font-bold">+</span>
                                </button>
                            </div>
                            
                            <div className="text-lg md:text-xl font-semibold text-ink whitespace-nowrap text-center">
                                = {(extraUnits * 9).toLocaleString()} ₽
                            </div>
                        </div>
                        
                        <button 
                          onClick={async () => {
                            try {
                              const link = await createUnitsTopUpPaymentLink(extraUnits);
                              window.location.href = link.payment_url;
                            } catch (e) {
                              showToast({ variant: 'error', title: 'Не удалось оформить докупку', description: e instanceof Error ? e.message : 'Попробуйте позже' });
                            }
                          }}
                          className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          Купить юниты
                        </button>
                        
                        <p className="text-sm text-ink/50 mt-4">
                            Докупленные юниты работают до конца месяца
                        </p>
                    </div>
                </div>
            </motion.div>
            
            {/* Информация о кредитах */}
            <div className="mt-12 bg-gradient-to-r from-gold/10 to-gold/5 rounded-3xl p-8 text-center">
                <h3 className="text-xl font-playfair font-semibold text-ink mb-4">Как работают юниты?</h3>
                <p className="text-ink/70 max-w-2xl mx-auto">
                    Юниты — это внутренняя валюта сервиса. Один юнит равен одному запросу к AI или генерации одного документа. 
                    Неиспользованные юниты не переносятся на следующий месяц.
                </p>
            </div>
        </motion.div>
    );
};

export default Settings;