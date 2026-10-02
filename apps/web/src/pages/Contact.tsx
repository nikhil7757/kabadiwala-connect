import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface FormState { name: string; email: string; phone: string; subject: string; message: string; }
interface Errors { name?: string; email?: string; message?: string; }

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.message.trim() || form.message.length < 20) e.message = 'Message must be at least 20 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1200);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto py-10 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center text-4xl mx-auto">✅</div>
        <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">Message Sent!</h2>
        <p className="text-slate-500">Thanks for reaching out, {form.name}. We'll get back to you at {form.email} within 24 hours.</p>
        <Button onClick={() => { setSuccess(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold mb-2">Contact Us</h1>
        <p className="text-slate-500">We typically respond within 24 hours on business days.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Info Cards */}
        <div className="space-y-4">
          {[
            { icon: '📞', title: 'Phone', text: '+91 98765 43210\nMon–Sat 9am–6pm' },
            { icon: '📧', title: 'Email', text: 'support@kabadiwala.in' },
            { icon: '📍', title: 'Office', text: 'Mumbai, Maharashtra\nIndia 400001' },
          ].map(({ icon, title, text }) => (
            <Card key={title} className="p-4 text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="font-bold text-sm">{title}</div>
              <div className="text-xs text-slate-500 whitespace-pre-line mt-1">{text}</div>
            </Card>
          ))}
        </div>

        {/* Form */}
        <div className="md:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Priya Sharma"
                    className={`w-full p-2.5 border-2 rounded-xl dark:bg-slate-700 outline-none transition ${errors.name ? 'border-red-400' : 'border-slate-200 dark:border-slate-600 focus:border-emerald-500'}`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="priya@example.com"
                    className={`w-full p-2.5 border-2 rounded-xl dark:bg-slate-700 outline-none transition ${errors.email ? 'border-red-400' : 'border-slate-200 dark:border-slate-600 focus:border-emerald-500'}`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone (optional)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl dark:bg-slate-700 focus:border-emerald-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <select
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full p-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl dark:bg-slate-700 focus:border-emerald-500 outline-none transition"
                >
                  <option value="">Select a topic...</option>
                  <option>Pickup Issue</option>
                  <option>Collector Complaint</option>
                  <option>Rate Query</option>
                  <option>Become a Collector</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message *</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us how we can help... (min 20 characters)"
                  rows={5}
                  className={`w-full p-2.5 border-2 rounded-xl dark:bg-slate-700 outline-none transition resize-none ${errors.message ? 'border-red-400' : 'border-slate-200 dark:border-slate-600 focus:border-emerald-500'}`}
                />
                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                <p className="text-xs text-slate-400 mt-1">{form.message.length} / 500 characters</p>
              </div>
              <Button type="submit" disabled={loading} className="w-full py-3 text-lg">
                {loading ? '⏳ Sending...' : '📨 Send Message'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}