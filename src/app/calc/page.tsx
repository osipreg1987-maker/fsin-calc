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
          className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-slate-700/50 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative">
            <div className="flex-1 space-y-2 text-left">
              <h1 className="text-3xl md:text-4xl lg:text-[2.65rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 tracking-tight leading-[1.12]">
                ФСИН: калькулятор расчета компенсации
              </h1>
              <p className="text-[11px] md:text-xs text-slate-400 font-bold max-w-2xl leading-normal uppercase tracking-wider">
                за неполученное вещевое довольствие в период прохождения службы
              </p>
              
              {isAdmin && (
                <button 
                  onClick={() => router.push('/admin')}
                  className="mt-3 flex items-center gap-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 px-4 py-2 rounded-xl transition-colors font-medium border border-indigo-500/30 shadow-lg shadow-indigo-500/10 text-xs"
                >
                  <ShieldAlert size={14} />
                  Админ-панель
                </button>
              )}
            </div>
            
            {/* Место под эмблему ФСИН (Справа, крупнее, без подложки) */}
            <div className="relative w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 shrink-0 flex items-center justify-center group select-none">
                <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 rounded-full blur-2xl transition-all duration-300 pointer-events-none" />
                <img 
                  src="/images/fsin_emblem.png" 
                  alt="Эмблема ФСИН" 
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_25px_rgba(79,70,229,0.35)] transition-transform duration-300 group-hover:scale-105"
                />
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
