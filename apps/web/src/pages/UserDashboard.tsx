import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { pickupService } from '../services/pickupService';

const STATUS_COLORS: Record<string, string> = {
  REQUESTED: 'bg-amber-100 text-amber-700',
  ACCEPTED: 'bg-blue-100 text-blue-700',
  ON_THE_WAY: 'bg-purple-100 text-purple-700',
  WEIGHED: 'bg-teal-100 text-teal-700',
  PAID: 'bg-emerald-100 text-emerald-700',
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [pickups, setPickups] = useState<any[]>([]);
  const [tab, setTab] = useState<'upcoming' | 'history'>('upcoming');

  useEffect(() => {
    const load = () => setPickups(pickupService.getByUser(user?.email));
    load();
    const i = setInterval(load, 3000);
    return () => clearInterval(i);
  }, [user?.email]);

  if (!user) {
    return (
      <div className="text-center mt-16 space-y-4">
        <div className="text-5xl">👤</div>
        <h2 className="text-2xl font-bold">Login Required</h2>
        <p className="text-slate-500">Please log in to view your dashboard.</p>
        <Link to="/login"><Button>Login / Sign Up</Button></Link>
      </div>
    );
  }

  const totalEarned = pickups.filter(p => p.status === 'PAID').reduce((s: number, p: any) => s + (p.totalEstimated || 0), 0);
  const totalKg = pickups.filter(p => p.status === 'PAID').length * 8; // avg 8 kg per pickup
  const co2Saved = (totalKg * 0.5).toFixed(1); // avg 0.5 kg CO2 per kg scrap
  const points = pickups.filter(p => p.status === 'PAID').length * 50;

  const upcoming = pickups.filter(p => !['PAID'].includes(p.status));
  const history = pickups.filter(p => p.status === 'PAID');
  const displayed = tab === 'upcoming' ? upcoming : history;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Welcome back, {user.name} 👋</h1>
          <p className="text-slate-500 mt-1">{user.email}</p>
        </div>
        <Link to="/schedule">
          <Button className="hidden sm:flex">+ New Pickup</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '📦', label: 'Total Pickups', value: pickups.length, color: 'text-emerald-600' },
          { icon: '₹', label: 'Total Earned', value: `Rs.${totalEarned.toLocaleString()}`, color: 'text-emerald-600' },
          { icon: '♻️', label: 'kg Recycled', value: `${totalKg} kg`, color: 'text-teal-600' },
          { icon: '🌿', label: 'CO₂ Saved', value: `${co2Saved} kg`, color: 'text-green-600' },
        ].map(stat => (
          <Card key={stat.label} className="p-5 text-center">
            <div className="text-3xl mb-1">{stat.icon}</div>
            <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Rewards Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-white flex items-center justify-between">
        <div>
          <div className="font-bold text-lg">🏆 You have {points} reward points!</div>
          <div className="text-sm text-amber-100">Redeem for Amazon Pay, Paytm, or e-commerce vouchers.</div>
        </div>
        <Link to="/rewards">
          <button className="px-4 py-2 bg-white text-amber-600 rounded-xl font-bold text-sm hover:bg-amber-50 transition">
            View Rewards
          </button>
        </Link>
      </div>

      {/* Pickups Tabs */}
      <div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('upcoming')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === 'upcoming' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
          >
            Upcoming ({upcoming.length})
          </button>
          <button
            onClick={() => setTab('history')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === 'history' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
          >
            History ({history.length})
          </button>
        </div>

        {displayed.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-semibold text-slate-500">
              {tab === 'upcoming' ? 'No upcoming pickups.' : 'No completed pickups yet.'}
            </p>
            {tab === 'upcoming' && (
              <Link to="/schedule" className="mt-4 inline-block">
                <Button>Schedule a Pickup</Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="space-y-3">
            {displayed.map((p: any) => (
              <Card key={p.id} className="p-4 flex items-center justify-between hover:shadow-md transition">
                <div>
                  <p className="font-bold text-sm">Pickup #{p.id}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{new Date(p.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{p.address}</p>
                </div>
                <div className="text-right space-y-1">
                  <span className={`inline-block text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLORS[p.status] || 'bg-slate-100 text-slate-600'}`}>
                    {p.status.replace(/_/g, ' ')}
                  </span>
                  <p className="text-sm font-bold text-emerald-600">Rs.{p.totalEstimated}</p>
                  <Link to={`/track?id=${p.id}`} className="text-xs text-emerald-500 hover:underline block">
                    Track →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}