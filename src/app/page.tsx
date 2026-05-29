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
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      
      {/* Premium Decorative Ambient Floating Lights */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none animate-float-1 z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none animate-float-2 z-0" />
      <div className="fixed top-[40%] left-[35%] w-[35vw] h-[35vw] max-w-[400px] rounded-full bg-indigo-600/5 blur-[150px] pointer-events-none animate-float-1 z-0" />

      {/* Floating Sticky Capsule Navbar */}
      <nav className="sticky top-4 z-50 max-w-7xl mx-auto my-4 bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 md:px-8 shadow-lg shadow-black/30 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-2 font-bold text-xl tracking-wide">
          <Scale className="text-blue-400" />
          <span className="text-slate-100">ФСИН <span className="text-blue-400">Калькулятор Pro</span></span>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:from-blue-500 hover:to-indigo-500 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/25 border border-blue-500/30 cursor-pointer"
        >
          <Calculator size={18} />
          <span className="hidden sm:inline">Рассчитать</span>
        </motion.button>
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
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 border border-blue-500/30 flex items-center justify-center gap-3 overflow-hidden transition-all duration-300 cursor-pointer"
            >
              <span className="relative z-10">Начать расчет бесплатно</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.a 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="#about" 
              className="bg-slate-900/40 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-2xl font-medium px-6 py-4 flex items-center gap-2 transition-all backdrop-blur-md cursor-pointer"
            >
              Узнать больше <ChevronRight size={18} />
            </motion.a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 pt-12 text-sm text-slate-300 font-medium">
            <div className="flex items-center gap-2 bg-slate-900/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-800/60 shadow-md">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span>Абсолютно анонимно</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-800/60 shadow-md">
              <Clock size={18} className="text-blue-400" />
              <span>Занимает 2 минуты</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-800/60 shadow-md">
              <FileText size={18} className="text-indigo-400" />
              <span>Готовая справка</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Bento Grid: Target Audiences */}
      <section id="about" className="relative z-10 py-24 bg-slate-950/40 border-y border-slate-900/80 backdrop-blur-md shadow-2xl">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center md:text-left"
          >
            <span className="text-blue-400 font-bold tracking-wider uppercase text-sm">Кому полезен калькулятор?</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2">
              Решение реальных проблем <br className="hidden md:block" />
              <span className="text-slate-500">для каждой задачи</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Audience 1: Logistics (Тыл) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl hover:border-blue-500/40 hover:bg-slate-900/50 shadow-xl shadow-black/25 flex flex-col transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] group-hover:bg-blue-500/20 transition-colors" />
              <div className="relative z-10 flex-1">
                <div className="w-14 h-14 bg-blue-500/20 text-blue-400 flex items-center justify-center rounded-2xl mb-6 shadow-inner">
                  <Calculator size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Сотрудникам тыловых служб</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-rose-400 text-xs font-bold uppercase tracking-wider block mb-1">Боль:</span>
                    <p className="text-slate-400 text-sm leading-relaxed">Ручной расчет одной справки-компенсации занимает от 1 до 3 часов. Сверка сроков носки по десяткам позиций выматывает.</p>
                  </div>
                  <div>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block mb-1">Решение:</span>
                    <p className="text-slate-300 text-sm leading-relaxed">Автоматическая генерация готовой Excel-справки за 2 минуты без математических ошибок и опечаток.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Audience 2: Retiring/Leaving */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl hover:border-purple-500/40 hover:bg-slate-900/50 shadow-xl shadow-black/25 flex flex-col transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] group-hover:bg-purple-500/20 transition-colors" />
              <div className="relative z-10 flex-1">
                <div className="w-14 h-14 bg-purple-500/20 text-purple-400 flex items-center justify-center rounded-2xl mb-6 shadow-inner">
                  <Clock size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Увольняющимся сотрудникам</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-rose-400 text-xs font-bold uppercase tracking-wider block mb-1">Боль:</span>
                    <p className="text-slate-400 text-sm leading-relaxed">Страх, что бухгалтерия или тыл недосчитали компенсацию, и вы потеряете честно заработанные десятки тысяч рублей.</p>
                  </div>
                  <div>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block mb-1">Решение:</span>
                    <p className="text-slate-300 text-sm leading-relaxed">Возможность самостоятельно и анонимно проверить правильность расчетов перед подписанием рапорта.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Audience 3: Auditors/Inspectors */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl hover:border-emerald-500/40 hover:bg-slate-900/50 shadow-xl shadow-black/25 flex flex-col transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] group-hover:bg-emerald-500/20 transition-colors" />
              <div className="relative z-10 flex-1">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 flex items-center justify-center rounded-2xl mb-6 shadow-inner">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Ревизорам и сотрудникам КРО</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-rose-400 text-xs font-bold uppercase tracking-wider block mb-1">Боль:</span>
                    <p className="text-slate-400 text-sm leading-relaxed">Долгая и муторная проверка чужих расчетов на предмет незаконных переплат или недоплат из бюджета.</p>
                  </div>
                  <div>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block mb-1">Решение:</span>
                    <p className="text-slate-300 text-sm leading-relaxed">Быстрый аудит и перерасчет "в два клика" для выявления нарушений в уже насчитанных справках.</p>
                  </div>
                </div>
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
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                Наш алгоритм математически точно высчитывает износ (недонос) и положенность предметов вещевого имущества, опираясь на официальную нормативно-правовую базу:
              </p>
              
              <div className="space-y-4">
                <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/60 p-6 rounded-2xl flex gap-4 transition-all duration-300 hover:bg-slate-900/50 hover:border-slate-700/40 hover:translate-x-1">
                  <CheckCircle2 className="text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <strong className="text-white block text-lg mb-1">Постановление Правительства РФ № 150</strong>
                    <span className="text-slate-400 leading-relaxed text-sm">От 10.02.2021 «О вещевом обеспечении сотрудников УИС». Основные правила выдачи форменной одежды и выплат.</span>
                  </div>
                </div>
                <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/60 p-6 rounded-2xl flex gap-4 transition-all duration-300 hover:bg-slate-900/50 hover:border-slate-700/40 hover:translate-x-1">
                  <CheckCircle2 className="text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <strong className="text-white block text-lg mb-1">Постановление Правительства РФ № 789</strong>
                    <span className="text-slate-400 leading-relaxed text-sm">От 22.12.2006 «Об утверждении Правил обеспечения вещевым имуществом сотрудников УИС».</span>
                  </div>
                </div>
                <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/60 p-6 rounded-2xl flex gap-4 transition-all duration-300 hover:bg-slate-900/50 hover:border-slate-700/40 hover:translate-x-1">
                  <CheckCircle2 className="text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <strong className="text-white block text-lg mb-1">Приказ Минюста РФ № 211 и Приказ ФСИН № 676</strong>
                    <span className="text-slate-400 leading-relaxed text-sm">Об утверждении Порядка обеспечения вещевым имуществом. Регламентируют точные сроки носки и нормы снабжения.</span>
                  </div>
                </div>
                <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/60 p-6 rounded-2xl flex gap-4 transition-all duration-300 hover:bg-slate-900/50 hover:border-slate-700/40 hover:translate-x-1">
                  <CheckCircle2 className="text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <strong className="text-white block text-lg mb-1">Распоряжения ФСИН России</strong>
                    <span className="text-slate-400 leading-relaxed text-sm">Ежегодно обновляемая база данных размеров денежной компенсации за предметы вещевого имущества.</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-[3rem] blur-2xl" />
              <div className="relative bg-slate-950/70 backdrop-blur-xl p-10 rounded-[2.5rem] border border-slate-800/80 shadow-[0_0_50px_rgba(59,130,246,0.15)] overflow-hidden">
                <ShieldCheck size={200} className="text-slate-800/20 absolute -top-10 -right-10 transform rotate-12" />
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-4 text-white">Юридическая точность</h3>
                  <p className="text-slate-300 mb-10 text-lg leading-relaxed">Готовую Excel-справку можно смело прикладывать к рапорту на увольнение или использовать для сверки с бухгалтерией. Все формулы проверены юристами.</p>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStart} 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-blue-500/25 transition-all w-full flex items-center justify-center gap-3 text-lg group border border-blue-500/30 cursor-pointer"
                  >
                    <Calculator size={20} className="text-blue-200" />
                    Проверить свою сумму
                    <ArrowRight size={20} className="text-blue-300 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-24 bg-slate-955/30 border-y border-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="text-blue-400 font-bold tracking-wider uppercase text-sm">Тарифы</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2">
              Выберите подходящий <span className="text-slate-500">формат работы</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            
            {/* Tier 1: Retiring */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 hover:bg-slate-900/50 transition-all duration-300 hover:border-purple-500/30 relative overflow-hidden flex flex-col group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-[40px] group-hover:bg-purple-500/10 transition-all" />
              <div className="relative z-10 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-white mb-1">Разовый</h3>
                <div className="text-sm text-purple-300 font-bold mb-4">Для увольняющихся</div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-extrabold text-white tracking-tight">390</span>
                  <span className="text-slate-400 font-bold text-sm">руб. / разово</span>
                </div>
                <div className="text-purple-400 font-medium text-xs mb-6 leading-relaxed bg-purple-500/10 p-4 rounded-xl border border-purple-500/20 flex-grow">
                  Заплатите 390 руб. и получите справку с обоснованием для спора с бухгалтерией. Это поможет сэкономить десятки тысяч рублей на недополученной вещевке.<br/><br/>
                  <span className="text-white font-bold mb-1 block">Внимание:</span> 
                  Для заполнения калькулятора необходимо запросить <b>арматурную карточку</b> у тыловиков.
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-purple-400 shrink-0 w-5 h-5 mt-0.5" />
                    <span className="text-slate-300 text-sm font-medium">Готовая Excel-справка с обоснованием</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-purple-400 shrink-0 w-5 h-5 mt-0.5" />
                    <span className="text-slate-300 text-sm font-medium">Шаблон правильного рапорта</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-purple-400 shrink-0 w-5 h-5 mt-0.5" />
                    <span className="text-slate-300 text-sm font-medium">Инструкция по спору с бухгалтерией</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-purple-400 shrink-0 w-5 h-5 mt-0.5" />
                    <span className="text-slate-300 text-sm font-medium">Разовый доступ на 24 часа</span>
                  </li>
                </ul>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStart} 
                className="w-full bg-slate-800/50 hover:bg-purple-600/80 border border-slate-700/50 text-slate-200 hover:text-white py-3 rounded-xl font-bold transition-all cursor-pointer"
              >
                Выбрать тариф
              </motion.button>
            </motion.div>

            {/* Tier 2: Logistics (Popular) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/50 border-2 border-blue-500/70 rounded-3xl p-8 hover:bg-slate-900/70 transition-all duration-300 relative overflow-hidden flex flex-col transform md:-translate-y-4 shadow-[0_0_40px_rgba(59,130,246,0.25)] hover:border-blue-400 group"
            >
              {/* Top border ambient highlight line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/40 via-indigo-500/40 to-purple-500/0" />
              
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[40px] group-hover:bg-blue-500/15" />
              <div className="absolute top-4 right-4 bg-blue-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md shadow-blue-500/30">
                Популярный
              </div>
              <div className="relative z-10 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-white mb-1">Для тыловиков и ревизоров</h3>
                <div className="text-sm text-blue-300 font-bold mb-4">Ежемесячная подписка</div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-extrabold text-white tracking-tight">990</span>
                  <span className="text-slate-400 font-bold text-sm">руб. / мес.</span>
                </div>
                <div className="text-blue-300 font-medium text-xs mb-6 leading-relaxed bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 flex-grow">
                  Идеальный инструмент, который позволит вам быстро, чётко и безошибочно рассчитывать компенсации. Получите точный расчёт, который поможет не попасться на штрафы по проверке КРО.
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-blue-400 shrink-0 w-5 h-5 mt-0.5" />
                    <span className="text-slate-200 text-sm font-medium">Безлимитная генерация справок</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-blue-400 shrink-0 w-5 h-5 mt-0.5" />
                    <span className="text-slate-200 text-sm font-medium">Облачный архив на всех сотрудников</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-blue-400 shrink-0 w-5 h-5 mt-0.5" />
                    <span className="text-slate-200 text-sm font-medium">Гарантия точности по приказам</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-blue-400 shrink-0 w-5 h-5 mt-0.5" />
                    <span className="text-slate-200 text-sm font-medium">1 месяц PRO в подарок за друга</span>
                  </li>
                </ul>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStart} 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 border border-blue-500/30 cursor-pointer"
              >
                Оформить подписку
              </motion.button>
            </motion.div>

            {/* Tier 3: Auditors */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 hover:bg-slate-900/50 transition-all duration-300 hover:border-emerald-500/30 relative overflow-hidden flex flex-col group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] group-hover:bg-emerald-500/10 transition-all" />
              <div className="relative z-10 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-white mb-2">PRO на 6 месяцев</h3>
                <div className="text-sm text-emerald-300 font-bold mb-4 font-sans">Пакетное предложение</div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-extrabold text-white tracking-tight">3999</span>
                  <span className="text-slate-400 font-bold text-sm">руб. / за 6 мес.</span>
                </div>
                <div className="text-emerald-400 font-medium text-xs mb-6 leading-relaxed bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 flex-grow">
                  Идеальное решение для ревизоров (КРО). Экономьте десятки часов на рутинных проверках. Находите любые ошибки в расчетах за считанные секунды!
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-400 shrink-0 w-5 h-5 mt-0.5" />
                    <span className="text-slate-300 text-sm font-medium">Десятки часов сэкономленного времени</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-400 shrink-0 w-5 h-5 mt-0.5" />
                    <span className="text-slate-300 text-sm font-medium">Проверьте 20 справок за 10 минут</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-400 shrink-0 w-5 h-5 mt-0.5" />
                    <span className="text-slate-300 text-sm font-medium">Мгновенный поиск ошибок в расчетах</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-400 shrink-0 w-5 h-5 mt-0.5" />
                    <span className="text-slate-300 text-sm font-medium">Все функции PRO тарифа на 6 мес.</span>
                  </li>
                </ul>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStart} 
                className="w-full bg-slate-800/50 hover:bg-emerald-600/80 border border-slate-700/50 text-slate-200 hover:text-white py-3 rounded-xl font-bold transition-all cursor-pointer"
              >
                Получить доступ
              </motion.button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 py-16 text-center px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-300">
            <Scale className="text-blue-500" />
            ФСИН Калькулятор Pro
          </div>
          <p className="text-slate-500">© {new Date().getFullYear()} Все расчеты носят информационный характер.</p>
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 px-6 py-3.5 rounded-2xl text-sm text-slate-300 flex items-center gap-2 shadow-inner shadow-black/10">
            <ShieldCheck size={16} className="text-emerald-500" /> 
            Данные не сохраняются на серверах и не передаются третьим лицам.
          </div>
        </div>
      </footer>
    </div>
  );
}
