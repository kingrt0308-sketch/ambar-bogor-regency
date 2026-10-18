import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { AppUser, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  registerWarga: (
    email: string,
    password: string,
    data: { nama: string; blok: string; noRumah: string; phone?: string }
  ) => Promise<void>;
  isAdmin: boolean;
  isWarga: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (snap.exists()) {
            setProfile({ uid: firebaseUser.uid, ...snap.data() } as AppUser);
          } else {
            setProfile(null);
          }
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const registerWarga = async (
    email: string,
    password: string,
    data: { nama: string; blok: string; noRumah: string; phone?: string }
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const newUser: AppUser = {
      uid: cred.user.uid,
      email,
      role: 'warga',
      nama: data.nama,
      blok: data.blok,
      noRumah: data.noRumah,
      phone: data.phone || '',
      createdAt: new Date().toISOString(),
      active: true,
    };
    await setDoc(doc(db, 'users', cred.user.uid), newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        logout,
        registerWarga,
        isAdmin: profile?.role === 'admin',
        isWarga: profile?.role === 'warga',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
