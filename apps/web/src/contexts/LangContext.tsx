import React, { createContext, useState, useEffect } from 'react';

export const LangContext = createContext({
  lang: 'en',
  setLang: (lang: string) => {}
});

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState(() => localStorage.getItem('lang') || 'en');

  const setLang = (l: string) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};