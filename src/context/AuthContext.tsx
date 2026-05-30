"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

type Subscription = {
  is_pro: boolean;
  pro_until: string | null;
  pro_calculations_made?: number;
  guaranteed_calculations?: number;
  referral_code?: string | null;
  referred_by_id?: string | null;
  referral_reward_claimed?: boolean;
  referred_friends_count?: number;
};

type AuthContextType = {
  user: User | null;
  subscription: Subscription | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  fetchSubscription: (userId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  subscription: null,
  isLoading: true,
  signOut: async () => {},
  fetchSubscription: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = async (userId: string) => {
    const { data } = await supabase.from('subscriptions').select('*').eq('user_id', userId).single();
    if (data) {
      const isExpired = data.pro_until ? new Date(data.pro_until) < new Date() : false;
      
      // Автоматическое связывание реферального кода
      if (typeof window !== 'undefined') {
        const savedRefCode = localStorage.getItem('fsin_ref_code');
        if (savedRefCode && !data.referred_by_id) {
          // Ищем владельца реферального кода
          const { data: referrerSub } = await supabase
            .from('subscriptions')
            .select('user_id')
            .eq('referral_code', savedRefCode)
            .single();

          if (referrerSub && referrerSub.user_id !== userId) {
            // Связываем реферала
            await supabase
              .from('subscriptions')
              .update({ referred_by_id: referrerSub.user_id })
              .eq('user_id', userId);
            
            localStorage.removeItem('fsin_ref_code');
            // Перезапрашиваем данные после обновления
            setTimeout(() => fetchSubscription(userId), 200);
            return;
          }
        }
      }

      const hasGuaranteedLeft = (data.guaranteed_calculations || 0) > (data.pro_calculations_made || 0);
      const isProActive = data.is_pro && (!isExpired || hasGuaranteedLeft);

      setSubscription({
        is_pro: isProActive,
        pro_until: data.pro_until,
        pro_calculations_made: data.pro_calculations_made || 0,
        guaranteed_calculations: data.guaranteed_calculations || 0,
        referral_code: data.referral_code,
        referred_by_id: data.referred_by_id,
        referral_reward_claimed: data.referral_reward_claimed,
        referred_friends_count: data.referred_friends_count || 0
      });
    } else {
      setSubscription({ is_pro: false, pro_until: null, pro_calculations_made: 0, guaranteed_calculations: 0 });
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
    <AuthContext.Provider value={{ user, subscription, isLoading, signOut, fetchSubscription }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

