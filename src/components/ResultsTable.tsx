// @ts-nocheck
"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../lib/helpers';

export default function ResultsTable({ results }: any) {
  if (results.length === 0) {
    return (
        <div className="text-center py-12 text-slate-500">
            Заполните периоды службы для отображения расчета.
        </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm">
            <thead className="text-slate-400 border-b border-slate-700/50">
                <tr>
                    <th className="pb-3 px-2 font-medium">Предмет</th>
                    <th className="pb-3 px-2 font-medium">Начислено</th>
                    <th className="pb-3 px-2 font-medium">Выдано</th>
                    <th className="pb-3 px-2 font-medium">Амортизация</th>
                    <th className="pb-3 px-2 font-medium text-right">Баланс</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
                <AnimatePresence>
                    {results.map((r, i) => (
                        <motion.tr 
                            key={i} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="hover:bg-slate-700/20 transition-colors border-t border-slate-700/30"
                        >
                            <td className="py-3 px-2">
                                <div className="font-medium text-slate-200">{r.name}</div>
                                <div className="text-xs text-slate-500 mt-1">Цена: {formatCurrency(r.price)}</div>
                            </td>
                            <td className="py-3 px-2">
                                {r.periodDetails.map((pd, idx) => (
                                    <div key={idx} className="text-xs text-slate-400 mb-1">
                                        Период {pd.pIndex} [ПП №{pd.type}] ({pd.months} мес. н. {pd.wearMonths}м): {pd.qty.toFixed(2)} шт. = {formatCurrency(pd.money)}
                                    </div>
                                ))}
                                <div className="text-sm text-slate-300 font-medium border-t border-slate-700/50 pt-1 mt-1">
                                    Всего: {r.earnedQty.toFixed(2)} шт. = {formatCurrency(r.earnedMoney)}
                                </div>
                            </td>
                            <td className="py-3 px-2">
                                <div className="text-slate-300">{r.issuedCount} шт.</div>
                                {r.issuedCount > 0 && <div className="text-xs text-slate-500">{formatCurrency(r.issuedMoney)}</div>}
                            </td>
                            <td className="py-3 px-2">
                                {r.amortDetails.map((detail, idx) => (
                                    <div key={idx} className="text-xs text-rose-400">{detail}</div>
                                ))}
                                {r.amortDetails.length === 0 && <span className="text-slate-600">-</span>}
                            </td>
                            <td className="py-3 px-2 text-right">
                                {r.balance > 0 ? (
                                    <span className="text-purple-400 font-medium">+{formatCurrency(r.balance)}</span>
                                ) : r.balance < 0 ? (
                                    <span className="text-rose-400 font-medium">-{formatCurrency(Math.abs(r.balance))}</span>
                                ) : (
                                    <span className="text-slate-500">0.00 ₽</span>
                                )}
                            </td>
                        </motion.tr>
                    ))}
                </AnimatePresence>
            </tbody>
        </table>
    </div>
  );
}

