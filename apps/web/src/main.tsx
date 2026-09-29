import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/noto-sans-devanagari/400.css';
import '@fontsource/noto-sans-devanagari/500.css';
import '@fontsource/noto-sans-devanagari/700.css';
import '@fontsource/oswald/600.css';
import '@fontsource/oswald/700.css';
import '@fontsource/jetbrains-mono/500.css';
import './index.css';
import './i18n/index.js';
import { App } from './App.js';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
