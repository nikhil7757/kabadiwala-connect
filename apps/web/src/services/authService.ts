import { getItem, setItem } from './store';

export type UserRole = 'HOUSEHOLD' | 'COLLECTOR' | 'RECYCLER' | 'MUNICIPALITY';

export interface UserSession {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  city: string;
  token: string;
}

export const authService = {
  login: (phoneOrEmail: string, role: UserRole = 'HOUSEHOLD'): UserSession => {
    let name = 'Priya Sharma (Household)';
    let city = 'Mumbai';
    if (role === 'COLLECTOR') {
      name = 'Rajesh Kumar (Collector)';
      city = 'Mumbai';
    } else if (role === 'RECYCLER') {
      name = 'Green Earth Metals (Recycler)';
      city = 'Mumbai';
    } else if (role === 'MUNICIPALITY') {
      name = 'BMC Ward K/West (Govt)';
      city = 'Mumbai';
    }

    const session: UserSession = {
      id: 'usr_' + Date.now().toString().slice(-4),
      name,
      phone: phoneOrEmail.includes('@') ? '9876543210' : phoneOrEmail,
      email: phoneOrEmail.includes('@') ? phoneOrEmail : `${role.toLowerCase()}@demo.kc`,
      role,
      city,
      token: 'jwt_mock_' + Date.now(),
    };

    setItem('kc_auth', session);
    return session;
  },

  verifyOtp: (phone: string, otp: string, role: UserRole): UserSession => {
    return authService.login(phone, role);
  },

  logout: () => {
    setItem('kc_auth', null);
  },

  getCurrent: (): UserSession | null => {
    return getItem('kc_auth', null);
  },
};