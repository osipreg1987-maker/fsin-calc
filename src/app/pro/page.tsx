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

  const handleCheckout = async (planType: string = 'monthly') => {
    if (!user) {
      router.push('/auth');
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({ planType }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; 
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

      <div className="max-w-6xl mx-auto mt-16 relative z-0">
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
            Выберите подходящий формат работы, сохраняйте неограниченное количество расчетов и экономьте часы работы.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Tier 1 */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col"
          >
            <div className="text-xl font-semibold text-purple-400 mb-2">Разовый</div>
            <div className="text-3xl font-bold text-white mb-6">390 ₽ <span className="text-lg text-slate-400 font-normal">/ разово</span></div>
            
            <div className="space-y-4 mb-8 flex-1">
              <Feature text="Excel-справка с обоснованием" included />
              <Feature text="Шаблон правильного рапорта" included />
              <Feature text="Инструкция по спору" included />
              <Feature text="Доступ на 24 часа" included />
              <Feature text="Облачный архив" included={false} />
            </div>
            
            <button 
                onClick={() => handleCheckout('single')}
                disabled={isLoading}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-70 border border-slate-700"
            >
                {isLoading ? 'Загрузка...' : 'Оформить доступ'}
            </button>
          </motion.div>

          {/* Tier 2 */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.3 }}
            className="bg-slate-800 border-2 border-blue-500/50 rounded-3xl p-8 relative shadow-[0_0_30px_rgba(59,130,246,0.15)] overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              ПОПУЛЯРНЫЙ
            </div>
            
            <div className="text-xl font-semibold text-blue-400 mb-2 flex items-center gap-2">
              <Crown size={20} /> Для тыловиков
            </div>
            <div className="text-3xl font-bold text-white mb-6">990 ₽ <span className="text-lg text-slate-400 font-normal">/ мес</span></div>
            
            <div className="space-y-4 mb-8 flex-1">
              <Feature text="Безлимитная генерация справок" included />
              <Feature text="Облачный архив на всех" included />
              <Feature text="Гарантия точности по приказам" included />
              <Feature text="1 месяц PRO в подарок за друга" included />
            </div>
            
            {isPro ? (
               <div className="w-full py-3.5 px-4 rounded-xl bg-blue-500/20 text-blue-400 text-center font-bold border border-blue-500/30">
                 Подписка активна!
               </div>
            ) : (
               <button 
                 onClick={() => handleCheckout('monthly')}
                 disabled={isLoading}
                 className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] disabled:opacity-70"
               >
                 {isLoading ? 'Загрузка...' : 'Оформить подписку'}
               </button>
            )}
          </motion.div>

          {/* Tier 3 */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            transition={{ delay: 0.4 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col"
          >
            <div className="text-xl font-semibold text-green-400 mb-2 flex items-center gap-2">
              PRO на 6 месяцев
            </div>
            <div className="text-3xl font-bold text-white mb-6">3999 ₽ <span className="text-lg text-slate-400 font-normal">/ за 6 мес</span></div>
            
            <div className="space-y-4 mb-8 flex-1">
              <Feature text="Десятки часов сэкономленного времени" included />
              <Feature text="Проверьте 20 справок за 10 минут" included />
              <Feature text="Мгновенный поиск ошибок в расчетах" included />
              <Feature text="Все функции PRO тарифа на 6 мес." included />
            </div>
            
            <button 
                onClick={() => handleCheckout('half-year')}
                disabled={isLoading}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-70 border border-slate-700"
            >
                {isLoading ? 'Загрузка...' : 'Оформить подписку'}
            </button>
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
