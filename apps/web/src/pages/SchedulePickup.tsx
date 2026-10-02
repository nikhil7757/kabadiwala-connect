import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ratesService } from '../services/ratesService';
import { pickupService } from '../services/pickupService';
import { useAuth } from '../hooks/useAuth';

type Step = 1 | 2 | 3 | 4;

interface AddressForm {
  name: string;
  phone: string;
  address: string;
  pincode: string;
  city: string;
}

const SLOTS = ['9am – 11am', '11am – 1pm', '2pm – 4pm', '4pm – 6pm'];

function getNext7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split('T')[0];
  });
}

export default function SchedulePickup() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const rates = ratesService.getAll();
  const [selected, setSelected] = useState<string[]>([]);
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [addr, setAddr] = useState<AddressForm>({ name: '', phone: '', address: '', pincode: '', city: '' });
  const [addrErrors, setAddrErrors] = useState<Partial<AddressForm>>({});
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState(SLOTS[0]);

  if (!user) {
    return (
      <div className="text-center mt-16 space-y-4">
        <div className="text-5xl">🔒</div>
        <h2 className="text-2xl font-bold">Login Required</h2>
        <p className="text-slate-500">Please log in to schedule a pickup.</p>
        <Button onClick={() => nav('/login')}>Login / Sign Up</Button>
      </div>
    );
  }

  const totalEstimated = selected.reduce((sum, id) => {
    const item = rates.find((r: any) => r.id === id);
    const kg = weights[id] || 1;
    return sum + (item ? item.rate * kg : 0);
  }, 0);

  const validateAddr = () => {
    const errors: Partial<AddressForm> = {};
    if (!addr.name.trim()) errors.name = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(addr.phone)) errors.phone = 'Enter a valid 10-digit mobile number';
    if (!addr.address.trim() || addr.address.length < 10) errors.address = 'Please enter a complete address (min 10 chars)';
    if (!/^\d{6}$/.test(addr.pincode)) errors.pincode = 'Enter a valid 6-digit pincode';
    if (!addr.city.trim()) errors.city = 'City is required';
    setAddrErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirm = () => {
    const pickup = pickupService.create({
      items: selected,
      userId: user.email,
      address: `${addr.address}, ${addr.city} - ${addr.pincode}`,
      date: `${date} ${slot}`,
      totalEstimated,
    });
    nav('/track?id=' + pickup.id);
  };

  const steps = ['Select Items', 'Address', 'Date & Time', 'Review'];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {steps.map((label, i) => (
          <React.Fragment key={label}>
            <div className={`flex items-center gap-2 ${i + 1 <= step ? 'text-emerald-600' : 'text-slate-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                i + 1 < step ? 'bg-emerald-500 text-white' :
                i + 1 === step ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 border-2 border-emerald-500' :
                'bg-slate-100 dark:bg-slate-700 text-slate-400'
              }`}>
                {i + 1 < step ? '✓' : i + 1}
              </div>
              <span className="hidden sm:block text-xs font-medium">{label}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i + 1 < step ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />}
          </React.Fragment>
        ))}
      </div>

      <Card className="p-6">
        {/* Step 1: Items */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Select Items to Sell</h2>
            <p className="text-sm text-slate-500">Pick the types of scrap you want to sell. Set approximate weight for each.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rates.map((r: any) => {
                const checked = selected.includes(r.id);
                return (
                  <label
                    key={r.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${
                      checked ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 accent-emerald-500"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) setSelected([...selected, r.id]);
                        else setSelected(selected.filter(id => id !== r.id));
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{r.icon} {r.name}</div>
                      <div className="text-xs text-slate-500">Rs.{r.rate}/kg</div>
                      {checked && (
                        <div className="mt-2">
                          <input
                            type="number"
                            min="0.5"
                            step="0.5"
                            value={weights[r.id] || 1}
                            onChange={e => setWeights({ ...weights, [r.id]: parseFloat(e.target.value) || 1 })}
                            className="w-24 text-sm p-1 border rounded dark:bg-slate-700 dark:border-slate-600"
                            placeholder="kg"
                          />
                          <span className="ml-2 text-xs text-slate-400">kg</span>
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
            {selected.length > 0 && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-sm">
                <span className="font-bold text-emerald-700 dark:text-emerald-300">Estimated payout: Rs.{totalEstimated.toFixed(0)}</span>
                <span className="text-slate-500 ml-2">(based on approx. weights)</span>
              </div>
            )}
            <Button onClick={() => setStep(2)} disabled={selected.length === 0} className="w-full">
              Continue → Address
            </Button>
          </div>
        )}

        {/* Step 2: Address */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Pickup Address</h2>
            {[
              { key: 'name', label: 'Full Name', placeholder: 'e.g. Priya Sharma', type: 'text' },
              { key: 'phone', label: 'Mobile Number', placeholder: '10-digit number', type: 'tel' },
              { key: 'address', label: 'Street Address', placeholder: 'Flat no., Street, Landmark', type: 'text' },
              { key: 'pincode', label: 'Pincode', placeholder: '6-digit pincode', type: 'text' },
              { key: 'city', label: 'City', placeholder: 'e.g. Mumbai', type: 'text' },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1">{label}</label>
                <input
                  type={type}
                  value={addr[key as keyof AddressForm]}
                  onChange={e => setAddr({ ...addr, [key]: e.target.value })}
                  placeholder={placeholder}
                  className={`w-full p-2.5 border-2 rounded-xl dark:bg-slate-700 transition ${
                    addrErrors[key as keyof AddressForm]
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-slate-200 dark:border-slate-600 focus:border-emerald-500'
                  } outline-none`}
                />
                {addrErrors[key as keyof AddressForm] && (
                  <p className="text-xs text-red-500 mt-1">{addrErrors[key as keyof AddressForm]}</p>
                )}
              </div>
            ))}
            <div className="flex gap-3">
              <Button onClick={() => setStep(1)} className="flex-1 bg-slate-500 hover:bg-slate-600">← Back</Button>
              <Button onClick={() => { if (validateAddr()) setStep(3); }} className="flex-1">Continue → Date</Button>
            </div>
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Select Date & Time</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Pickup Date</label>
              <div className="grid grid-cols-4 gap-2">
                {getNext7Days().map(d => (
                  <button
                    key={d}
                    onClick={() => setDate(d)}
                    className={`p-2 rounded-xl text-xs font-medium border-2 transition ${
                      date === d ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700' : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                    }`}
                  >
                    {new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Time Slot</label>
              <div className="grid grid-cols-2 gap-2">
                {SLOTS.map(s => (
                  <button
                    key={s}
                    onClick={() => setSlot(s)}
                    className={`p-3 rounded-xl text-sm font-medium border-2 transition ${
                      slot === s ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700' : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setStep(2)} className="flex-1 bg-slate-500 hover:bg-slate-600">← Back</Button>
              <Button onClick={() => setStep(4)} disabled={!date} className="flex-1">Continue → Review</Button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Review & Confirm</h2>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <p className="text-sm font-bold text-slate-500 mb-2">ITEMS ({selected.length})</p>
                {selected.map(id => {
                  const item = rates.find((r: any) => r.id === id);
                  const kg = weights[id] || 1;
                  return item ? (
                    <div key={id} className="flex justify-between text-sm py-1">
                      <span>{item.icon} {item.name} × {kg}kg</span>
                      <span className="font-bold">Rs.{(item.rate * kg).toFixed(0)}</span>
                    </div>
                  ) : null;
                })}
                <div className="border-t border-slate-200 dark:border-slate-600 mt-2 pt-2 flex justify-between font-bold text-emerald-600">
                  <span>Estimated Total</span>
                  <span>Rs.{totalEstimated.toFixed(0)}</span>
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm space-y-1">
                <p className="font-bold text-slate-500 mb-2">ADDRESS</p>
                <p className="font-medium">{addr.name} · {addr.phone}</p>
                <p className="text-slate-600 dark:text-slate-300">{addr.address}, {addr.city} – {addr.pincode}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm">
                <p className="font-bold text-slate-500 mb-1">DATE & TIME</p>
                <p>{new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · {slot}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setStep(3)} className="flex-1 bg-slate-500 hover:bg-slate-600">← Back</Button>
              <Button onClick={handleConfirm} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                ✓ Confirm Pickup
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}