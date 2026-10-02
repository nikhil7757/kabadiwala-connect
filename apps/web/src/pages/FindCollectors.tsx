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