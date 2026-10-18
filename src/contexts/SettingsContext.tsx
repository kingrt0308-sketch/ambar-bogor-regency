import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DEFAULT_SETTINGS, type AppSettings } from '../types';

interface SettingsContextType {
  settings: AppSettings;
  loading: boolean;
  updateSettings: (data: Partial<AppSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, 'settings', 'app');
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setSettings({ ...DEFAULT_SETTINGS, ...snap.data() } as AppSettings);
        } else {
          setSettings(DEFAULT_SETTINGS);
        }
        setLoading(false);
      },
      () => {
        setSettings(DEFAULT_SETTINGS);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // Apply primary color CSS variable
  useEffect(() => {
    if (settings.primaryColor) {
      document.documentElement.style.setProperty('--primary', settings.primaryColor);
      document.documentElement.style.setProperty('--color-primary', settings.primaryColor);
    }
    if (settings.accentColor) {
      document.documentElement.style.setProperty('--accent', settings.accentColor);
    }
  }, [settings.primaryColor, settings.accentColor]);

  const updateSettings = async (data: Partial<AppSettings>) => {
    const ref = doc(db, 'settings', 'app');
    await setDoc(ref, { ...settings, ...data }, { merge: true });
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
