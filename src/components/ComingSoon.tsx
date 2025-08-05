import { motion } from 'framer-motion';
import { Clock, Sparkles } from 'lucide-react';

interface ComingSoonProps {
    message: string;
}

const ComingSoon = ({ message }: ComingSoonProps) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-32 h-32 bg-gradient-to-br from-gold/20 to-gold/10 rounded-full flex items-center justify-center mb-8"
            >
                <Clock className="w-16 h-16 text-gold" />
            </motion.div>
            
            <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-3xl font-playfair font-semibold text-ink mb-4"
            >
                Скоро здесь будет что-то особенное
            </motion.h2>
            
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-xl text-ink/60 mb-8 max-w-md"
            >
                {message}
            </motion.p>
            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex items-center gap-2 text-gold font-medium"
            >
                <Sparkles size={20} />
                <span>Мы работаем над этим</span>
            </motion.div>
        </motion.div>
    );
};

export default ComingSoon;
