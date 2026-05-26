"use client";

import { useState } from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';
import SearchableSelect from './SearchableSelect';
import { ITEMS } from '../lib/constants';

export default function ItemTable({ gender, periods, dismDate }) {
  const [items, setItems] = useState([]);
  
  // Отфильтруем вещи по полу
  const availableItems = ITEMS.filter(item => item.gender === gender);

  const addItem = () => {
    setItems([...items, { id: Date.now(), itemId: '', issued: 0, receivedAt: '' }]);
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="text-slate-200 text-lg font-medium flex items-center gap-2">
                <Calculator size={18} className="text-blue-400" />
                Журнал выдачи
            </h3>
            <button 
                onClick={addItem}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
                <Plus size={16} /> Добавить вещь
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-3 rounded-tl-lg min-w-[250px]">Наименование предмета</th>
                        <th className="px-4 py-3 w-32">Выдано (шт)</th>
                        <th className="px-4 py-3 w-40">Дата выдачи</th>
                        <th className="px-4 py-3 text-right">Расчет (мес)</th>
                        <th className="px-4 py-3 rounded-tr-lg w-16 text-center">Действия</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-slate-500 bg-slate-800/30 rounded-b-lg">
                                Нет добавленных предметов. Нажмите "Добавить вещь", чтобы начать расчет.
                            </td>
                        </tr>
                    ) : (
                        items.map(item => (
                            <tr key={item.id} className="bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                                <td className="px-4 py-3 relative">
                                    <SearchableSelect 
                                        options={availableItems} 
                                        value={item.itemId} 
                                        onChange={(val) => updateItem(item.id, 'itemId', val)} 
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <input 
                                        type="number" 
                                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 outline-none focus:border-blue-500" 
                                        value={item.issued}
                                        onChange={(e) => updateItem(item.id, 'issued', parseFloat(e.target.value) || 0)}
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <input 
                                        type="date" 
                                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 outline-none focus:border-blue-500 text-xs" 
                                        value={item.receivedAt}
                                        onChange={(e) => updateItem(item.id, 'receivedAt', e.target.value)}
                                    />
                                </td>
                                <td className="px-4 py-3 text-right text-slate-400">
                                    {/* Здесь будет результат расчета calculateItemData */}
                                    —
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button 
                                        onClick={() => removeItem(item.id)}
                                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
}
