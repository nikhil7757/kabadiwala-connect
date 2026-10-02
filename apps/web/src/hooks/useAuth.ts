import { useState, useEffect } from 'react';
import { authService, UserRole, UserSession } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<UserSession | null>(authService.getCurrent());

  const login = (phoneOrEmail: string, role: UserRole = 'HOUSEHOLD') => {
    const u = authService.login(phoneOrEmail, role);
    setUser(u);
    return u;
  };

  const verifyOtp = (phone: string, otp: string, role: UserRole) => {
    const u = authService.verifyOtp(phone, otp, role);
    setUser(u);
    return u;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return { user, login, verifyOtp, logout };
};