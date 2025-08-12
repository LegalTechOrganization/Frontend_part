import { motion } from 'framer-motion';
import { BarChart3, FileText, MessageSquare, Database, Zap, Loader2 } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

const UsageMeter = () => {
    const { subscription, balance, loading, error } = useSubscription();

    // Рассчитываем использование на основе реальных данных
    const monthlyLimit = subscription?.plan?.monthly_units || 3000;
    const currentUsage = monthlyLimit - (balance?.balance_units || 0);

    const usageStats = [
        {
            label: 'Единицы использованы',
            current: currentUsage,
            limit: monthlyLimit,
            icon: Zap,
            color: 'from-gold/60 to-gold/40',
            bgColor: 'bg-gold/10'
        },
        {
            label: 'Документы проанализированы',
            current: Math.floor(currentUsage * 0.15), // Примерное соотношение
            limit: Math.floor(monthlyLimit * 0.15),
            icon: FileText,
            color: 'from-petrol/60 to-petrol/40',
            bgColor: 'bg-petrol/10'
        },
        {
            label: 'Чаты с AI',
            current: Math.floor(currentUsage * 0.6), // Основное использование
            limit: Math.floor(monthlyLimit * 0.6),
            icon: MessageSquare,
            color: 'from-sage/60 to-sage/40',
            bgColor: 'bg-sage/10'
        },
        {
            label: 'Остаток единиц',
            current: balance?.balance_units || 0,
            limit: monthlyLimit,
            icon: Database,
            color: 'from-ink/60 to-ink/40',
            bgColor: 'bg-ink/10'
        }
    ];

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-ink/5 flex items-center justify-center h-96">
                <Loader2 className="animate-spin text-gold" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-red-200 text-center">
                <p className="text-red-600">Ошибка загрузки данных использования</p>
                <p className="text-sm text-ink/60 mt-2">{error}</p>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-ink/5"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="text-white" size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-playfair font-semibold text-ink">Использование ресурсов</h2>
                    <p className="text-ink/60">Текущий период: январь 2024</p>
                </div>
            </div>

            <div className="space-y-6">
                {usageStats.map((stat, index) => {
                    const percentage = (stat.current / stat.limit) * 100;
                    const IconComponent = stat.icon;
                    
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                                        <IconComponent size={18} className="text-current" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-ink">{stat.label}</p>
                                                                                 <p className="text-sm text-ink/60">
                                             {stat.current} из {stat.limit} 
                                             <span className="ml-2 text-ink/40">({percentage.toFixed(0)}%)</span>
                                         </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <div className="w-full bg-ink/5 rounded-full h-3">
                                    <motion.div 
                                        className={`h-3 rounded-full bg-gradient-to-r ${stat.color} relative overflow-hidden`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 1, delay: index * 0.2 }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                    </motion.div>
                                </div>
                                
                                {percentage > 80 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: 1 }}
                                        className="absolute -top-8 right-0 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium"
                                    >
                                        Близко к лимиту
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-8 pt-6 border-t border-ink/10 flex justify-between items-center">
                <div className="text-sm text-ink/60">
                    Обновлено: сегодня в 14:30
                </div>
                <button className="text-gold font-medium hover:text-gold/80 transition-colors duration-200">
                    Подробная статистика →
                </button>
            </div>
        </motion.div>
    );
};

export default UsageMeter;
