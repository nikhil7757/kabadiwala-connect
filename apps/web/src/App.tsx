import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LangProvider } from './contexts/LangContext';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <RouterProvider router={router} />
      </LangProvider>
    </ThemeProvider>
  );
}