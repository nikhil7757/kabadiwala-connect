import { useContext } from 'react';
import { LangContext } from '../contexts/LangContext';
export const useLang = () => useContext(LangContext);