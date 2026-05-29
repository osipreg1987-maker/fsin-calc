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
                            <td colSpan={4} className="bg-slate-900/60 backdrop-blur-sm border-y border-slate-800/50 py-2.5 px-3 font-bold text-teal-400 uppercase text-[10px] tracking-wider">
                                {cat}
                            </td>
                        </tr>
                        {(items as any[]).map(item => {
                            const r = results.find((res: any) => res.id === item.id);
                            const hasDeduction = r && r.amortMoney > 0 && dismissalGroup !== 'A';
                            const dedMonthsTotal = r && r.deductionLines ? r.deductionLines.reduce((acc: number, l: any) => acc + l.monthsLeft, 0) : 0;
                            
                            return (
                                <tr key={item.id} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-all duration-200">
                                    <td className="py-2.5 px-3 text-slate-300 font-medium">{item.name}</td>
                                    <td className="py-2.5 px-3 text-center text-slate-400 font-semibold">
                                        {r ? r.earnedQty.toFixed(2) : '0.00'}
                                    </td>
                                    <td className="py-2 px-3 relative">
                                        <input 
                                            type="number" 
                                            min="0"
                                            className="w-full bg-slate-950/40 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 placeholder-slate-500 outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all"
                                            placeholder="0"
                                            value={itemTotals[item.id] || ''}
                                            onChange={(e) => setItemTotals({...itemTotals, [item.id]: e.target.value})}
                                        />
                                    </td>
                                    <td className="py-2 px-3 text-right relative">
                                        {!isPro && <div className="absolute inset-0 z-10 cursor-pointer" onClick={() => setIsProModalOpen(true)} title="Доступно в PRO"></div>}
                                        {hasDeduction && (
                                            <div className={`flex flex-col gap-1.5 items-end ${blurClass}`}>
                                                <span className="text-[10px] font-bold text-rose-400 tracking-wider">НЕДОНОС: {dedMonthsTotal} МЕС.</span>
                                                <input 
                                                    type="number" 
                                                    placeholder="Цена бух."
                                                    className="w-24 bg-slate-950/40 backdrop-blur-md border border-rose-950/50 rounded-xl px-3 py-1 text-rose-200 text-xs outline-none focus:border-rose-400/50 focus:ring-1 focus:ring-rose-400/20 transition-all pointer-events-auto"
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

