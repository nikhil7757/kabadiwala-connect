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