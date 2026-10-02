import { getItem, setItem } from './store';

export const authService = {
  login: (creds: any) => {
    let role = 'USER';
    if (creds.email === 'collector@demo.kc') role = 'COLLECTOR';
    const user = { token: 'mock-token', role, email: creds.email, name: 'Demo User' };
    setItem('kc_auth', user);
    return user;
  },
  logout: () => setItem('kc_auth', null),
  getCurrent: () => getItem('kc_auth', null)
};