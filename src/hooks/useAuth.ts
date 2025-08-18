import { useState, useEffect } from 'react';
import { signIn, signUp, signOut, getAccessToken, isAuthenticated } from '../services/auth.service';
import type { SignInRequest, SignUpRequest, SignInResponse } from '../services/auth.service';
import { storage } from '../utils/storage';

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
      const errorMessage = err instanceof Error ? err.message : 'Ошибка входа в систему';
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
      const errorMessage = err instanceof Error ? err.message : 'Ошибка регистрации';
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
      console.error('Ошибка при выходе:', err);
      // Даже если запрос не удался, очищаем локальные данные
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
        const token = getAccessToken();
        const savedUser = storage.getUser();
        
        if (token && savedUser) {
          setUser(savedUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Ошибка при проверке авторизации:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

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
