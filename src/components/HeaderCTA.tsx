import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/utils/storage';

const HeaderCTA = () => {
    const navigate = useNavigate();

    const goToChats = async () => {
        const token = storage.getToken();
        if (!token) {
            navigate('/login');
            return;
        }
        const CHAT_URL = (import.meta as any).env?.VITE_CHAT_URL ?? '/chat';
        window.location.assign(CHAT_URL);
    };
    return (
        <div className="flex justify-between items-center mb-12">
            <div>
                <h1 className="text-5xl font-playfair font-semibold text-ink mb-3">
                    Добро пожаловать в LegalTech
                </h1>
                <p className="text-ink/60 text-xl">
                    Ваш AI-помощник для юридической работы
                </p>
            </div>
            <button onClick={goToChats} className="flex items-center gap-3 bg-gold text-paper px-8 py-4 rounded-2xl hover:bg-gold/90 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-lg hover:scale-105">
                <MessageCircle size={24} />
                Перейти в Чаты
            </button>
        </div>
    );
};

export default HeaderCTA;
