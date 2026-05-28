"use client";

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Calculator, Clock, Scale, ArrowRight, FileText, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/calc');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 p-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl tracking-wide">
          <Scale className="text-blue-400" />
          <span className="text-slate-100">ФСИН <span className="text-blue-400">Калькулятор Pro</span></span>
        </div>
        <button 
          onClick={handleStart}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-500 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <Calculator size={18} />
          <span className="hidden sm:inline">Рассчитать</span>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-4 py-20 md:py-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold tracking-wide uppercase">
            <Zap size={16} />
            Для сотрудников и пенсионеров ФСИН
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 leading-tight tracking-tight pb-2">
            Точный расчет, который <br />
            <span className="bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">работает на вас</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Узнайте точную сумму компенсации по актуальным ценам за 2 минуты. Без таблиц, формул и бюрократии.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={handleStart}
              className="group relative bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10">Начать расчет бесплатно</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="#about" className="text-slate-400 hover:text-white font-medium px-6 py-4 flex items-center gap-2 transition-colors">
              Узнать больше <ChevronRight size={18} />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 pt-12 text-sm text-slate-400 font-medium">
            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50">
              <ShieldCheck size={18} className="text-green-400" />
              <span>Абсолютно анонимно</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50">
              <Clock size={18} className="text-blue-400" />
              <span>Занимает 2 минуты</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50">
              <FileText size={18} className="text-purple-400" />
              <span>Готовая справка</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Bento Grid: Pain Points */}
      <section id="about" className="relative z-10 py-24 bg-slate-900/50 border-y border-slate-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-blue-400 font-bold tracking-wider uppercase text-sm">Проблема</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2">
              Сталкиваетесь с этим <br className="hidden md:block" />
              <span className="text-slate-500">при оформлении рапорта?</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Big Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 bg-slate-800/40 border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800/60 transition-all hover:border-blue-500/30 group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-colors" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-500/20 text-blue-400 flex items-center justify-center rounded-2xl mb-6">
                  <Calculator size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Сложная бюрократия</h3>
                <p className="text-slate-400 text-lg max-w-md leading-relaxed">Самостоятельный расчет по запутанным таблицам приказов и нормам положенности занимает часы и часто ведет к ошибкам.</p>
              </div>
            </motion.div>

            {/* Small Card 1 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800/60 transition-all hover:border-purple-500/30 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] group-hover:bg-purple-500/20 transition-colors" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-purple-500/20 text-purple-400 flex items-center justify-center rounded-xl mb-6">
                  <Clock size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Ошибки бухгалтерии</h3>
                <p className="text-slate-400 leading-relaxed">Ощущение, что финчасть занижает суммы или использует старые справки-расчеты.</p>
              </div>
            </motion.div>

            {/* Small Card 2 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-3 lg:col-span-1 bg-slate-800/40 border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800/60 transition-all hover:border-green-500/30 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[40px] group-hover:bg-green-500/20 transition-colors" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 bg-green-500/20 text-green-400 flex items-center justify-center rounded-xl mb-6">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Возврат документов</h3>
                <p className="text-slate-400 leading-relaxed">Малейшая ошибка в расчетах приводит к возврату рапорта и затягиванию выплат.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust & Legal Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row items-center gap-16"
          >
            <div className="flex-1 space-y-8">
              <div>
                <span className="text-blue-400 font-bold tracking-wider uppercase text-sm">Легальность</span>
                <h2 className="text-4xl font-bold mt-2">Строго по закону <br/><span className="text-slate-500">и приказам</span></h2>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed">
                Наш алгоритм математически точно высчитывает износ (недонос) и положенность предметов вещевого имущества, опираясь на официальную нормативно-правовую базу:
              </p>
              
              <div className="space-y-4">
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl flex gap-4 transition-all hover:bg-slate-800/60">
                  <CheckCircle2 className="text-green-400 shrink-0 mt-1" />
                  <div>
                    <strong className="text-white block text-lg mb-1">Приказ Минюста РФ № 211</strong>
                    <span className="text-slate-400 leading-relaxed">Об утверждении Порядка обеспечения вещевым имуществом сотрудников УИС (сроки носки и нормы положенности).</span>
                  </div>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl flex gap-4 transition-all hover:bg-slate-800/60">
                  <CheckCircle2 className="text-green-400 shrink-0 mt-1" />
                  <div>
                    <strong className="text-white block text-lg mb-1">Ежегодные Распоряжения ФСИН</strong>
                    <span className="text-slate-400 leading-relaxed">Актуальная база данных справок-расчетов стоимости предметов вещевого имущества.</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-[3rem] blur-2xl" />
              <div className="relative bg-slate-800/80 backdrop-blur-xl p-10 rounded-[3rem] border border-slate-700/50 shadow-2xl overflow-hidden">
                <ShieldCheck size={200} className="text-slate-700/30 absolute -top-10 -right-10 transform rotate-12" />
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-4 text-white">Юридическая точность</h3>
                  <p className="text-slate-300 mb-10 text-lg leading-relaxed">Готовую Excel-справку можно смело прикладывать к рапорту на увольнение или использовать для сверки с бухгалтерией. Все формулы проверены юристами.</p>
                  <button onClick={handleStart} className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-200 transition-colors w-full flex items-center justify-center gap-3 text-lg group">
                    <Calculator size={20} className="text-blue-600" />
                    Проверить свою сумму
                    <ArrowRight size={20} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-950 py-12 text-center px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-300">
            <Scale className="text-blue-500" />
            ФСИН Калькулятор Pro
          </div>
          <p className="text-slate-500">© {new Date().getFullYear()} Все расчеты носят информационный характер.</p>
          <div className="bg-slate-900/80 border border-slate-800 px-6 py-3 rounded-full text-sm text-slate-400 flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-500" /> 
            Данные не сохраняются на серверах и не передаются третьим лицам.
          </div>
        </div>
      </footer>
    </div>
  );
}
