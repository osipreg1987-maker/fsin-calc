"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PaymentSimulator() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handleSimulatePayment = async () => {
    setStatus('processing');
    
    // Имитация задержки платежного шлюза
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Вызываем SQL-функцию (RPC) для безопасного обновления подписки пользователя
      const { error } = await supabase.rpc('simulate_payment');
      
      if (error) {
          console.error("RPC Error:", error);
          throw error;
      }

      setStatus('success');
      
      // Возвращаем в калькулятор
      setTimeout(() => {
        router.push('/calc');
        router.refresh(); 
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Декорация в стиле ЮKassa */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600" />
        
        <div className="mb-8 text-center">
          <div className="text-xl font-bold text-slate-900 mb-1">ЮKassa (Тестовый режим)</div>
          <div className="text-sm text-slate-500">Оплата заказа в магазине "FSIN Calc"</div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-center border border-slate-100">
          <div className="text-sm text-slate-500 mb-1">К оплате</div>
          <div className="text-4xl font-bold text-slate-900">390 ₽</div>
        </div>

        {status === 'idle' && (
          <button 
            onClick={handleSimulatePayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <CreditCard size={20} /> Симулировать успешную оплату
          </button>
        )}

        {status === 'processing' && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <div className="text-slate-600 font-medium">Обработка платежа...</div>
          </div>
        )}

        {status === 'success' && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-4 text-emerald-600"
          >
            <CheckCircle2 size={64} className="mb-4" />
            <div className="text-xl font-bold text-slate-900 mb-1">Оплата прошла успешно!</div>
            <div className="text-sm text-slate-500">Возвращаем вас на сайт...</div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-4 text-rose-600"
          >
            <AlertCircle size={64} className="mb-4" />
            <div className="text-xl font-bold text-slate-900 mb-1">Ошибка оплаты</div>
            <div className="text-sm text-slate-500">Убедитесь, что вы выполнили SQL-запрос для RPC функции в Supabase.</div>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-6 text-blue-600 font-medium hover:underline"
            >
              Попробовать снова
            </button>
          </motion.div>
        )}

        <div className="mt-8 text-center text-xs text-slate-400">
          Это тестовая страница-симулятор. Реальные деньги не списываются.
        </div>
      </div>
    </div>
  );
}
