import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<any>(authService.getCurrent());
  
  const login = (creds: any) => {
    const u = authService.login(creds);
    setUser(u);
    return u;
  };
  
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return { user, login, logout };
};