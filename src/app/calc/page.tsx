"use client";

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import Calculator from '../../components/Calculator';

export default function CalculatorPage() {
  const [employeeFio, setEmployeeFio] = useState('');
  const [gender, setGender] = useState('M');
  const { user } = useAuth();
  const router = useRouter();
  
  const isAdmin = user?.email === 'osipreg.1987@gmail.com';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      
      {/* Ambient Animated Backdrops */}
      <div className="fixed top-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none animate-float-1" />
      <div className="fixed bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none animate-float-2" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/40 backdrop-blur-xl rounded-[2.2rem] p-6 md:p-8 border border-slate-800/80 shadow-2xl relative overflow-hidden group"
        >
          {/* Spotlight overlay line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-6 relative z-10 text-center sm:text-left">
            {/* Emblem Left */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 flex items-center justify-center select-none bg-slate-950/45 border border-slate-850 p-3.5 rounded-3xl shadow-inner group-hover:border-blue-500/25 transition-all">
                <div className="absolute inset-0 bg-blue-500/5 rounded-2xl blur-lg pointer-events-none" />
                <img 
                  src="/images/fsin_emblem.png" 
                  alt="Эмблема ФСИН" 
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_15px_rgba(79,70,229,0.25)] transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            {/* Title & Brand block */}
            <div className="flex-1 space-y-2.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest select-none">
                  🛡️ Профессиональный инструмент
                </span>
                
                {isAdmin && (
                  <button 
                    onClick={() => router.push('/admin')}
                    className="flex items-center gap-1.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 px-3 py-1 rounded-full transition-colors font-medium border border-indigo-500/30 shadow-lg shadow-indigo-500/10 text-[10px] uppercase tracking-wider"
                  >
                    <ShieldAlert size={10} />
                    Админ-панель
                  </button>
                )}
              </div>
              
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl lg:text-[2.25rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-indigo-200 tracking-tight leading-tight">
                  Профессиональный калькулятор ФСИН
                </h1>
                <p className="text-xs md:text-sm text-slate-400 font-bold tracking-wide">
                  Калькулятор расчета компенсации взамен неполученного вещевого довольствия сотрудников и пенсионеров УИС
                </p>
              </div>
            </div>
            
            {/* Normative base quick check */}
            <div className="hidden lg:block shrink-0 pl-4 border-l border-slate-800/80">
              <div className="text-right space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Нормативная база</span>
                <span className="text-xs text-indigo-400 font-black hover:text-indigo-300 cursor-pointer block transition-colors" onClick={() => window.open('/instructions', '_blank')}>
                  Приказ ФСИН №211 ⚖️
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <Suspense fallback={
          <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-slate-850 animate-pulse text-slate-500">
            Инициализация профессионального калькулятора...
          </div>
        }>
          <Calculator />
        </Suspense>
      </div>
    </div>
  );
}
