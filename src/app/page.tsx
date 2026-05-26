"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Calculator from '../components/Calculator';
// import { NORMS_M, NORMS_F } from '../lib/constants'; // will add later

export default function CalculatorPage() {
  const [employeeFio, setEmployeeFio] = useState('');
  const [gender, setGender] = useState('M');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-slate-700/50 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight mb-2">
                ФСИН Калькулятор Pro
              </h1>
              <p className="text-slate-400">Вещевое довольствие и компенсации</p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <Calculator />
      </div>
    </div>
  );
}
