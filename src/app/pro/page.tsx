"use client";

import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Crown, Check, ArrowLeft, X, ShieldCheck, Zap, Smartphone, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProPage() {
  const router = useRouter();
  const { user, subscription } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const isPro = subscription?.is_pro;
  const isReferred = !!(subscription?.referred_by_id && !subscription?.referral_reward_claimed);

  const monthlyPrice = isReferred ? '590 ₽' : '990 ₽';
  const monthlyOriginalPrice = isReferred ? '990 ₽' : null;

  const halfYearPrice = isReferred ? '2 990 ₽' : '3 999 ₽';
  const halfYearOriginalPrice = isReferred ? '3 999 ₽' : null;

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
    <div className="min-h-screen bg-slate-950 text-slate-300 p-4 md:p-8 relative overflow-hidden">
      
      {/* Decorative Premium Ambient Floating Lights */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none animate-float-1 z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none animate-float-2 z-0" />

      {/* Back Button */}
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.button 
          whileHover={{ scale: 1.03, x: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/calc')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-all bg-slate-900/40 backdrop-blur-md border border-slate-800/80 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>Вернуться в калькулятор</span>
        </motion.button>
      </div>

      <div className="max-w-6xl mx-auto mt-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0, rotate: -12 }} 
            animate={{ scale: 1, rotate: 12 }} 
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(245,158,11,0.3)]"
          >
            <Crown size={40} className="text-slate-950" />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight"
          >
            FSIN Calc <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">PRO</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Выберите подходящий формат работы, сохраняйте все расчеты в облачный архив и получайте точные справки за 2 минуты.
          </motion.p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch mb-16">
          
          {/* Tier 1: Single Check */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 flex flex-col transition-all duration-300 hover:border-purple-500/30 hover:bg-slate-900/50 shadow-xl group relative"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500/20 to-transparent" />
            <div className="text-xl font-bold text-purple-400 mb-2">Разовый</div>
            <div className="text-sm text-purple-300/80 font-semibold mb-4">Для увольняющихся</div>
            <div className="text-3xl font-extrabold text-white mb-6">390 ₽ <span className="text-sm text-slate-500 font-bold">/ разовый расчет</span></div>
            
            <div className="space-y-4 mb-8 flex-grow">
              <Feature text="Готовая Excel-справка с обоснованием" included />
              <Feature text="Шаблон правильного рапорта" included />
              <Feature text="Инструкция по спору с бухгалтерией" included />
              <Feature text="Доступ к скачиванию в архиве на 6 месяцев" included />
              <Feature text="Сохранение в облачный архив" included={false} />
            </div>
            
            <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCheckout('single')}
                disabled={isLoading}
                className="w-full bg-slate-800 hover:bg-purple-600/80 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-70 border border-slate-750 cursor-pointer shadow-md"
            >
                {isLoading ? 'Загрузка...' : 'Купить разовый расчет'}
            </motion.button>
          </motion.div>

          {/* Tier 2: Monthly logistics subscription */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.3 }}
            className="bg-slate-900/50 border-2 border-blue-500/70 rounded-3xl p-8 relative shadow-[0_0_40px_rgba(59,130,246,0.25)] flex flex-col group transform md:-translate-y-4 hover:border-blue-400 transition-all duration-300"
          >
            {/* Spotlight line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/40 via-indigo-500/30 to-transparent" />
            
            <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md shadow-blue-500/30">
              {isReferred ? '🎁 Скидка друга' : 'Популярный'}
            </div>
            
            <div className="text-xl font-bold text-blue-400 mb-2 flex items-center gap-2">
              <Crown size={20} className="text-blue-400" /> Для тыловиков
            </div>
            <div className="text-sm text-blue-300/80 font-semibold mb-4 font-sans">Ежемесячная подписка</div>
            <div className="text-3xl font-extrabold text-white mb-6">
              {monthlyPrice} {monthlyOriginalPrice && <span className="text-sm text-slate-500 font-bold line-through ml-2">{monthlyOriginalPrice}</span>} <span className="text-sm text-slate-500 font-bold">/ месяц</span>
            </div>
            
            <div className="space-y-4 mb-8 flex-grow">
              <Feature text="Безлимитная генерация всех справок" included />
              <Feature text="Постоянное хранение архива на период подписки" included />
              <Feature text="Гарантия точности по приказам и нормативам" included />
              <Feature text="1 месяц PRO в подарок за рекомендацию" included />
            </div>
            
            {isPro ? (
               <div className="w-full py-3.5 px-4 rounded-xl bg-blue-500/20 text-blue-400 text-center font-extrabold border border-blue-500/30 select-none shadow-inner">
                 Ваш статус PRO активен!
               </div>
            ) : (
               <motion.button 
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={() => handleCheckout('monthly')}
                 disabled={isLoading}
                 className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(59,130,246,0.25)] border border-blue-500/30 disabled:opacity-70 cursor-pointer"
               >
                 {isLoading ? 'Загрузка...' : 'Оформить подписку'}
               </motion.button>
            )}
          </motion.div>

          {/* Tier 3: 6 Months package */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            transition={{ delay: 0.4 }}
            className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 flex flex-col transition-all duration-300 hover:border-emerald-500/30 hover:bg-slate-900/50 shadow-xl group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 to-transparent" />
            {isReferred && (
              <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-500 text-white text-[8px] font-black px-2.5 py-0.5 rounded-bl-xl uppercase tracking-wider animate-pulse">
                Скидка друга 1009 ₽
              </div>
            )}
            <div className="text-xl font-bold text-emerald-400 mb-2 flex items-center gap-2">
              PRO на 6 месяцев
            </div>
            <div className="text-sm text-emerald-300/80 font-semibold mb-4">Пакетное предложение</div>
            <div className="text-3xl font-extrabold text-white mb-6">
              {halfYearPrice} {halfYearOriginalPrice && <span className="text-sm text-slate-500 font-bold line-through ml-2">{halfYearOriginalPrice}</span>} <span className="text-sm text-slate-500 font-bold">/ 6 месяцев</span>
            </div>
            
            <div className="space-y-4 mb-8 flex-grow">
              <Feature text="Десятки часов сэкономленного времени" included />
              <Feature text="Окупается при первом же споре с бухгалтерией" included />
              <Feature text="В разы дешевле найма юриста или аудитора" included />
              <Feature text="Все функции PRO тарифа на полгода" included />
            </div>
            
            <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCheckout('half-year')}
                disabled={isLoading}
                className="w-full bg-slate-800 hover:bg-emerald-600/80 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-70 border border-slate-750 cursor-pointer shadow-md"
            >
                {isLoading ? 'Загрузка...' : 'Оформить PRO доступ'}
            </motion.button>
          </motion.div>
        </div>

        {/* Telegram Bot Promo Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 rounded-[2.5rem] p-8 md:p-10 mb-16 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 max-w-6xl mx-auto shadow-2xl group"
        >
          {/* Top border spotlight highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-blue-500/30 via-indigo-500/20 to-transparent" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-500" />
          
          <div className="flex items-center gap-6 flex-1 flex-col sm:flex-row text-center sm:text-left">
            <div className="w-16 h-16 bg-blue-500/15 text-blue-400 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
              <Smartphone size={32} />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                Мобильность
              </div>
              <h2 className="text-2xl font-bold text-white">Работайте без компьютера прямо с телефона</h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-2xl font-medium">
                Наш официальный Telegram-бот позволяет быстро внести данные арматурной карточки и мгновенно сгенерировать расчетную Excel-справку прямо на службе или в дороге. Данные синхронизированы!
              </p>
            </div>
          </div>
          
          <motion.a 
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href="https://t.me/fsin_calc_bot" // Replace with your actual Telegram bot link
            target="_blank"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md shadow-blue-600/25 border border-blue-500/30 flex items-center gap-2 shrink-0 cursor-pointer text-center"
          >
            <MessageSquare size={16} />
            Запустить Telegram бот
          </motion.a>
        </motion.div>

        {/* Footnote */}
        <div className="mt-12 text-center text-xs text-slate-500 space-y-2 pb-12">
          <p>Оплачивая подписку, вы соглашаетесь с условиями сервиса.</p>
          <div className="flex justify-center gap-4">
            <a href="/terms" className="hover:text-amber-400 transition-colors underline decoration-slate-700 underline-offset-4 font-bold">Публичная оферта</a>
            <a href="/privacy" className="hover:text-amber-400 transition-colors underline decoration-slate-700 underline-offset-4 font-bold">Политика конфиденциальности</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ text, included }: { text: string, included: boolean }) {
  return (
    <div className={`flex items-start gap-3 text-sm font-medium ${included ? 'text-slate-200' : 'text-slate-600'}`}>
      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${included ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}>
        {included ? <Check size={12} className="stroke-[3px]" /> : <X size={12} />}
      </div>
      <span>{text}</span>
    </div>
  );
}
