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