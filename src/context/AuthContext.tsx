"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

type Subscription = {
  is_pro: boolean;
  pro_until: string | null;
};

type AuthContextType = {
  user: User | null;
  subscription: Subscription | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  subscription: null,
  isLoading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = async (userId: string) => {
    const { data } = await supabase.from('subscriptions').select('*').eq('user_id', userId).single();
    if (data) {
      const isExpired = data.pro_until ? new Date(data.pro_until) < new Date() : false;
      setSubscription({
        is_pro: data.is_pro && !isExpired,
        pro_until: data.pro_until
      });
    } else {
      setSubscription({ is_pro: false, pro_until: null });
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchSubscription(session.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          setIsLoading(true);
          fetchSubscription(session.user.id).finally(() => setIsLoading(false));
        } else {
          setSubscription(null);
          setIsLoading(false);
        }
      }
    );

    return () => authListener.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, subscription, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
