const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'apps', 'web', 'src');

const dirs = [
  'contexts',
  'data',
  'services',
  'hooks',
  'components/layout',
  'components/ui',
  'pages',
];

dirs.forEach(d => {
  fs.mkdirSync(path.join(srcDir, d), { recursive: true });
});

const files = {
  'index.css': `
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: #10B981;     /* emerald-500 */
  --color-primary-dark: #059669; /* emerald-600 */
  --color-accent: #F59E0B;       /* amber-500 */
  --color-bg: #F8FAFC;           /* slate-50 */
  --color-surface: #FFFFFF;
  --color-text: #0F172A;         /* slate-900 */
  --color-muted: #64748B;        /* slate-500 */
  --color-border: #E2E8F0;       /* slate-200 */
}

.dark {
  --color-bg: #0F172A;
  --color-surface: #1E293B;
  --color-text: #F1F5F9;
  --color-muted: #94A3B8;
  --color-border: #334155;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: system-ui, -apple-system, sans-serif;
}
  `,

  'main.tsx': `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
  `,

  'App.tsx': `
import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LangProvider } from './contexts/LangContext';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <RouterProvider router={router} />
      </LangProvider>
    </ThemeProvider>
  );
}
  `,

  'router.tsx': `
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ScrapRates from './pages/ScrapRates';
import Calculator from './pages/Calculator';
import SchedulePickup from './pages/SchedulePickup';
import TrackPickup from './pages/TrackPickup';
import FindCollectors from './pages/FindCollectors';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import CollectorDashboard from './pages/CollectorDashboard';
import Rewards from './pages/Rewards';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'rates', element: <ScrapRates /> },
      { path: 'calculator', element: <Calculator /> },
      { path: 'schedule', element: <SchedulePickup /> },
      { path: 'track', element: <TrackPickup /> },
      { path: 'collectors', element: <FindCollectors /> },
      { path: 'login', element: <Login /> },
      { path: 'dashboard', element: <UserDashboard /> },
      { path: 'collector', element: <CollectorDashboard /> },
      { path: 'rewards', element: <Rewards /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'terms', element: <Terms /> },
      { path: '*', element: <NotFound /> }
    ]
  }
]);
  `,

  'contexts/ThemeContext.tsx': `
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {}
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(!isDark) }}>
      {children}
    </ThemeContext.Provider>
  );
};
  `,

  'contexts/LangContext.tsx': `
import React, { createContext, useState, useEffect } from 'react';

export const LangContext = createContext({
  lang: 'en',
  setLang: (lang: string) => {}
});

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState(() => localStorage.getItem('lang') || 'en');

  const setLang = (l: string) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};
  `,

  'data/seed.ts': `
export const scrapItems = [
  { id: '1', name: 'Paper', category: 'paper', rate: 15, icon: '📄' },
  { id: '2', name: 'Cardboard', category: 'paper', rate: 10, icon: '📦' },
  { id: '3', name: 'PET Plastic', category: 'plastic', rate: 20, icon: '🥤' },
  { id: '4', name: 'HDPE Plastic', category: 'plastic', rate: 25, icon: '🧴' },
  { id: '5', name: 'Copper', category: 'metal', rate: 600, icon: '🔌' },
  { id: '6', name: 'Iron', category: 'metal', rate: 30, icon: '🔩' },
  { id: '7', name: 'Aluminium', category: 'metal', rate: 120, icon: '🥫' },
  { id: '8', name: 'Laptop', category: 'e-waste', rate: 500, icon: '💻' },
  { id: '9', name: 'Mobile', category: 'e-waste', rate: 200, icon: '📱' },
  { id: '10', name: 'CRT Monitor', category: 'e-waste', rate: 100, icon: '🖥' },
  { id: '11', name: 'Glass Bottles', category: 'glass', rate: 5, icon: '🍾' },
  { id: '12', name: 'Mixed Glass', category: 'glass', rate: 2, icon: '🪟' },
];

export const collectors = [
  { id: 'c1', name: 'Rajesh Kumar', phone: '9876543210', city: 'Mumbai', rating: 4.8, categories: ['paper', 'plastic', 'metal'], slots: ['9am-11am', '2pm-4pm'] },
  { id: 'c2', name: 'Amit Singh', phone: '9876543211', city: 'Pune', rating: 4.5, categories: ['e-waste', 'metal'], slots: ['11am-1pm', '4pm-6pm'] },
  { id: 'c3', name: 'Suresh Patel', phone: '9876543212', city: 'Delhi', rating: 4.9, categories: ['paper', 'plastic', 'glass'], slots: ['9am-11am', '11am-1pm'] },
  { id: 'c4', name: 'Vikram Sharma', phone: '9876543213', city: 'Bangalore', rating: 4.2, categories: ['metal', 'e-waste'], slots: ['2pm-4pm', '4pm-6pm'] },
  { id: 'c5', name: 'Ramesh Gupta', phone: '9876543214', city: 'Mumbai', rating: 4.6, categories: ['plastic', 'metal'], slots: ['9am-11am', '4pm-6pm'] },
  { id: 'c6', name: 'Anil Desai', phone: '9876543215', city: 'Pune', rating: 3.9, categories: ['paper', 'glass'], slots: ['11am-1pm', '2pm-4pm'] },
  { id: 'c7', name: 'Kiran Reddy', phone: '9876543216', city: 'Bangalore', rating: 4.7, categories: ['e-waste', 'plastic'], slots: ['9am-11am', '11am-1pm'] },
  { id: 'c8', name: 'Manoj Tiwari', phone: '9876543217', city: 'Delhi', rating: 4.1, categories: ['metal', 'glass'], slots: ['2pm-4pm', '4pm-6pm'] },
];

export const pickups = Array.from({ length: 30 }).map((_, i) => ({
  id: 'p' + i,
  userId: i % 2 === 0 ? 'user1' : 'user2',
  collectorId: collectors[i % collectors.length].id,
  status: ['REQUESTED', 'ACCEPTED', 'ON_THE_WAY', 'WEIGHED', 'PAID'][i % 5],
  date: new Date(Date.now() - i * 86400000).toISOString(),
  items: ['1', '3', '5'],
  totalEstimated: 150 + i * 10
}));
  `,

  'services/store.ts': `
export const getItem = <T>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || '') ?? fallback; } catch { return fallback; }
};
export const setItem = <T>(key: string, value: T) => localStorage.setItem(key, JSON.stringify(value));
  `,

  'services/pickupService.ts': `
import { getItem, setItem } from './store';
import { pickups as seedPickups } from '../data/seed';

export const pickupService = {
  getAll: () => getItem('pickups', seedPickups),
  getByUser: (userId: string) => getItem('pickups', seedPickups).filter((p: any) => p.userId === userId),
  create: (pickup: any) => {
    const all = getItem('pickups', seedPickups);
    const newPickup = { id: 'p_' + Date.now(), ...pickup, status: 'REQUESTED' };
    setItem('pickups', [newPickup, ...all]);
    return newPickup;
  },
  accept: (id: string, collectorId: string) => {
    const all = getItem('pickups', seedPickups);
    const updated = all.map((p: any) => p.id === id ? { ...p, status: 'ACCEPTED', collectorId } : p);
    setItem('pickups', updated);
  }
};
  `,

  'services/collectorService.ts': `
import { getItem } from './store';
import { collectors as seedCollectors } from '../data/seed';

export const collectorService = {
  getAll: () => getItem('collectors', seedCollectors),
};
  `,

  'services/authService.ts': `
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
  `,

  'services/ratesService.ts': `
import { getItem } from './store';
import { scrapItems } from '../data/seed';

export const ratesService = {
  getAll: () => getItem('rates', scrapItems)
};
  `,

  'hooks/useTheme.ts': `
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
export const useTheme = () => useContext(ThemeContext);
  `,

  'hooks/useLang.ts': `
import { useContext } from 'react';
import { LangContext } from '../contexts/LangContext';
export const useLang = () => useContext(LangContext);
  `,

  'hooks/useAuth.ts': `
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
  `,

  'components/layout/Navbar.tsx': `
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useLang } from '../../hooks/useLang';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { lang, setLang } = useLang();
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <nav className="p-4 bg-emerald-500 text-white flex justify-between items-center shadow">
      <Link to="/" className="font-bold text-xl">Kabadiwala Connect</Link>
      <div className="flex gap-4 items-center">
        <Link to="/rates">Rates</Link>
        <Link to="/schedule">Schedule</Link>
        <button onClick={toggleTheme}>{isDark ? '☀️' : '🌙'}</button>
        <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}>{lang.toUpperCase()}</button>
        {user ? (
          <>
            <Link to={user.role === 'COLLECTOR' ? '/collector' : '/dashboard'}>Dashboard</Link>
            <button onClick={() => { logout(); nav('/'); }}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="bg-white text-emerald-600 px-3 py-1 rounded">Login</Link>
        )}
      </div>
    </nav>
  );
}
  `,

  'components/layout/Footer.tsx': `
import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="p-8 bg-slate-900 text-slate-300 text-center">
      <div className="flex justify-center gap-4 mb-4">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
      </div>
      <p>&copy; 2026 Kabadiwala Connect. All rights reserved.</p>
    </footer>
  );
}
  `,

  'components/layout/Layout.tsx': `
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <main className="flex-1 container mx-auto p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
  `,

  'components/ui/Button.tsx': `
import React from 'react';
export default function Button({ children, className = '', ...props }: any) {
  return (
    <button className={\`bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded transition \${className}\`} {...props}>
      {children}
    </button>
  );
}
  `,

  'components/ui/Card.tsx': `
import React from 'react';
export default function Card({ children, className = '' }: any) {
  return (
    <div className={\`bg-white dark:bg-slate-800 rounded shadow p-4 \${className}\`}>
      {children}
    </div>
  );
}
  `,

  'components/ui/Badge.tsx': `
import React from 'react';
export default function Badge({ children, className = '' }: any) {
  return (
    <span className={\`inline-block px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 \${className}\`}>
      {children}
    </span>
  );
}
  `,

  'components/ui/Toast.tsx': `
import React from 'react';
export default function Toast() { return null; /* implement global toast if needed */ }
  `,

  'components/ui/Skeleton.tsx': `
import React from 'react';
export default function Skeleton() { return <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-4 rounded w-full"></div>; }
  `,

  'components/ui/Modal.tsx': `
import React from 'react';
export default function Modal({ children, open, onClose }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded shadow-xl relative w-full max-w-md">
        <button className="absolute top-2 right-2" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}
  `,

  'pages/Home.tsx': `
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ratesService } from '../services/ratesService';

export default function Home() {
  const rates = ratesService.getAll();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setCount(c => c >= 5000 ? 5000 : c + 10);
    }, 10);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="space-y-12">
      <section className="text-center py-20 bg-emerald-50 dark:bg-slate-800 rounded-xl">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-amber-500 mb-6">
          Turn Your Scrap into ₹Cash
        </h1>
        <p className="text-xl mb-8">Fast, reliable, and eco-friendly scrap pickup at your doorstep.</p>
        <div className="flex justify-center gap-4">
          <Link to="/schedule"><Button className="text-lg px-8">Schedule Pickup</Button></Link>
          <Link to="/rates"><button className="text-lg px-8 py-2 rounded font-bold border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400">View Rates</button></Link>
        </div>
      </section>

      <section className="bg-emerald-500 text-white p-2 overflow-hidden whitespace-nowrap rounded">
        <div className="animate-[marquee_20s_linear_infinite] inline-block">
          {rates.map((r: any) => (
            <span key={r.id} className="mx-4 font-bold">{r.icon} {r.name}: ₹{r.rate}/kg</span>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 text-center">
        <Card>
          <div className="text-4xl mb-4">📍</div>
          <h3 className="text-xl font-bold mb-2">1. Schedule</h3>
          <p>Book a pickup at your convenience.</p>
        </Card>
        <Card>
          <div className="text-4xl mb-4">⚖️</div>
          <h3 className="text-xl font-bold mb-2">2. Weigh</h3>
          <p>We weigh your scrap accurately.</p>
        </Card>
        <Card>
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-xl font-bold mb-2">3. Get Paid</h3>
          <p>Instant cash or digital payment.</p>
        </Card>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold mb-4">Impact So Far</h2>
        <div className="text-5xl font-extrabold text-emerald-500">{count.toLocaleString()}+ kg</div>
        <p className="text-lg">Recycled</p>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">Testimonials</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {['Priya S.', 'Rahul M.', 'Anita D.'].map(name => (
            <Card key={name} className="italic">"{name} says it's the best scrap service!"</Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">FAQ</h2>
        <div className="space-y-4 max-w-2xl mx-auto">
          <details className="p-4 bg-white dark:bg-slate-800 rounded shadow"><summary className="font-bold cursor-pointer">What items do you collect?</summary><p className="mt-2">Paper, plastic, metal, e-waste, and more.</p></details>
          <details className="p-4 bg-white dark:bg-slate-800 rounded shadow"><summary className="font-bold cursor-pointer">Is there a minimum weight?</summary><p className="mt-2">Yes, at least 10kg for free pickup.</p></details>
        </div>
      </section>
    </div>
  );
}
  `,

  'pages/ScrapRates.tsx': `
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { ratesService } from '../services/ratesService';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ScrapRates() {
  const [search, setSearch] = useState('');
  const rates = ratesService.getAll().filter((r: any) => r.name.toLowerCase().includes(search.toLowerCase()));
  const data = rates.map((r: any) => ({ name: r.name, rate: r.rate }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Scrap Rates</h1>
      <input 
        className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" 
        placeholder="Search items..." 
        value={search} onChange={e => setSearch(e.target.value)} 
      />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {rates.map((r: any) => (
              <li key={r.id} className="py-2 flex justify-between">
                <span>{r.icon} {r.name}</span>
                <span className="font-bold text-emerald-600">₹{r.rate}/kg</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#10B981" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
  `,

  'pages/Calculator.tsx': `
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ratesService } from '../services/ratesService';

export default function Calculator() {
  const rates = ratesService.getAll();
  const [items, setItems] = useState([{ id: rates[0].id, weight: 1 }]);

  const total = items.reduce((sum, item) => {
    const rate = rates.find((r: any) => r.id === item.id)?.rate || 0;
    return sum + (rate * item.weight);
  }, 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Value Calculator</h1>
      <Card className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4 items-center">
            <select 
              className="flex-1 p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
              value={item.id} onChange={e => {
                const newItems = [...items];
                newItems[index].id = e.target.value;
                setItems(newItems);
              }}
            >
              {rates.map((r: any) => <option key={r.id} value={r.id}>{r.name} (₹{r.rate}/kg)</option>)}
            </select>
            <input 
              type="number" min="1" className="w-24 p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
              value={item.weight} onChange={e => {
                const newItems = [...items];
                newItems[index].weight = Number(e.target.value);
                setItems(newItems);
              }}
            /> kg
            <button onClick={() => setItems(items.filter((_, i) => i !== index))} className="text-red-500 font-bold">X</button>
          </div>
        ))}
        <Button onClick={() => setItems([...items, { id: rates[0].id, weight: 1 }])}>Add Item</Button>
        <div className="mt-8 text-right text-2xl font-bold border-t pt-4">
          Total Estimated: <span className="text-emerald-500">₹{total}</span>
        </div>
      </Card>
    </div>
  );
}
  `,

  'pages/SchedulePickup.tsx': `
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ratesService } from '../services/ratesService';
import { pickupService } from '../services/pickupService';
import { useAuth } from '../hooks/useAuth';

export default function SchedulePickup() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const rates = ratesService.getAll();
  const [selected, setSelected] = useState<string[]>([]);

  if (!user) {
    return <div className="text-center mt-10">Please <Button onClick={() => nav('/login')}>Login</Button> to schedule.</div>;
  }

  const handleConfirm = () => {
    const pickup = pickupService.create({ items: selected, userId: user.email, address: 'Test Address', date: new Date().toISOString() });
    nav('/track?id=' + pickup.id);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Schedule Pickup - Step {step}</h1>
      <Card>
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Select Items</h2>
            <div className="grid grid-cols-2 gap-4">
              {rates.map((r: any) => (
                <label key={r.id} className="flex items-center gap-2">
                  <input type="checkbox" checked={selected.includes(r.id)} onChange={(e) => {
                    if (e.target.checked) setSelected([...selected, r.id]);
                    else setSelected(selected.filter(id => id !== r.id));
                  }} />
                  {r.icon} {r.name} (₹{r.rate}/kg)
                </label>
              ))}
            </div>
            <Button onClick={() => setStep(2)} disabled={selected.length === 0}>Next</Button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Address</h2>
            <input placeholder="Full Address" className="w-full p-2 border rounded dark:bg-slate-700" />
            <div className="flex gap-4">
              <Button onClick={() => setStep(1)} className="bg-slate-500">Back</Button>
              <Button onClick={() => setStep(3)}>Next</Button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Date & Time</h2>
            <input type="date" className="w-full p-2 border rounded dark:bg-slate-700" />
            <select className="w-full p-2 border rounded dark:bg-slate-700 mt-2">
              <option>9am - 11am</option>
              <option>11am - 1pm</option>
            </select>
            <div className="flex gap-4 mt-4">
              <Button onClick={() => setStep(2)} className="bg-slate-500">Back</Button>
              <Button onClick={() => setStep(4)}>Next</Button>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Review</h2>
            <p>Items: {selected.length}</p>
            <div className="flex gap-4 mt-4">
              <Button onClick={() => setStep(3)} className="bg-slate-500">Back</Button>
              <Button onClick={handleConfirm}>Confirm Pickup</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
  `,

  'pages/TrackPickup.tsx': `
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import { pickupService } from '../services/pickupService';
import { useAuth } from '../hooks/useAuth';

const STEPS = ['REQUESTED', 'ACCEPTED', 'ON_THE_WAY', 'WEIGHED', 'PAID'];

export default function TrackPickup() {
  const [params] = useSearchParams();
  const { user } = useAuth();
  const id = params.get('id');
  
  let pickup = null;
  if (id) {
    pickup = pickupService.getAll().find((p: any) => p.id === id);
  } else if (user) {
    pickup = pickupService.getByUser(user.email)[0];
  }

  if (!pickup) return <div className="text-center mt-10">No pickup found.</div>;

  const currentIndex = STEPS.indexOf(pickup.status);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Track Pickup: {pickup.id}</h1>
      <Card className="p-8">
        <div className="relative">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center mb-8 last:mb-0">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={\`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white z-10 \${i <= currentIndex ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}\`}
              >
                {i + 1}
              </motion.div>
              <div className={\`ml-4 text-lg font-bold \${i <= currentIndex ? 'text-emerald-600' : 'text-slate-400'}\`}>
                {s.replace(/_/g, ' ')}
              </div>
            </div>
          ))}
          <div className="absolute left-4 top-4 bottom-4 w-1 bg-slate-200 dark:bg-slate-700 -z-10">
             <motion.div 
                className="w-full bg-emerald-500 origin-top"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: currentIndex / (STEPS.length - 1) }}
                style={{ height: '100%' }}
             />
          </div>
        </div>
      </Card>
    </div>
  );
}
  `,

  'pages/FindCollectors.tsx': `
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { collectorService } from '../services/collectorService';

export default function FindCollectors() {
  const [city, setCity] = useState('');
  const collectors = collectorService.getAll().filter((c: any) => !city || c.city === city);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Find Collectors</h1>
      <select value={city} onChange={e => setCity(e.target.value)} className="p-2 border rounded dark:bg-slate-800">
        <option value="">All Cities</option>
        <option value="Mumbai">Mumbai</option>
        <option value="Delhi">Delhi</option>
        <option value="Pune">Pune</option>
        <option value="Bangalore">Bangalore</option>
      </select>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collectors.map((c: any) => (
          <Card key={c.id}>
            <h3 className="text-xl font-bold">{c.name}</h3>
            <p className="text-slate-500">📍 {c.city}</p>
            <p className="text-amber-500 font-bold">⭐ {c.rating}</p>
            <div className="mt-2 flex gap-2 flex-wrap">
              {c.categories.map((cat: string) => <Badge key={cat}>{cat}</Badge>)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
  `,

  'pages/Login.tsx': `
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('user@demo.kc');
  const [password, setPassword] = useState('Demo@1234');
  const { login } = useAuth();
  const nav = useNavigate();

  const handleLogin = (e: any) => {
    e.preventDefault();
    const user = login({ email, password });
    if (user.role === 'COLLECTOR') nav('/collector');
    else nav('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700" />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700" />
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
        <div className="mt-4 text-sm text-center space-x-4">
          <button onClick={() => setEmail('user@demo.kc')} className="text-emerald-500 underline">User Demo</button>
          <button onClick={() => setEmail('collector@demo.kc')} className="text-emerald-500 underline">Collector Demo</button>
        </div>
      </Card>
    </div>
  );
}
  `,

  'pages/UserDashboard.tsx': `
import React from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import { pickupService } from '../services/pickupService';

export default function UserDashboard() {
  const { user } = useAuth();
  const pickups = pickupService.getByUser(user?.email);

  if (!user) return <div>Please login.</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <Card><h3 className="text-lg">Total Pickups</h3><p className="text-3xl font-bold text-emerald-500">{pickups.length}</p></Card>
        <Card><h3 className="text-lg">Total Earned</h3><p className="text-3xl font-bold text-emerald-500">₹{pickups.reduce((s: any, p: any) => s + (p.totalEstimated || 0), 0)}</p></Card>
        <Card><h3 className="text-lg">Rewards Points</h3><p className="text-3xl font-bold text-amber-500">450</p></Card>
      </div>
      <h2 className="text-2xl font-bold">Your Pickups</h2>
      <div className="space-y-4">
        {pickups.map((p: any) => (
          <Card key={p.id} className="flex justify-between items-center">
            <div>
              <p className="font-bold">ID: {p.id}</p>
              <p className="text-sm text-slate-500">{new Date(p.date).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <Badge>{p.status}</Badge>
              <p className="mt-1 font-bold">₹{p.totalEstimated}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
  `,

  'pages/CollectorDashboard.tsx': `
import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { pickupService } from '../services/pickupService';
import { useAuth } from '../hooks/useAuth';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function CollectorDashboard() {
  const { user } = useAuth();
  const [pickups, setPickups] = useState<any[]>([]);

  useEffect(() => {
    const fetchPickups = () => setPickups(pickupService.getAll());
    fetchPickups();
    const i = setInterval(fetchPickups, 3000);
    return () => clearInterval(i);
  }, []);

  if (!user || user.role !== 'COLLECTOR') return <div>Access Denied.</div>;

  const handleAccept = (id: string) => {
    pickupService.accept(id, user.email);
    setPickups(pickupService.getAll());
  };

  const requests = pickups.filter(p => p.status === 'REQUESTED');
  const myPickups = pickups.filter(p => p.collectorId === user.email);

  const data = [{name: 'Mon', earn: 400}, {name: 'Tue', earn: 300}, {name: 'Wed', earn: 800}];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Collector Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">New Requests</h2>
          <div className="space-y-4">
             {requests.map(p => (
               <Card key={p.id}>
                 <p><strong>ID:</strong> {p.id}</p>
                 <p><strong>Est:</strong> ₹{p.totalEstimated}</p>
                 <Button className="mt-2" onClick={() => handleAccept(p.id)}>Accept</Button>
               </Card>
             ))}
             {requests.length === 0 && <p>No new requests.</p>}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Earnings</h2>
          <Card className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="earn" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <h2 className="text-2xl font-bold my-4">My Pickups</h2>
          <div className="space-y-2">
            {myPickups.map(p => (
               <Card key={p.id} className="flex justify-between">
                 <span>{p.id}</span>
                 <Badge>{p.status}</Badge>
               </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
  `,

  'pages/Rewards.tsx': `
import React from 'react';
import Card from '../components/ui/Card';

export default function Rewards() {
  return (
    <div className="space-y-6 text-center">
      <h1 className="text-3xl font-bold">Rewards & Impact</h1>
      <Card className="max-w-md mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 text-white p-8">
        <h2 className="text-2xl font-bold">Your Points</h2>
        <div className="text-6xl font-extrabold mt-4 mb-2">450</div>
        <p>Equivalent to saving 1.2 trees! 🌳</p>
      </Card>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
        <Card><h3 className="font-bold">Badges</h3><p className="mt-2 text-4xl">🌱 ♻️ 🏆</p></Card>
        <Card><h3 className="font-bold">Leaderboard</h3><ol className="list-decimal pl-4 mt-2"><li>Rahul - 1200 pts</li><li>Anita - 950 pts</li><li>You - 450 pts</li></ol></Card>
      </div>
    </div>
  );
}
  `,

  'pages/About.tsx': `
import React from 'react';
export default function About() {
  return <div className="max-w-2xl mx-auto py-10"><h1 className="text-3xl font-bold mb-4">About Us</h1><p>Kabadiwala Connect aims to organize the unorganized scrap sector in India.</p></div>;
}
  `,

  'pages/Contact.tsx': `
import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Contact() {
  return (
    <div className="max-w-md mx-auto py-10">
      <Card>
        <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
        <form onSubmit={e => { e.preventDefault(); alert('Message sent!'); }} className="space-y-4">
          <input required placeholder="Name" className="w-full p-2 border rounded dark:bg-slate-700" />
          <input required type="email" placeholder="Email" className="w-full p-2 border rounded dark:bg-slate-700" />
          <textarea required placeholder="Message" className="w-full p-2 border rounded dark:bg-slate-700 h-32" />
          <Button type="submit" className="w-full">Send Message</Button>
        </form>
      </Card>
    </div>
  );
}
  `,

  'pages/Privacy.tsx': `
import React from 'react';
export default function Privacy() { return <div className="p-10">Privacy Policy...</div>; }
  `,

  'pages/Terms.tsx': `
import React from 'react';
export default function Terms() { return <div className="p-10">Terms of Service...</div>; }
  `,

  'pages/NotFound.tsx': `
import React from 'react';
import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-4">Page not found</p>
      <Link to="/" className="text-emerald-500 underline">Go Home</Link>
    </div>
  );
}
  `
};

Object.entries(files).forEach(([file, content]) => {
  fs.writeFileSync(path.join(srcDir, file), content.trim());
});
console.log('Scaffold complete.');
