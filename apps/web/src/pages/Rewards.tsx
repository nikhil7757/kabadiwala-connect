import React from 'react';
import Card from '../components/ui/Card';

export default function Rewards() {
  return (
    <div className="space-y-6 text-center">
      <h1 className="text-3xl font-bold">Rewards & Impact</h1>
      <Card className="max-w-md mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 text-white p-8">
        <h2 className="text-2xl font-bold">Your Points</h2>
        <div className="text-6xl font-extrabold mt-4 mb-2">450</div>
        <p>Equivalent to saving 1.2 trees! 🌳</p>
      </Card>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
        <Card><h3 className="font-bold">Badges</h3><p className="mt-2 text-4xl">🌱 ♻️ 🏆</p></Card>
        <Card><h3 className="font-bold">Leaderboard</h3><ol className="list-decimal pl-4 mt-2"><li>Rahul - 1200 pts</li><li>Anita - 950 pts</li><li>You - 450 pts</li></ol></Card>
      </div>
    </div>
  );
}