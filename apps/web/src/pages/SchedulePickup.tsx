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