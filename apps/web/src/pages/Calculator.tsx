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