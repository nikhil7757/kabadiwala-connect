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