// @ts-nocheck
"use client";

import React from 'react';

export default function IssueLogTable({ groupedItems, itemTotals, setItemTotals, customPrices, setCustomPrices, results, dismissalGroup, isPro, setIsProModalOpen }: any) {
  const blurClass = !isPro ? "blur-[4px] select-none pointer-events-none opacity-50" : "";

  return (
    <div className="overflow-x-auto w-full relative">
        <table className="w-full text-left border-collapse text-sm">
            <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                    <th className="pb-3 px-2 font-medium">Предмет</th>
                    <th className="pb-3 px-2 font-medium w-24 text-center">Положено (шт)</th>
                    <th className="pb-3 px-2 font-medium w-24">Всего выдано (шт)</th>
                    <th className="pb-3 px-2 font-medium w-24 text-right">Удержание</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(groupedItems).map(([cat, items]) => (
                    <React.Fragment key={cat}>
                        <tr>
                            <td colSpan={4} className="bg-slate-800/80 py-2 px-3 mt-2 font-bold text-teal-400 uppercase text-xs rounded-t-lg">
                                {cat}
                            </td>
                        </tr>
                        {(items as any[]).map(item => {
                            const r = results.find((res: any) => res.id === item.id);
                            const hasDeduction = r && r.amortMoney > 0 && dismissalGroup !== 'A';
                            const dedMonthsTotal = r && r.deductionLines ? r.deductionLines.reduce((acc: number, l: any) => acc + l.monthsLeft, 0) : 0;
                            
                            return (
                                <tr key={item.id} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                                    <td className="py-2 px-2 text-slate-300">{item.name}</td>
                                    <td className="py-2 px-2 text-center text-slate-400 font-medium relative">
                                        {!isPro && <div className="absolute inset-0 z-10 cursor-pointer" onClick={() => setIsProModalOpen(true)} title="Доступно в PRO"></div>}
                                        <div className={blurClass}>{r ? r.earnedQty.toFixed(2) : '0.00'}</div>
                                    </td>
                                    <td className="py-2 px-2 relative">
                                        <input 
                                            type="number" 
                                            min="0"
                                            className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 outline-none focus:border-teal-500 transition-colors"
                                            placeholder="0"
                                            value={itemTotals[item.id] || ''}
                                            onChange={(e) => setItemTotals({...itemTotals, [item.id]: e.target.value})}
                                        />
                                    </td>
                                    <td className="py-2 px-2 text-right relative">
                                        {!isPro && <div className="absolute inset-0 z-10 cursor-pointer" onClick={() => setIsProModalOpen(true)} title="Доступно в PRO"></div>}
                                        {hasDeduction && (
                                            <div className={`flex flex-col gap-1 items-end ${blurClass}`}>
                                                <span className="text-xs text-rose-400">Недонос: {dedMonthsTotal} мес.</span>
                                                <input 
                                                    type="number" 
                                                    placeholder="Цена бух."
                                                    className="w-24 bg-slate-900 border border-rose-700/50 rounded p-1.5 text-rose-200 text-xs outline-none focus:border-rose-400 pointer-events-auto"
                                                    value={customPrices[item.id] || ''}
                                                    onChange={(e) => setCustomPrices({...customPrices, [item.id]: Number(e.target.value)})}
                                                />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    </div>
  );
}

