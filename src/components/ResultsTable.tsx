// @ts-nocheck
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../lib/helpers';

interface ResultsTableProps {
  results: any[];
  dismissalGroup?: string;
  isUnlocked?: boolean;
  onUnlock?: () => void;
  onUnlockPro?: () => void;
  isLoadingUnlock?: boolean;
}

export default function ResultsTable({ 
  results, 
  dismissalGroup = 'V', 
  isUnlocked = true, 
  onUnlock,
  onUnlockPro,
  isLoadingUnlock = false
}: ResultsTableProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'monthly'>('single');

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-900/20 rounded-2xl border border-slate-800/50 backdrop-blur-md">
        <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <p className="text-slate-400 font-medium">Заполните периоды службы и складской журнал (выданное) для отображения расчетов.</p>
        <p className="text-xs text-slate-500 mt-1">Здесь появится подробная интерактивная справка-обоснование.</p>
      </div>
    );
  }

  // Calculate overall summary metrics
  const totalEarned = results.reduce((sum, r) => sum + r.earnedMoney, 0);
  const totalIssued = results.reduce((sum, r) => sum + r.issuedMoney, 0);
  const totalDeductions = results.reduce((sum, r) => sum + r.ded, 0);
  const totalCompensation = results.reduce((sum, r) => sum + r.comp, 0);
  const finalBalance = totalCompensation - totalDeductions;

  const toggleExpand = (itemId: string) => {
    if (!isUnlocked && results.findIndex(r => r.id === itemId) >= 4) {
      // Prevent expanding blurred items
      if (onUnlock) onUnlock();
      return;
    }
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const getGroupBadge = (group: string) => {
    switch (group) {
      case 'A':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">Группа А (Льготное увольнение)</span>;
      case 'B':
        return <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">Группа Б (Отрицательные мотивы)</span>;
      case 'V':
      default:
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">Группа В (Смешанное / Пропорциональное)</span>;
    }
  };

  const getItemCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      'Головные уборы': 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
      'Верхняя одежда': 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
      'Форменная одежда': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      'Рубашки и блузки': 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
      'Обувь': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      'Белье и чулочно-носочные изделия': 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      'Аксессуары и фурнитура': 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
      'Прочее': 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
    };
    return colors[category] || colors['Прочее'];
  };

  const formatDateToMMYYYY = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[1]}.${parts[0]}`;
    return dateStr;
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Summary Dashboard Card */}
      <div className="bg-gradient-to-tr from-slate-900/60 to-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-200">Сводная ведомость расчетов</h3>
            <p className="text-xs text-slate-500 mt-0.5">Обобщенные финансовые показатели по вашему расчету</p>
          </div>
          <div>
            {getGroupBadge(dismissalGroup)}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-950/40 border border-slate-800/50 p-3.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Положено за службу</span>
            <span className="text-base font-bold text-slate-200 block mt-1">{formatCurrency(totalEarned)}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Начислено по выслуге</span>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/50 p-3.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Выдано вещами</span>
            <span className="text-base font-bold text-indigo-400 block mt-1">{formatCurrency(totalIssued)}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Получено со склада</span>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/50 p-3.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Амортизация (износ)</span>
            <span className="text-base font-bold text-rose-400 block mt-1">
              {totalDeductions > 0 ? `-${formatCurrency(totalDeductions)}` : '0,00 ₽'}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {dismissalGroup === 'A' ? 'Списано (прощено)' : 'Удерживается при увольнении'}
            </span>
          </div>

          <div className="bg-gradient-to-br from-indigo-950/30 to-purple-950/30 border border-indigo-500/20 p-3.5 rounded-xl shadow-[inset_0_0_15px_rgba(99,102,241,0.05)]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block">Итоговый баланс</span>
            <span className={`text-base font-black block mt-1 ${finalBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {finalBalance >= 0 ? '+' : ''}{formatCurrency(finalBalance)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
              {finalBalance >= 0 ? 'К выплате (вам положено)' : 'К удержанию (вы должны)'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Accordion List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400">Детализированный расчет по каждому предмету</h4>
          {!isUnlocked && (
            <span className="text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              🔒 Демо-режим расчетов
            </span>
          )}
        </div>

        <div className="divide-y divide-slate-800/40 overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-950/20 backdrop-blur-md relative">
          {results.map((r, rIdx) => {
            const isItemLocked = !isUnlocked && rIdx >= 4;
            const isExpanded = !!expandedItems[r.id] && !isItemLocked;
            
            return (
              <div 
                key={r.id} 
                className={`transition-colors duration-200 ${isItemLocked ? 'blur-[4.5px] select-none pointer-events-none opacity-25' : ''} ${isExpanded ? 'bg-slate-900/10' : 'hover:bg-slate-900/5'}`}
              >
                {/* Header (Always Visible) */}
                <button
                  onClick={() => toggleExpand(r.id)}
                  disabled={isItemLocked}
                  className={`w-full flex flex-col lg:flex-row lg:items-center justify-between p-4 text-left gap-4 outline-none ${isItemLocked ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1 flex-shrink-0">
                      {isExpanded ? (
                        <svg className="w-4 h-4 text-indigo-400 transition-transform duration-200 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-slate-500 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-200 text-sm leading-snug">{r.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getItemCategoryBadge(r.category)}`}>
                          {r.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>Срок носки: <strong className="text-slate-400 font-semibold">{Math.round((r.wear_150 || r.wear_789 || 24) / 12)} г. ({(r.wear_150 || r.wear_789 || 24)} мес.)</strong></span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                        <span>Цена: <strong className="text-slate-400 font-semibold">{formatCurrency(r.price)}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Grid for the Item (Desktop Inline / Mobile wrap) */}
                  <div className="flex items-center gap-4 lg:gap-6 justify-between lg:justify-end w-full lg:w-auto border-t lg:border-t-0 border-slate-800/40 pt-3 lg:pt-0">
                    <div className="grid grid-cols-4 gap-3 md:gap-5 text-center">
                      <div className="min-w-[55px]">
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">Положено</span>
                        <span className="text-xs font-semibold text-slate-300 block mt-0.5">{r.earnedQty.toFixed(2)} шт.</span>
                      </div>
                      <div className="min-w-[55px]">
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">Выдано</span>
                        <span className={`text-xs font-semibold block mt-0.5 ${r.issuedCount > 0 ? 'text-indigo-400 font-bold' : 'text-slate-600'}`}>
                          {r.issuedCount} шт.
                        </span>
                      </div>
                      <div className="min-w-[55px]">
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">Износ</span>
                        <span className={`text-xs font-semibold block mt-0.5 ${r.ded > 0 ? 'text-rose-400 font-bold' : 'text-slate-600'}`}>
                          {r.ded > 0 ? `${(r.ded / r.price).toFixed(2)} шт.` : '0 шт.'}
                        </span>
                      </div>
                      <div className="min-w-[55px]">
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">Баланс</span>
                        <span className={`text-xs font-black block mt-0.5 ${r.balance > 0 ? 'text-emerald-400' : r.balance < 0 ? 'text-rose-400' : 'text-slate-600'}`}>
                          {r.balance > 0 ? `+${(r.balance / r.price).toFixed(2)}` : r.balance < 0 ? `-${(Math.abs(r.balance) / r.price).toFixed(2)}` : '0'} шт.
                        </span>
                      </div>
                    </div>

                    {/* Cost balance badge */}
                    <div className="text-right min-w-[90px]">
                      {r.balance > 0 ? (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-xl text-xs font-black block">
                          +{formatCurrency(r.balance)}
                        </span>
                      ) : r.balance < 0 ? (
                        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-xl text-xs font-black block">
                          -{formatCurrency(Math.abs(r.balance))}
                        </span>
                      ) : (
                        <span className="bg-slate-800/30 text-slate-500 border border-slate-800/50 px-2.5 py-1 rounded-xl text-xs font-semibold block">
                          0,00 ₽
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Mathematical Breakdown */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-slate-800/40 bg-slate-950/40"
                    >
                      <div className="p-4 space-y-4 text-xs md:text-sm">
                        
                        {/* Step 1: Entitlement Details */}
                        <div className="bg-slate-900/30 border border-slate-800/30 p-3 rounded-xl">
                          <div className="flex items-center gap-2 font-bold text-slate-200 mb-2">
                            <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/25 flex items-center justify-center text-[10px]">1</span>
                            <span>Шаг 1. Расчет положенности по выслуге лет</span>
                          </div>
                          
                          <div className="space-y-2 pl-7">
                            {r.periodDetails && r.periodDetails.length > 0 ? (
                              r.periodDetails.map((pd: any, idx: number) => {
                                const normMonths = pd.wearMonths || 24;
                                return (
                                  <div key={idx} className="border-l border-slate-800 pl-3 py-1 space-y-1">
                                    <div className="text-slate-300 font-medium">
                                      Период {pd.pIndex}: с {pd.start ? formatDateToMMYYYY(typeof pd.start === 'string' ? pd.start.split('T')[0] : pd.start.toISOString ? pd.start.toISOString().split('T')[0] : String(pd.start).split('T')[0]) : '—'} по {pd.end ? formatDateToMMYYYY(typeof pd.end === 'string' ? pd.end.split('T')[0] : pd.end.toISOString ? pd.end.toISOString().split('T')[0] : String(pd.end).split('T')[0]) : '—'} 
                                      {pd.isTail && <span className="ml-1 text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.2 rounded">разделение</span>}
                                    </div>
                                    <div className="text-slate-400 text-xs">
                                      Прослужено: <strong className="text-slate-300 font-semibold">{pd.months} мес.</strong> при установленной норме носки <strong className="text-slate-300 font-semibold">{Math.round(normMonths / 12)} г. ({normMonths} мес.)</strong> (Пост. {pd.type || '150'})
                                    </div>
                                    <div className="text-slate-400 font-mono text-[11px] bg-slate-950/45 px-2 py-1 rounded w-fit mt-1">
                                      {pd.months} мес. / {normMonths} мес. = {pd.qty.toFixed(2)} шт. положено
                                    </div>
                                    <div className="text-[11px] text-indigo-400 font-semibold">
                                      Стоимость по норме: {pd.qty.toFixed(2)} шт. × {formatCurrency(r.price)} = {formatCurrency(pd.money)}
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-slate-500 italic">Периоды службы не заполнены.</p>
                            )}

                            <div className="border-t border-slate-800/80 pt-2 mt-2 flex justify-between items-center text-xs">
                              <span className="text-slate-400 font-medium">Итого положено за все время службы:</span>
                              <span className="font-bold text-slate-200 bg-slate-900/60 px-2 py-0.5 rounded">
                                {r.earnedQty.toFixed(2)} шт. = {formatCurrency(r.earnedMoney)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Step 2: Issued Inventory */}
                        <div className="bg-slate-900/30 border border-slate-800/30 p-3 rounded-xl">
                          <div className="flex items-center gap-2 font-bold text-slate-200 mb-2">
                            <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 flex items-center justify-center text-[10px]">2</span>
                            <span>Шаг 2. Получено со склада (фактическая выдача)</span>
                          </div>
                          
                          <div className="pl-7 space-y-1.5">
                            {r.issuedCount > 0 ? (
                              <>
                                <p className="text-slate-300 font-medium">
                                  Вы фактически получили со склада этот предмет лично в пользование:
                                </p>
                                <div className="text-slate-400 text-xs font-mono bg-slate-950/45 px-2.5 py-1.5 rounded w-fit">
                                  Выданное количество: {r.issuedCount} шт. × {formatCurrency(r.price)} = {formatCurrency(r.issuedMoney)}
                                </div>
                                <p className="text-[11px] text-slate-500 italic">
                                  * Стоимость полученного имущества вычитается из объема положенного вещевого довольствия.
                                </p>
                              </>
                            ) : (
                              <div className="flex items-center gap-2 text-slate-500 bg-slate-950/30 border border-slate-900/50 p-2 rounded-lg">
                                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="italic">Этот предмет не выдавался со склада за весь указанный период (0 шт.).</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Step 3: Amortization / Wear deduction */}
                        <div className="bg-slate-900/30 border border-slate-800/30 p-3 rounded-xl">
                          <div className="flex items-center gap-2 font-bold text-slate-200 mb-2">
                            <span className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/25 flex items-center justify-center text-[10px]">3</span>
                            <span>Шаг 3. Амортизация (износ одежды при увольнении)</span>
                          </div>

                          <div className="pl-7 space-y-2">
                            {dismissalGroup === 'A' ? (
                              <div className="bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-xl flex items-start gap-2.5">
                                <svg className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="space-y-0.5">
                                  <strong className="text-emerald-400 font-bold">Износ списан (0,00 ₽)</strong>
                                  <p className="text-slate-400 text-xs leading-relaxed">
                                    Вы увольняетесь по льготной категории (состояние здоровья, пенсия, сокращение штатов). В соответствии с Постановлением Правительства РФ № 150, износ за ранее полученные предметы с неистекшим сроком носки полностью списывается. Удержания не производятся!
                                  </p>
                                </div>
                              </div>
                            ) : r.ded > 0 ? (
                              <div className="space-y-2">
                                <p className="text-slate-300">
                                  Ранее полученные предметы выданы со склада, но срок их полезной носки к моменту увольнения еще не истек. Начисляется удержание износа:
                                </p>
                                <div className="space-y-1.5">
                                  {r.deductionLines && r.deductionLines.length > 0 ? (
                                    r.deductionLines.map((line: any, lIdx: number) => {
                                      const wearMonthsVal = line.wearMonths || 24;
                                      return (
                                        <div key={lIdx} className="bg-slate-950/45 p-2.5 rounded-lg border border-slate-900/60 font-mono text-[11px] space-y-1">
                                          <div className="text-slate-300 font-bold">
                                            Выдача предмета: {formatDateToMMYYYY(line.issueDateStr)} (Норма: {Math.round(wearMonthsVal / 12)} г. / {wearMonthsVal} мес.)
                                          </div>
                                          <div className="text-rose-400">
                                            Период недоноса: {line.monthsLeft} мес. из {wearMonthsVal} мес.
                                          </div>
                                          <div className="text-slate-400 text-xs">
                                            Амортизационный износ: ({line.monthsLeft} мес. / {wearMonthsVal} мес.) × {formatCurrency(line.price)} = <strong className="text-rose-400 font-semibold">{formatCurrency(line.residualValue)}</strong>
                                          </div>
                                        </div>
                                      );
                                    })
                                  ) : (
                                    r.amortDetails.map((detail: any, lIdx: number) => (
                                      <div key={lIdx} className="text-rose-400 font-mono text-xs">{detail}</div>
                                    ))
                                  )}
                                </div>
                                <div className="text-slate-400 text-xs bg-slate-900/50 p-2 rounded border border-slate-800/40 leading-relaxed mt-1">
                                  {dismissalGroup === 'B' ? (
                                    <span>⚠️ <strong className="text-rose-400 font-semibold">Увольнение по отрицательным мотивам:</strong> Удержание износа производится в полном объеме (100%), а компенсация за недополученные вещи аннулируется.</span>
                                  ) : (
                                    <span>⚖️ <strong className="text-blue-400 font-semibold">Взаимозачет (Группа В):</strong> Сумма износа за недонос вычитается из суммы начисленной компенсации.</span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-slate-500 bg-slate-950/30 border border-slate-900/50 p-2 rounded-lg">
                                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="italic">Нет удержаний за износ (все выданные вещи полностью изношены по сроку или ничего не выдавалось).</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Step 4: Final Equations */}
                        <div className="bg-gradient-to-br from-indigo-950/20 to-slate-950/40 border border-indigo-500/25 p-4 rounded-xl shadow-[0_4px_15px_rgba(99,102,241,0.02)]">
                          <div className="flex items-center gap-2 font-bold text-slate-200 mb-3">
                            <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 flex items-center justify-center text-[10px]">4</span>
                            <span>Шаг 4. Итоговое уравнение расчета баланса</span>
                          </div>

                          <div className="pl-7 space-y-3">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 bg-slate-950/50 border border-slate-800/50 p-3 rounded-lg font-mono text-[11px] md:text-xs">
                              <div className="flex-1 flex flex-wrap items-center gap-1.5 leading-relaxed text-slate-300">
                                <div>Положено <span className="text-slate-400">({formatCurrency(r.earnedMoney)})</span></div>
                                <div className="text-slate-500">—</div>
                                <div>Выдано <span className="text-indigo-400">({formatCurrency(r.issuedMoney)})</span></div>
                                <div className="text-slate-500">—</div>
                                <div>Амортизация <span className="text-rose-400">({formatCurrency(r.ded)})</span></div>
                                <div className="text-slate-500">=</div>
                                <div className={`font-bold ${r.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {r.balance >= 0 ? 'Баланс к выплате' : 'Баланс к удержанию'}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/60 pt-2 text-xs md:text-sm">
                              <span className="text-slate-400 font-semibold">Итоговое решение по предмету:</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500">{(r.balance / r.price).toFixed(2)} шт. × {formatCurrency(r.price)} =</span>
                                {r.balance > 0 ? (
                                  <strong className="text-emerald-400 font-black bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                                    К получению +{formatCurrency(r.balance)}
                                  </strong>
                                ) : r.balance < 0 ? (
                                  <strong className="text-rose-400 font-black bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                                    К удержанию -{formatCurrency(Math.abs(r.balance))}
                                  </strong>
                                ) : (
                                  <strong className="text-slate-400 font-bold bg-slate-800/40 border border-slate-800/50 px-2 py-0.5 rounded">
                                    Взаимный баланс 0,00 ₽
                                  </strong>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* 3. Gorgeous Glassmorphic Paywall Card Overlay (Only shown if !isUnlocked) */}
          {!isUnlocked && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/98 to-transparent pt-32 pb-8 px-4 flex flex-col items-center justify-end z-20 pointer-events-auto">
              <motion.div 
                id="paywall-card"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="bg-slate-900/80 backdrop-blur-xl border-2 border-indigo-500/30 p-6 md:p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(99,102,241,0.25)] text-center max-w-2xl w-full relative overflow-hidden"
              >
                {/* Overhead light stripe */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-indigo-450 to-transparent" />
                
                {/* Glowing light behind icon */}
                <div className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] pointer-events-none" />

                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 rounded-2xl mx-auto flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>

                <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                  Разблокировать полный расчет и рапорт
                </h3>
                
                <p className="text-xs md:text-sm text-slate-400 mt-2">
                  Калькулятор нашел недополученное имущество на сумму:
                </p>
                
                <div className="text-2xl md:text-3xl font-black text-emerald-400 mt-1 drop-shadow-[0_2px_15px_rgba(16,185,129,0.2)]">
                  {formatCurrency(finalBalance)}
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
                     <div className="text-[10px] text-indigo-400 font-bold mt-3">Доступ к скачиванию: 6 месяцев</div>
                   </div>

                   {/* Plan 2: Monthly PRO with Telegram discount */}
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
                     <div className="text-[9px] text-rose-400 font-bold mt-3 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md w-fit">
                       🎁 Скидка за привязку Telegram!
                     </div>
                   </div>
                </div>

                {/* Benefits Bullet Points */}
                <ul className="text-left space-y-2.5 text-[11px] md:text-xs text-slate-300 font-medium mb-6 pl-2">
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 shrink-0">✓</span>
                    <span>Полный отчет по всем <strong>{results.length} предметам</strong> довольствия (сейчас скрыто {results.length - 4} предм.)</span>
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

                {/* Purchase Button CTA */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={selectedPlan === 'single' ? onUnlock : onUnlockPro}
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

                <p className="text-[10px] text-slate-500 italic mt-3.5">
                  {selectedPlan === 'single' 
                    ? 'Разовый расчет. Доступ к скачиванию документов в вашем архиве предоставляется на 6 месяцев.' 
                    : 'Специальная акция: скидка 20% активирована. Хранение архива и доступ к PRO-функциям — постоянно на период действия подписки.'}
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
