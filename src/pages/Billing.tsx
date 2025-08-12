import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock } from 'lucide-react';
import PlanCard from "@/components/PlanCard";
import { useUser } from "@/hooks/useUser";
import type { ChangePasswordRequest, UpdateUserProfileRequest } from "@/types/user.types";
import { useToast } from "@/components/Toast";
// Временно отключено для MVP
// import UsageMeter from "@/components/UsageMeter";

// Типы для настроек
type SettingItem = 
  | { label: string; value: string; type: 'input' }
  | { label: string; type: 'button' };

type SettingsSection = {
    title: string;
    icon: any;
    items: SettingItem[];
};

const Billing = () => {
    const { user, updatePassword, saveProfile } = useUser();
    const { showToast } = useToast();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState<ChangePasswordRequest>({ current_password: '', new_password: '' });

    const [editableProfile, setEditableProfile] = useState<UpdateUserProfileRequest>({
        full_name: user?.full_name ?? '',
        email: user?.email ?? '',
        company: user?.metadata?.company ?? ''
    });

    // Синхронизируем локальное редактируемое состояние с загруженным профилем
    useEffect(() => {
        setEditableProfile({
            full_name: user?.full_name ?? '',
            email: user?.email ?? '',
            company: user?.metadata?.company ?? ''
        });
    }, [user]);

    const profileSections: SettingsSection[] = useMemo(() => ([
        {
            title: 'Профиль',
            icon: User,
            items: [
                { label: 'Имя', value: editableProfile.full_name, type: 'input' },
                { label: 'Email', value: editableProfile.email, type: 'input' },
                { label: 'Компания', value: editableProfile.company ?? '', type: 'input' }
            ]
        },
        {
            title: 'Безопасность',
            icon: Lock,
            items: [
                { label: 'Сменить пароль', type: 'button' }
            ]
        }
    ]), [editableProfile]);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
        >
            <h1 className="text-3xl font-playfair mb-8">Кабинет</h1>
            
            {/* Тарифный план */}
            <div className="mb-12">
                <PlanCard />
                {/* Временно отключено для MVP */}
                {/* <UsageMeter /> */}
            </div>

            {/* Профиль и настройки - выровнены по ширине с тарифным планом */}
            <div className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {profileSections.map((section, sectionIndex) => {
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
                                {section.items.map((item) => (
                                    <div key={item.label} className="space-y-2">
                                        <label className="text-sm font-medium text-ink/80">{item.label}</label>
                                        {item.type === 'input' && (
                                            <input
                                                type="text"
                                                value={typeof item.value === 'string' ? item.value : ''}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    if (item.label === 'Имя') setEditableProfile(p => ({ ...p, full_name: v }));
                                                    if (item.label === 'Email') setEditableProfile(p => ({ ...p, email: v }));
                                                    if (item.label === 'Компания') setEditableProfile(p => ({ ...p, company: v }));
                                                }}
                                                className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all duration-200"
                                            />
                                        )}
                                        {item.type === 'button' && (
                                            <button
                                                onClick={() => setShowPasswordModal(true)}
                                                className="w-full px-4 py-3 border border-ink/20 rounded-xl text-ink/70 hover:bg-ink/5 transition-all duration-200"
                                            >
                                                {item.label}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {sectionIndex === 0 && (
                                <div className="mt-8 pt-6 border-t border-ink/10">
                                    <button
                                        onClick={async () => {
                                            try {
                                                await saveProfile(editableProfile);
                                                showToast({
                                                    variant: 'success',
                                                    title: 'Профиль сохранён',
                                                    description: 'Изменения успешно применены',
                                                });
                                            } catch (e) {
                                                showToast({
                                                    variant: 'error',
                                                    title: 'Не удалось сохранить профиль',
                                                    description: e instanceof Error ? e.message : 'Попробуйте позже',
                                                });
                                            }
                                        }}
                                        className="w-full bg-gold text-paper py-3 rounded-xl hover:bg-gold/90 transition-all duration-200 font-medium"
                                    >
                                        Сохранить изменения
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
                </div>
            </div>

            {/* Модалка смены пароля */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold mb-4">Смена пароля</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-ink/70">Текущий пароль</label>
                                <input
                                    type="password"
                                    value={passwordForm.current_password}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                                    className="mt-1 w-full px-4 py-3 rounded-xl border border-ink/20 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all duration-200"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-ink/70">Новый пароль</label>
                                <input
                                    type="password"
                                    value={passwordForm.new_password}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                                    className="mt-1 w-full px-4 py-3 rounded-xl border border-ink/20 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all duration-200"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 px-4 py-3 border border-ink/20 rounded-xl text-ink/70 hover:bg-ink/5 transition-all duration-200"
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={async () => {
                                        try {
                                            await updatePassword(passwordForm);
                                            setShowPasswordModal(false);
                                            setPasswordForm({ current_password: '', new_password: '' });
                                            showToast({
                                                variant: 'success',
                                                title: 'Пароль изменён',
                                                description: 'Вы можете использовать новый пароль при следующем входе',
                                            });
                                        } catch (e) {
                                            showToast({
                                                variant: 'error',
                                                title: 'Не удалось сменить пароль',
                                                description: e instanceof Error ? e.message : 'Попробуйте позже',
                                            });
                                        }
                                    }}
                                    className="flex-1 bg-gold text-white px-4 py-3 rounded-xl hover:bg-gold/90 transition-all duration-200"
                                >
                                    Сменить пароль
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default Billing;
