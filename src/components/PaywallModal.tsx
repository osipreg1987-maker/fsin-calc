// @ts-nocheck
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { formatCurrency } from '../lib/helpers';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSingle: () => void;
  onUnlockPro: () => void;
  isLoadingUnlock: boolean;
  resultsCount: number;
  finalBalance: number;
}

export default function PaywallModal({
  isOpen,
  onClose,
  onUnlockSingle,
  onUnlockPro,
  isLoadingUnlock,
  resultsCount,
  finalBalance
}: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'monthly'>('single');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto"
        >
          {/* Backdrop click close */}
          <div className="absolute inset-0 cursor-default" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-slate-900 border-2 border-indigo-500/30 rounded-[2.5rem] w-full max-w-2xl shadow-[0_20px_50px_rgba(99,102,241,0.3)] overflow-hidden relative z-10 p-6 md:p-8"
          >
            {/* Close button */}
            <div className="absolute top-5 right-5 z-20">
              <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 p-2 rounded-full transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Glowing lights inside the modal */}
            <div className="absolute top-[-10%] left-[50%] translate-x-[-50%] w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none" />

            {/* Content header */}
            <div className="text-center mt-3">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 rounded-2xl mx-auto flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <h2 className="text-2xl font-black text-white leading-tight">
                Разблокировать полный расчет и рапорт
              </h2>
              
              <p className="text-xs text-slate-400 mt-2">
                Калькулятор нашел недополученное имущество на сумму:
              </p>
              
              <div className="text-3xl font-black text-emerald-400 mt-1.5 drop-shadow-[0_2px_15px_rgba(16,185,129,0.25)]">
                {formatCurrency(finalBalance)}
              </div>
            </div>

            {/* Tariff Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              {/* Plan 1: Single */}
              <div 
                onClick={() => setSelectedPlan('single')}
                className={`cursor-pointer text-left p-4.5 rounded-2xl border-2 transition-all duration-300 relative flex flex-col justify-between ${selectedPlan === 'single' ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'border-slate-800 bg-slate-950/45 hover:border-slate-700'}`}
              >
                {selectedPlan === 'single' && (
                  <span className="absolute top-3.5 right-3.5 w-4 h-4 rounded-full bg-indigo-500 border border-indigo-400 flex items-center justify-center text-[10px] text-white">✓</span>
                )}
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Разовый расчет</div>
                  <div className="text-2xl font-black text-white mt-1">390 ₽</div>
                  <p className="text-[11px] text-slate-400 mt-2.5 font-medium leading-relaxed">
                    Разблокировать <strong>этот конкретный расчет</strong>. Скачивание Word-рапорта и Excel-справки доступно в архиве в течение 6 месяцев.
                  </p>
                </div>
                <div className="text-[10px] text-indigo-400 font-bold mt-4">Доступ к скачиванию: 6 месяцев</div>
              </div>

              {/* Plan 2: Monthly PRO */}
              <div 
                onClick={() => setSelectedPlan('monthly')}
                className={`cursor-pointer text-left p-4.5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${selectedPlan === 'monthly' ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'border-slate-800 bg-slate-950/45 hover:border-slate-700'}`}
              >
                <div className="absolute top-0 right-0 bg-gradient-to-l from-rose-500 to-amber-500 text-white text-[8px] font-black px-2.5 py-0.5 rounded-bl-xl uppercase tracking-wider">
                  Скидка 20%
                </div>
                {selectedPlan === 'monthly' && (
                  <span className="absolute bottom-3.5 right-3.5 w-4 h-4 rounded-full bg-amber-500 border border-amber-400 flex items-center justify-center text-[10px] text-slate-950">✓</span>
                )}
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    🔥 Безлимитный PRO (Месяц)
                  </div>
                  <div className="text-2xl font-black text-white mt-1 flex items-baseline gap-1.5">
                    <span>790 ₽</span>
                    <span className="text-xs text-slate-500 line-through font-bold">990 ₽</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2.5 font-medium leading-relaxed">
                    <strong>Полный безлимит</strong> расчетов. Документы в архиве хранятся постоянно, пока активна подписка PRO.
                  </p>
                </div>
                <div className="text-[9px] text-rose-400 font-bold mt-4 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md w-fit">
                  🎁 Скидка за привязку Telegram!
                </div>
              </div>
            </div>

            {/* Benefits Checklist */}
            <ul className="text-left space-y-2.5 text-[11px] md:text-xs text-slate-350 font-medium mb-6 pl-2">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 shrink-0">✓</span>
                <span>Полный отчет по всем <strong>{resultsCount} предметам</strong> довольствия (сейчас скрыто {resultsCount - 4} предм.)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 shrink-0">✓</span>
                <span>Скачать <strong>двухстраничный рапорт в Word</strong> (Заявление + Справка-расчет с суммами прописью)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 shrink-0">✓</span>
                <span>Скачать готовую Справку-обоснование в <strong>Excel</strong></span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 shrink-0">✓</span>
                <span>Гарантия юридической точности по приказам ФСИН РФ</span>
              </li>
            </ul>

            {/* Purchase CTA button */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={selectedPlan === 'single' ? onUnlockSingle : onUnlockPro}
              disabled={isLoadingUnlock}
              className={`w-full font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75 text-sm uppercase tracking-wide ${selectedPlan === 'single' ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_4px_25px_rgba(79,70,229,0.35)] border border-indigo-500/30' : 'bg-gradient-to-tr from-amber-500 to-yellow-500 hover:from-amber-450 hover:to-yellow-450 text-slate-950 shadow-[0_4px_25px_rgba(245,158,11,0.35)] border border-amber-500/30'}`}
            >
              {isLoadingUnlock ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Подготовка платежа...
                </>
              ) : selectedPlan === 'single' ? (
                <span>Разблокировать расчет за 390 ₽</span>
              ) : (
                <span>Активировать PRO за 790 ₽</span>
              )}
            </motion.button>

            {/* Guarantee footer text */}
            <p className="text-[10px] text-slate-500 italic mt-4 text-center">
              {selectedPlan === 'single' 
                ? 'Разовый расчет. Доступ к скачиванию документов в вашем архиве предоставляется на 6 месяцев.' 
                : 'Специальная акция: скидка 20% активирована. Хранение архива и доступ к PRO-функциям — постоянно на период действия подписки.'}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
