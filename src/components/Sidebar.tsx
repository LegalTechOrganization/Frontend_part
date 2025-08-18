import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, DollarSign, User, Home, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { path: '/', label: 'Главное', icon: Home },
  { path: '/vault', label: 'Vault', icon: Lock, soon: true },
  // Временно отключено для MVP
  // { path: '/library', label: 'Library', icon: null },
];

const bottomNavItems = [
  { path: '/prices', label: 'Цены', icon: DollarSign },
  { path: '/account', label: 'Кабинет', icon: User },
  { path: '/offer', label: 'Оферта', icon: FileText },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/register', { replace: true });
    }
  };

  return (
    <motion.div 
      className="relative bg-white border-r border-gold/20 flex flex-col shadow-xl"
      animate={{ width: isCollapsed ? 80 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Collapse Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-8 z-10 bg-gold text-paper rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gold/90"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Brand/Logo */}
      <div className="p-6 border-b border-gold/10">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="font-playfair text-3xl font-semibold text-ink mb-1">LegalTech</h1>
              <p className="text-sm text-ink/60">AI для юристов</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex justify-center"
            >
              <div className="w-10 h-10 bg-gold rounded-2xl flex items-center justify-center">
                <span className="text-paper font-playfair font-semibold text-lg">L</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col justify-between py-4">
        <div className="space-y-2 px-4">
          {navItems.map(({ path, label, icon: Icon, soon }) => (
            <Link 
              to={path} 
              key={path} 
              className="relative group block"
            >
              <div className={`
                flex items-center px-4 py-4 rounded-2xl transition-all duration-300
                ${pathname === path 
                  ? 'bg-gold/10 text-gold border border-gold/20 shadow-md' 
                  : 'text-ink/70 hover:bg-gold/5 hover:text-ink border border-transparent'
                }
                ${soon ? 'opacity-50' : ''}
              `}>
                {Icon && (
                  <Icon size={20} className="flex-shrink-0" />
                )}
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="ml-4 font-medium"
                    >
                      {label}
                      {soon && <span className="ml-2 text-xs opacity-60">(Скоро)</span>}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          ))}
        </div>

        <div className="space-y-2 px-4 border-t border-gold/10 pt-4">
          {bottomNavItems.map(({ path, label, icon: Icon }) => (
            <Link 
              to={path} 
              key={path} 
              className="relative group block"
            >
              <div className={`
                flex items-center px-4 py-4 rounded-2xl transition-all duration-300
                ${pathname === path 
                  ? 'bg-gold/10 text-gold border border-gold/20 shadow-md' 
                  : 'text-ink/70 hover:bg-gold/5 hover:text-ink border border-transparent'
                }
              `}>
                <Icon size={20} className="flex-shrink-0" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="ml-4 font-medium"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          ))}
          
          {/* Кнопка выхода */}
          <button 
            onClick={handleLogout}
            className="relative group block w-full"
          >
            <div className="flex items-center px-4 py-4 rounded-2xl transition-all duration-300 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200">
              <LogOut size={20} className="flex-shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 font-medium"
                  >
                    Выйти
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </button>
        </div>
      </nav>
    </motion.div>
  );
};

export default Sidebar;
