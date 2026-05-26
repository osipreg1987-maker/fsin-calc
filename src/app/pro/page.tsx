"use client";

import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Crown, Check, ArrowLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProPage() {
  const router = useRouter();
  const { user, subscription } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const isPro = subscription?.is_pro;

  const handleCheckout = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }
    
    setIsLoading(true);
    // TODO: Вызов API ЮKassa для создания платежа
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Перенаправление на оплату
      } else {
        alert("Ошибка при создании платежа");
      }
    } catch (error) {
      console.error(error);
      alert("Не удалось связаться с сервером оплаты. Возможно, API еще не настроено.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-4 md:p-8 relative">
      <button 
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-10"
      >
        <ArrowLeft size={20} />
        <span className="hidden sm:inline">Вернуться в калькулятор</span>
      </button>

      <div className="max-w-4xl mx-auto mt-16 relative z-0">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(245,158,11,0.4)] rotate-12"
          >
            <Crown size={40} className="text-slate-900" />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            FSIN Calc <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">PRO</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Раскройте весь потенциал калькулятора. Сохраняйте неограниченное количество расчетов, скачивайте официальные справки и экономьте часы работы.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Tier */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8"
          >
            <div className="text-xl font-semibold text-white mb-2">Базовый</div>
            <div className="text-3xl font-bold text-slate-500 mb-6">Бесплатно</div>
            
            <div className="space-y-4 mb-8">
              <Feature text="Базовый расчет выслуги" included />
              <Feature text="До 1 расчета в облачном архиве" included />
              <Feature text="Сложные составные периоды" included={false} />
              <Feature text="Выгрузка справок в Excel" included={false} />
            </div>
            
            <div className="w-full py-3 px-4 rounded-xl border border-slate-700 text-center text-slate-500 font-medium">
              Текущий тариф
            </div>
          </motion.div>

          {/* Pro Tier */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            transition={{ delay: 0.3 }}
            className="bg-slate-800 border-2 border-amber-500/50 rounded-3xl p-8 relative shadow-[0_0_30px_rgba(245,158,11,0.1)] overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
              ПОПУЛЯРНЫЙ
            </div>
            
            <div className="text-xl font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <Crown size={20} /> Профессионал
            </div>
            <div className="text-3xl font-bold text-white mb-6">390 ₽ <span className="text-lg text-slate-400 font-normal">/ мес</span></div>
            
            <div className="space-y-4 mb-8">
              <Feature text="Всё из Базового тарифа" included />
              <Feature text="Безлимитный облачный архив" included />
              <Feature text="Скачивание справок в Excel" included />
              <Feature text="Приоритетная поддержка" included />
            </div>
            
            {isPro ? (
               <div className="w-full py-3 px-4 rounded-xl bg-amber-500/20 text-amber-400 text-center font-medium border border-amber-500/30">
                 PRO подписка активна!
               </div>
            ) : (
               <button 
                 onClick={handleCheckout}
                 disabled={isLoading}
                 className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-70"
               >
                 {isLoading ? 'Загрузка...' : 'Оформить подписку'}
               </button>
            )}
          </motion.div>
        </div>

        {/* Правовая информация */}
        <div className="mt-12 text-center text-xs text-slate-500 space-y-2 pb-12">
          <p>Оплачивая подписку, вы соглашаетесь с условиями сервиса.</p>
          <div className="flex justify-center gap-4">
            <a href="/terms" className="hover:text-amber-400 transition-colors underline decoration-slate-700 underline-offset-4">Публичная оферта</a>
            <a href="/privacy" className="hover:text-amber-400 transition-colors underline decoration-slate-700 underline-offset-4">Политика конфиденциальности</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ text, included }: { text: string, included: boolean }) {
  return (
    <div className={`flex items-start gap-3 ${included ? 'text-slate-300' : 'text-slate-600'}`}>
      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${included ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}>
        {included ? <Check size={12} /> : <X size={12} />}
      </div>
      <span>{text}</span>
    </div>
  );
}
