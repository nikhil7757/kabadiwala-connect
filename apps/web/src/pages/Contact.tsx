import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Contact() {
  return (
    <div className="max-w-md mx-auto py-10">
      <Card>
        <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
        <form onSubmit={e => { e.preventDefault(); alert('Message sent!'); }} className="space-y-4">
          <input required placeholder="Name" className="w-full p-2 border rounded dark:bg-slate-700" />
          <input required type="email" placeholder="Email" className="w-full p-2 border rounded dark:bg-slate-700" />
          <textarea required placeholder="Message" className="w-full p-2 border rounded dark:bg-slate-700 h-32" />
          <Button type="submit" className="w-full">Send Message</Button>
        </form>
      </Card>
    </div>
  );
}