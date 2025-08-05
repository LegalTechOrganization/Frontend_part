import { motion } from 'framer-motion';
import { BookOpen, Search, Filter, Star } from 'lucide-react';

const Library = () => {
    const promptCategories = [
        { name: 'Договоры', count: 24, active: true },
        { name: 'Исковые заявления', count: 18, active: false },
        { name: 'Корпоративное право', count: 15, active: false },
        { name: 'Трудовое право', count: 12, active: false },
    ];

    const samplePrompts = [
        { title: 'Анализ договора поставки', description: 'Проверка ключевых условий и рисков', rating: 4.8 },
        { title: 'Составление трудового договора', description: 'Шаблон с учетом ТК РФ', rating: 4.9 },
        { title: 'Претензия по качеству товара', description: 'Досудебное урегулирование споров', rating: 4.7 },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <BookOpen className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-playfair font-semibold text-ink">Библиотека промптов</h1>
                        <p className="text-ink/60">Готовые шаблоны для работы с AI</p>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-ink/20 rounded-xl hover:bg-ink/5 transition-all duration-200">
                        <Filter size={16} />
                        Фильтры
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gold text-paper rounded-xl hover:bg-gold/90 transition-all duration-200">
                        <Search size={16} />
                        Поиск
                    </button>
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                {promptCategories.map((category, index) => (
                    <button
                        key={category.name}
                        className={`flex-shrink-0 px-6 py-3 rounded-2xl transition-all duration-200 ${
                            category.active
                                ? 'bg-gold text-paper shadow-lg'
                                : 'bg-white border border-ink/10 text-ink/70 hover:bg-ink/5'
                        }`}
                    >
                        {category.name} ({category.count})
                    </button>
                ))}
            </div>

            {/* Prompts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {samplePrompts.map((prompt, index) => (
                    <motion.div
                        key={prompt.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-ink/5 cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-playfair font-semibold text-ink group-hover:text-gold transition-colors duration-300">
                                {prompt.title}
                            </h3>
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star size={14} fill="currentColor" />
                                <span className="text-xs text-ink/60">{prompt.rating}</span>
                            </div>
                        </div>
                        <p className="text-ink/60 text-sm mb-4">{prompt.description}</p>
                        <button className="text-gold text-sm font-medium hover:text-gold/80 transition-colors duration-300">
                            Использовать →
                        </button>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Library;
