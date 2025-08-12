import { useState, useEffect } from 'react';
import type { UserProfile, ChangePasswordRequest, UpdateUserProfileRequest } from '../types/user.types';
import { getUserProfile, changePassword, updateUserProfile } from '../services/user.service';

export const useUser = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = Boolean(user);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getUserProfile();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки профиля');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (data: ChangePasswordRequest) => {
    try {
      setError(null);
      const result = await changePassword(data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка смены пароля';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const saveProfile = async (data: UpdateUserProfileRequest) => {
    try {
      setError(null);
      const result = await updateUserProfile(data);
      if (result.success) {
        setUser(result.data);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сохранения профиля';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    refetch: fetchUser,
    updatePassword,
    saveProfile
  };
};
