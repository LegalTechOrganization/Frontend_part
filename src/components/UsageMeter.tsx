import { motion } from 'framer-motion';
import { BarChart3, FileText, MessageSquare, Database, Zap } from 'lucide-react';

const UsageMeter = () => {
    const usageStats = [
        {
            label: 'Документы проанализированы',
            current: 127,
            limit: 200,
            icon: FileText,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            label: 'Чаты с AI',
            current: 1250,
            limit: 2000,
            icon: MessageSquare,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-100'
        },
        {
            label: 'Хранилище',
            current: 2.4,
            limit: 10,
            icon: Database,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-100',
            unit: 'ГБ'
        },
        {
            label: 'API запросы',
            current: 8450,
            limit: 15000,
            icon: Zap,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-100'
        }
    ];

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
                                            {stat.current}{stat.unit || ''} из {stat.limit}{stat.unit || ''} 
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
