import { motion } from 'framer-motion';
import { Crown, Check, CreditCard } from 'lucide-react';

const PlanCard = () => {
    const features = [
        'Неограниченные чаты с AI',
        'Анализ документов до 50 МБ',
        'Доступ к библиотеке промптов',
        'Приоритетная поддержка',
        'API интеграции'
    ];

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
                            <h2 className="text-2xl font-playfair font-semibold text-ink">Профессиональный</h2>
                            <p className="text-ink/60">Текущий тариф</p>
                        </div>
                    </div>
                    
                    <div className="text-right">
                        <div className="text-3xl font-playfair font-semibold text-ink">₽4,990</div>
                        <div className="text-ink/60 text-sm">в месяц</div>
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
                    <button className="flex-1 flex items-center justify-center gap-3 bg-gold text-paper px-6 py-4 rounded-2xl hover:bg-gold/90 transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
                        <CreditCard size={20} />
                        Продлить подписку
                    </button>
                    <button className="px-6 py-4 border border-ink/20 rounded-2xl text-ink/70 hover:bg-ink/5 transition-all duration-200">
                        Изменить план
                    </button>
                </div>

                <div className="mt-6 pt-6 border-t border-ink/10">
                    <div className="flex justify-between text-sm">
                        <span className="text-ink/60">Следующее списание</span>
                        <span className="text-ink font-medium">15 февраля 2024</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PlanCard;
