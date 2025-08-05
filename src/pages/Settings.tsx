import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Lock, Bell, Palette, Shield } from 'lucide-react';

const Settings = () => {
    const settingsSections = [
        {
            title: 'Профиль',
            icon: User,
            items: [
                { label: 'Имя', value: 'Александр Иванов', type: 'input' },
                { label: 'Email', value: 'alex@example.com', type: 'input' },
                { label: 'Компания', value: 'ООО "Юридическая фирма"', type: 'input' },
                { label: 'Должность', value: 'Старший юрист', type: 'input' }
            ]
        },
        {
            title: 'Безопасность',
            icon: Lock,
            items: [
                { label: 'Сменить пароль', type: 'button' },
                { label: 'Двухфакторная аутентификация', value: true, type: 'toggle' },
                { label: 'История входов', type: 'button' }
            ]
        },
        {
            title: 'Уведомления',
            icon: Bell,
            items: [
                { label: 'Email уведомления', value: true, type: 'toggle' },
                { label: 'Push уведомления', value: false, type: 'toggle' },
                { label: 'Еженедельные отчеты', value: true, type: 'toggle' }
            ]
        },
        {
            title: 'Интерфейс',
            icon: Palette,
            items: [
                { label: 'Тема', value: 'Светлая', type: 'select', options: ['Светлая', 'Темная', 'Авто'] },
                { label: 'Язык', value: 'Русский', type: 'select', options: ['Русский', 'English'] }
            ]
        }
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center">
                    <SettingsIcon className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-playfair font-semibold text-ink">Настройки</h1>
                    <p className="text-ink/60">Управление аккаунтом и предпочтениями</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {settingsSections.map((section, sectionIndex) => {
                    const IconComponent = section.icon;
                    return (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
                            className="bg-white rounded-3xl p-8 shadow-lg border border-ink/5"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-ink/5 rounded-xl flex items-center justify-center">
                                    <IconComponent size={20} className="text-ink/70" />
                                </div>
                                <h2 className="text-xl font-playfair font-semibold text-ink">{section.title}</h2>
                            </div>

                            <div className="space-y-6">
                                {section.items.map((item, itemIndex) => (
                                    <div key={item.label} className="space-y-2">
                                        <label className="text-sm font-medium text-ink/80">{item.label}</label>
                                        
                                        {item.type === 'input' && (
                                            <input
                                                type="text"
                                                defaultValue={item.value}
                                                className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all duration-200"
                                            />
                                        )}
                                        
                                        {item.type === 'toggle' && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-ink/60"></span>
                                                <button className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                                                    item.value ? 'bg-gold' : 'bg-ink/20'
                                                }`}>
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                                                        item.value ? 'translate-x-7' : 'translate-x-1'
                                                    }`} />
                                                </button>
                                            </div>
                                        )}
                                        
                                        {item.type === 'select' && (
                                            <select className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all duration-200">
                                                {item.options?.map(option => (
                                                    <option key={option} selected={option === item.value}>{option}</option>
                                                ))}
                                            </select>
                                        )}
                                        
                                        {item.type === 'button' && (
                                            <button className="w-full px-4 py-3 border border-ink/20 rounded-xl text-ink/70 hover:bg-ink/5 transition-all duration-200">
                                                {item.label}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {sectionIndex === 0 && (
                                <div className="mt-8 pt-6 border-t border-ink/10">
                                    <button className="w-full bg-gold text-paper py-3 rounded-xl hover:bg-gold/90 transition-all duration-200 font-medium">
                                        Сохранить изменения
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default Settings;
