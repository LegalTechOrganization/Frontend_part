import { useState, useEffect } from 'react';
import { signIn, signUp, signOut, getAccessToken, isAuthenticated } from '../services/auth.service';
import type { SignInRequest, SignUpRequest, SignInResponse } from '../services/auth.service';
import { storage } from '../utils/storage';
import { isTokenValid } from '../utils/auth';

export const useAuth = () => {
  const [user, setUser] = useState<SignInResponse['user'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: SignInRequest): Promise<SignInResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await signIn(credentials);
      
      // Сохраняем данные пользователя
      setUser(result.user);
      storage.setUser(result.user);
      
      return result;
    } catch (err) {
      // Извлекаем понятное сообщение об ошибке
      let errorMessage = 'Ошибка входа в систему';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: SignUpRequest): Promise<SignInResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await signUp(credentials);
      
      // После регистрации не авторизуем и не сохраняем пользователя/токены
      
      return result;
    } catch (err) {
      // Извлекаем понятное сообщение об ошибке
      let errorMessage = 'Ошибка регистрации';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await signOut();
      
      // Очищаем состояние
      setUser(null);
      storage.clearAll();
    } catch (err) {
      // Убираем console.error - просто очищаем локальные данные
      setUser(null);
      storage.clearAll();
    } finally {
      setLoading(false);
    }
  };

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Проверяем, есть ли действительный токен
        if (!isTokenValid()) {
          setUser(null);
          setLoading(false);
          return;
        }

        const token = getAccessToken();
        const savedUser = storage.getUser();
        
        if (token && savedUser) {
          setUser(savedUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        // Убираем console.error - просто сбрасываем пользователя
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Периодическая проверка токена (каждые 5 минут)
  useEffect(() => {
    if (!user) return; // Проверяем только если пользователь авторизован

    const interval = setInterval(() => {
      if (!isTokenValid()) {
        // Токен истек - очищаем состояние
        setUser(null);
        storage.clearAll();
        // Перенаправление произойдет автоматически через createApiRequest
      }
    }, 5 * 60 * 1000); // 5 минут

    return () => clearInterval(interval);
  }, [user]);

  // Проверка токена при фокусе окна (когда пользователь возвращается на вкладку)
  useEffect(() => {
    if (!user) return; // Проверяем только если пользователь авторизован

    const handleFocus = () => {
      if (!isTokenValid()) {
        // Токен истек - очищаем состояние
        setUser(null);
        storage.clearAll();
        // Перенаправление произойдет автоматически через createApiRequest
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  return {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    clearError: () => setError(null)
  };
};
