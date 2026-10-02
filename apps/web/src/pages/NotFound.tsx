import React from 'react';
import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-4">Page not found</p>
      <Link to="/" className="text-emerald-500 underline">Go Home</Link>
    </div>
  );
}