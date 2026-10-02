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