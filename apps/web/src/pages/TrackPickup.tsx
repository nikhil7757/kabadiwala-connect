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
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white z-10 ${i <= currentIndex ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
              >
                {i + 1}
              </motion.div>
              <div className={`ml-4 text-lg font-bold ${i <= currentIndex ? 'text-emerald-600' : 'text-slate-400'}`}>
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