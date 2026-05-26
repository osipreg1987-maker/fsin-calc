"use client";

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

export default function SearchableSelect({ options, value, onChange, placeholder = "Выберите предмет..." }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const filteredOptions = options.filter(option => 
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = options.find(opt => opt.id === value);

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 cursor-pointer flex justify-between items-center outline-none focus:border-blue-500 hover:border-slate-600 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate">
                    {selectedOption ? selectedOption.name : <span className="text-slate-500">{placeholder}</span>}
                </span>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-[400px] max-w-[90vw] mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-2 border-b border-slate-700 relative">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-sm text-slate-200 outline-none focus:border-blue-500"
                            placeholder="Поиск предмета..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(option => (
                                <div
                                    key={option.id}
                                    className={`px-3 py-2 text-sm rounded-lg cursor-pointer flex justify-between items-center transition-colors ${value === option.id ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:bg-slate-700/50'}`}
                                    onClick={() => {
                                        onChange(option.id);
                                        setIsOpen(false);
                                        setSearchTerm("");
                                    }}
                                >
                                    <span className="truncate pr-2">{option.name}</span>
                                    {value === option.id && <Check size={14} className="shrink-0" />}
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-sm text-slate-500">
                                Ничего не найдено
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
