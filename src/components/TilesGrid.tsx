import { useState } from 'react';
import { Search, FileText, Scale, Users, Calendar, Shield, Briefcase, BookOpen, TrendingUp, Archive, Settings, Zap, Gavel, Building, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const functionCards = [
  { id: 1, title: 'Досудебная претензия по договору поставки', description: 'Автоматическое создание претензии при нарушении условий поставки', icon: FileText, color: 'from-gold/20 to-gold/10' },
  { id: 2, title: 'Исковое заявление о взыскании задолженности', description: 'Генерация искового заявления для взыскания долгов по договорам', icon: Gavel, color: 'from-petrol/20 to-petrol/10' },
  { id: 3, title: 'Трудовой договор', description: 'Создание трудового договора с учетом ТК РФ', icon: UserCheck, color: 'from-sage/20 to-sage/10' },
  { id: 4, title: 'Договор поставки', description: 'Типовой договор поставки товаров с настройками', icon: Briefcase, color: 'from-gold/20 to-gold/10' },
  { id: 5, title: 'Отзыв на исковое заявление', description: 'Подготовка возражений и отзыва ответчика', icon: Scale, color: 'from-petrol/20 to-petrol/10' },
  { id: 6, title: 'Протокол собрания участников ООО', description: 'Оформление решений общего собрания участников', icon: Building, color: 'from-sage/20 to-sage/10' },
  { id: 7, title: 'Претензия по защите прав потребителей', description: 'Претензия для защиты прав потребителей товаров и услуг', icon: Shield, color: 'from-gold/20 to-gold/10' },
  { id: 8, title: 'Договор оказания услуг', description: 'Универсальный договор на оказание различных услуг', icon: Settings, color: 'from-petrol/20 to-petrol/10' },
  { id: 9, title: 'Приказ об увольнении', description: 'Оформление приказа об увольнении по различным основаниям', icon: Users, color: 'from-sage/20 to-sage/10' },
  { id: 10, title: 'Договор купли-продажи доли в ООО', description: 'Сделки с долями в уставном капитале общества', icon: TrendingUp, color: 'from-gold/20 to-gold/10' },
  { id: 11, title: 'Претензия по возврату денежных средств', description: 'Требование о возврате неосновательно полученных средств', icon: Archive, color: 'from-petrol/20 to-petrol/10' },
  { id: 12, title: 'Дополнительное соглашение к договору', description: 'Изменение условий действующих договоров', icon: BookOpen, color: 'from-sage/20 to-sage/10' },
  { id: 13, title: 'Ходатайство о продлении срока', description: 'Процессуальные документы для продления сроков в суде', icon: Calendar, color: 'from-gold/20 to-gold/10' },
  { id: 14, title: 'Договор аренды нежилого помещения', description: 'Аренда офисов, складов и коммерческих помещений', icon: Building, color: 'from-petrol/20 to-petrol/10' },
  { id: 15, title: 'Заявление о выдаче исполнительного листа', description: 'Документы для принудительного исполнения решений', icon: Zap, color: 'from-sage/20 to-sage/10' },
];

const TilesGrid = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const filteredCards = functionCards.filter(card =>
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCards = filteredCards.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="space-y-10">
            {/* Search Input */}
            <div className="relative max-w-lg">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-ink/40" size={22} />
                <input 
                    type="text" 
                    placeholder="Поиск документов..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-gold/20 focus:border-gold focus:ring-4 focus:ring-gold/10 outline-none bg-white shadow-lg transition-all duration-300 text-lg"
                />
            </div>

            {/* Results info */}
            {searchQuery && (
                <div className="text-ink/60">
                    Найдено документов: <span className="font-semibold text-gold">{filteredCards.length}</span>
                </div>
            )}

            {/* Cards Grid */}
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                layout
            >
                {currentCards.map((card, index) => {
                    const IconComponent = card.icon;
                    return (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ y: -12, transition: { duration: 0.3 } }}
                            className="group cursor-pointer"
                        >
                            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gold/10 hover:border-gold/30 h-full flex flex-col">
                                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-gold/20`}>
                                    <IconComponent className="text-ink/70" size={32} />
                                </div>
                                
                                <div className="flex-1">
                                    <h3 className="text-xl font-playfair font-semibold text-ink mb-4 group-hover:text-gold transition-colors duration-300 leading-tight">
                                        {card.title}
                                    </h3>
                                    <p className="text-ink/60 leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                                
                                <div className="mt-8 pt-6 border-t-2 border-gold/10">
                                    <span className="text-gold font-semibold group-hover:text-gold/80 transition-colors duration-300">
                                        Создать документ →
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Empty state */}
            {filteredCards.length === 0 && searchQuery && (
                <div className="text-center py-16">
                    <div className="text-ink/40 text-xl mb-4">Документы не найдены</div>
                    <div className="text-ink/60">Попробуйте изменить поисковый запрос</div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-3 mt-16">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-6 py-3 rounded-2xl border-2 border-gold/20 text-ink/60 hover:bg-gold/5 hover:border-gold/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                    >
                        Назад
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-5 py-3 rounded-2xl transition-all duration-200 font-medium ${
                                currentPage === page
                                    ? 'bg-gold text-paper shadow-lg border-2 border-gold'
                                    : 'border-2 border-gold/20 text-ink/60 hover:bg-gold/5 hover:border-gold/40'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                    
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-6 py-3 rounded-2xl border-2 border-gold/20 text-ink/60 hover:bg-gold/5 hover:border-gold/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                    >
                        Вперед
                    </button>
                </div>
            )}
        </div>
    );
};

export default TilesGrid;
