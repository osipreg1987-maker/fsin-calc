"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';

function PaymentSimulatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const planType = searchParams.get('planType') || 'single';
  const archiveId = searchParams.get('archiveId');
  
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSimulatePayment = async () => {
    setStatus('processing');
    setErrorMessage('');
    
    // Имитация задержки платежного шлюза
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      let error;
      
      if (planType.startsWith('donate-')) {
        setStatus('success');
        setTimeout(() => {
          router.push('/calc?just_donated=true');
          router.refresh(); 
        }, 2000);
        return;
      }
      
      // Вызываем SQL-функцию (RPC) для безопасного обновления подписки пользователя (PRO)
      console.log("Вызов RPC simulate_payment для PRO подписки");
      const result = await supabase.rpc('simulate_payment');
      error = result.error;

      // Если платеж прошел успешно, обновляем сроки и начисляем лимиты
      if (!error) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // 1. Выставляем дату окончания (30 дней для single/monthly, 6 месяцев для half-year)
          if (planType === 'half-year') {
            const sixMonthsLater = new Date();
            sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
            await supabase
              .from('subscriptions')
              .update({
                is_pro: true,
                pro_until: sixMonthsLater.toISOString()
              })
              .eq('user_id', user.id);
          } else {
            const thirtyDaysLater = new Date();
            thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
            await supabase
              .from('subscriptions')
              .update({
                is_pro: true,
                pro_until: thirtyDaysLater.toISOString()
              })
              .eq('user_id', user.id);
          }

          // 2. Начисляем гарантированные расчеты (+1 для single, +5 для monthly, +30 для half-year)
          const amount = planType === 'half-year' ? 30 : (planType === 'monthly' ? 5 : 1);
          console.log(`Начисление ${amount} гарантированных расчетов для тарифа ${planType}...`);
          await supabase.rpc('add_guaranteed_calculations', {
            user_id_param: user.id,
            amount_param: amount
          });

          // 3. Если куплен разовый расчет под конкретный архив, разблокируем эту запись
          if (planType === 'single' && archiveId) {
            console.log(`Разблокировка конкретной записи в архиве: ${archiveId}`);
            await supabase
              .from('archives')
              .update({ is_unlocked: true })
              .eq('id', archiveId);
          }

          // 4. Начисляем реферальный бонус пригласившему (только для полноценных PRO подписок)
          if (planType !== 'single') {
            console.log("Вызов RPC process_referral_reward для реферера...");
            await supabase.rpc('process_referral_reward', {
              friend_id: user.id,
              plan_type: planType
            });
          }
        }
      }
      
      if (error) {
          console.error("Payment simulator update error:", error);
          throw error;
      }

      setStatus('success');
      
      // Возвращаем в калькулятор с реферальным флагом успешной оплаты
      setTimeout(() => {
        router.push(`/calc?just_paid=true&planType=${planType}`);
        router.refresh(); 
      }, 2000);
      
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Произошла ошибка при обновлении статуса в базе данных.');
      setStatus('error');
    }
  };

  const getPrice = () => {
    if (planType === 'monthly') return '990 ₽';
    if (planType === 'half-year') return '2 990 ₽';
    if (planType === 'donate-coffee') return '190 ₽';
    if (planType === 'donate-pizza') return '490 ₽';
    if (planType === 'donate-server') return '1 490 ₽';
    return '390 ₽';
  };

  const getPlanTitle = () => {
    if (planType === 'monthly') return 'PRO Тариф (Месячный)';
    if (planType === 'half-year') return 'PRO Тариф (Полугодовой)';
    if (planType === 'single') return 'Разовый расчет (Мини-PRO)';
    if (planType === 'donate-coffee') return '☕ Угостить кофе (Спонсорство)';
    if (planType === 'donate-pizza') return '🍕 Накормить пиццей (Спонсорство)';
    if (planType === 'donate-server') return '🚀 Спонсировать сервер (Спонсорство)';
    return 'FSIN Calc Тариф';
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Декорация в стиле ЮKassa */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600" />
        
        <div className="mb-8 text-center">
          <div className="text-xl font-bold text-slate-900 mb-1">ЮKassa (Тестовый режим)</div>
          <div className="text-sm text-slate-500">Оплата заказа в магазине "FSIN Calc"</div>
          <div className="text-xs font-semibold text-indigo-600 mt-2 bg-indigo-50 px-2.5 py-1 rounded-full w-fit mx-auto">
            {getPlanTitle()}
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-center border border-slate-100">
          <div className="text-sm text-slate-500 mb-1">К оплате</div>
          <div className="text-4xl font-bold text-slate-900">{getPrice()}</div>
        </div>

        {status === 'idle' && (
          <button 
            onClick={handleSimulatePayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
            <div className="text-xl font-bold text-slate-900 mb-1 text-center">Ошибка оплаты</div>
            <div className="text-xs text-slate-500 text-center leading-relaxed max-w-xs mt-1 mb-2">
              {errorMessage || 'Убедитесь, что вы выполнили SQL-запрос для добавления колонки is_unlocked или RPC функции в Supabase.'}
            </div>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-6 text-blue-600 font-medium hover:underline cursor-pointer"
            >
              Попробовать снова
            </button>
          </motion.div>
        )}

        <div className="mt-8 text-center text-xs text-slate-400">
          Это страница-симулятор. Реальные деньги не списываются.
        </div>
      </div>
    </div>
  );
}

export default function PaymentSimulator() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium">Запуск симулятора платежа...</p>
        </div>
      </div>
    }>
      <PaymentSimulatorContent />
    </Suspense>
  );
}
