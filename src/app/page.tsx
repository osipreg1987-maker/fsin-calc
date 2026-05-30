"use client";

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Calculator, Clock, Scale, ArrowRight, FileText, CheckCircle2, ChevronRight, Zap, Smartphone, MessageSquare } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/calc');
  };

  const handleStartPro = () => {
    router.push('/calc?buy_pro=true');
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
          <span className="text-slate-100">ФСИН <span className="text-blue-400">Вещевка</span></span>
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
      <section className="relative z-10 px-4 py-24 md:py-36 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold tracking-wide uppercase">
              <Zap size={16} />
              Для сотрудников и пенсионеров ФСИН
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[5.5rem] font-black text-white leading-[1.08] tracking-tight pb-1">
              Точный расчет, который <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">работает на вас</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 font-normal max-w-2xl leading-relaxed">
              Узнайте точную сумму компенсации по актуальным ценам за 2 минуты. Без сложных формул, ручной рутины и ошибок.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center w-full">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStart}
                className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 border border-blue-500/30 flex items-center justify-center gap-3 overflow-hidden transition-all duration-300 cursor-pointer w-full sm:w-auto"
              >
                <span className="relative z-10">Начать расчет бесплатно</span>
                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.a 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#about" 
                className="bg-slate-900/40 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-2xl font-medium px-6 py-4 flex items-center justify-center gap-2 transition-all backdrop-blur-md cursor-pointer w-full sm:w-auto"
              >
                Узнать больше <ChevronRight size={18} />
              </motion.a>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-8 text-xs sm:text-sm text-slate-300 font-medium w-full">
              <div className="flex items-center gap-2 bg-slate-900/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800/60 shadow-md">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Абсолютно анонимно</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800/60 shadow-md">
                <Clock size={16} className="text-blue-400" />
                <span>Занимает 2 минуты</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800/60 shadow-md">
                <FileText size={16} className="text-indigo-400" />
                <span>Готовая справка</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Premium Calculator Preview Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 w-full relative group"
          >
            {/* Soft ambient glowing background behind the mockup */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-indigo-500/10 to-purple-500/20 rounded-[2rem] blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            
            {/* The interactive mockup card */}
            <div className="[perspective:1000px] w-full">
              <motion.div 
                whileHover={{ rotateY: -8, rotateX: 4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="relative bg-slate-900/60 backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] border border-slate-800/90 shadow-2xl shadow-black/55 overflow-hidden w-full flex flex-col gap-5 select-none"
              >
                {/* Card top border overhead spotlight highlight */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500/40 via-indigo-500/30 to-transparent" />
                
                {/* Mockup Header */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    <span className="text-xs text-slate-500 font-bold ml-2 font-mono">fsin-calc.pro/dashboard</span>
                  </div>
                  <div className="text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Арматурная карта №41
                  </div>
                </div>

                {/* Mockup Content - Calculator items */}
                <div className="space-y-3">
                  {/* Item Row 1 */}
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-slate-950/45 border border-slate-850 hover:bg-slate-950/70 transition-colors duration-200">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[0.875rem] text-slate-100 font-extrabold">Куртка зимняя черная</span>
                      <span className="text-[11px] text-slate-400">Норма: 1 шт / 3 года. Выдача: 2021 г.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/25 uppercase tracking-wide">Недонос 14 мес</span>
                      <span className="text-[0.925rem] font-black text-blue-400">4 200 ₽</span>
                    </div>
                  </div>

                  {/* Item Row 2 */}
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-slate-950/45 border border-slate-850 hover:bg-slate-950/70 transition-colors duration-200">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[0.875rem] text-slate-100 font-extrabold">Костюм летний (куртка, брюки)</span>
                      <span className="text-[11px] text-slate-400">Норма: 2 шт / 2 года. Выдача: 2023 г.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/25 uppercase tracking-wide">Недонос 8 мес</span>
                      <span className="text-[0.925rem] font-black text-blue-400">3 100 ₽</span>
                    </div>
                  </div>

                  {/* Item Row 3 */}
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-slate-950/45 border border-slate-850 hover:bg-slate-950/70 transition-colors duration-200">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[0.875rem] text-slate-400 font-bold">Ботинки с высокими берцами</span>
                      <span className="text-[11px] text-slate-500">Норма: 1 шт / 2 года. Срок носки истек.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/25 uppercase tracking-wide">Выплачено</span>
                      <span className="text-[0.925rem] font-black text-slate-500">0 ₽</span>
                    </div>
                  </div>
                </div>

                {/* Total Calculation summary box inside mockup */}
                <div className="mt-2 bg-gradient-to-r from-blue-900/35 via-indigo-900/25 to-purple-900/15 border border-blue-500/20 p-4.5 rounded-2xl flex justify-between items-center shadow-lg shadow-blue-950/20">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-blue-300 font-extrabold uppercase tracking-wider">Итого к выплате</span>
                    <span className="text-xs text-slate-400">Денежная компенсация (27 позиций)</span>
                  </div>
                  <motion.div 
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-[0_2px_10px_rgba(52,211,153,0.2)]"
                  >
                    84 350 ₽
                  </motion.div>
                </div>

                {/* Subtle design cue at the bottom: "Нажмите для подробностей" */}
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold px-1 mt-1">
                  <span>* На основе актуальных нормативов</span>
                  <span className="text-blue-400 flex items-center gap-1 group-hover:text-blue-300 transition-colors">
                    Посмотреть детали <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Section 1: Logistics / Тыл (Text Left, Graphic Right) */}
      <section id="about" className="relative z-10 py-24 md:py-32 bg-slate-950 border-t border-slate-900/80 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Column: Text */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            <span className="text-blue-400 font-black tracking-widest uppercase text-xs sm:text-sm">Тыловые службы</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight">
              Сотрудникам <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">тыловых служб</span>
            </h2>
            <div className="space-y-4 text-slate-300 text-base leading-relaxed text-left">
              <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl">
                <span className="text-rose-400 text-xs font-black uppercase tracking-widest block mb-1">Рутина и ошибки:</span>
                <p className="text-sm font-normal text-slate-300">
                  Ручной расчет одной справки-компенсации занимает от 1 до 3 часов. Сверка сроков носки по десяткам позиций выматывает, а любая опечатка ведет к пересчетам или проверкам КРО.
                </p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl">
                <span className="text-emerald-400 text-xs font-black uppercase tracking-widest block mb-1">Решение:</span>
                <p className="text-sm font-normal text-slate-200">
                  Внесите данные арматурной карточки один раз — и система мгновенно сгенерирует готовую Excel-справку с математически безупречными расчетами износа и сроков. 
                  <strong className="text-indigo-300 block mt-2 text-[11px] uppercase tracking-wider">💡 Обратите внимание:</strong> 
                  Для заполнения калькулятора вам потребуется скан или фото арматурной карточки для ввода выданного имущества — запросите её предварительно у сотрудников тыловой службы вашего учреждения.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Spreadsheet Placeholder */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 w-full relative flex justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl blur-3xl opacity-60" />
            <div className="relative w-full max-w-lg bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
              
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-slate-400 font-mono">Справка_вещевка_тыл.xlsx</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                  EXCEL MOCKUP
                </span>
              </div>
              
              <div className="space-y-2.5 font-mono text-[10px]">
                <div className="grid grid-cols-12 gap-1 pb-1.5 border-b border-slate-800 text-slate-500 font-bold">
                  <div className="col-span-5">Предмет имущества</div>
                  <div className="col-span-2 text-center">Срок</div>
                  <div className="col-span-2 text-right">Сумма</div>
                  <div className="col-span-3 text-right">Компенс.</div>
                </div>
                <div className="grid grid-cols-12 gap-1 text-slate-300">
                  <div className="col-span-5 font-sans font-extrabold text-xs text-slate-200">Куртка зимняя черная</div>
                  <div className="col-span-2 text-center text-rose-450 font-bold">3 г.</div>
                  <div className="col-span-2 text-right text-slate-400">10 800 ₽</div>
                  <div className="col-span-3 text-right text-blue-450 font-bold">4 200 ₽</div>
                </div>
                <div className="grid grid-cols-12 gap-1 text-slate-300">
                  <div className="col-span-5 font-sans font-extrabold text-xs text-slate-200">Костюм летний (куртка, брюки)</div>
                  <div className="col-span-2 text-center text-rose-450 font-bold">2 г.</div>
                  <div className="col-span-2 text-right text-slate-400">6 200 ₽</div>
                  <div className="col-span-3 text-right text-blue-450 font-bold">3 100 ₽</div>
                </div>
                <div className="grid grid-cols-12 gap-1 text-slate-350">
                  <div className="col-span-5 font-sans font-bold text-xs text-slate-400">Ботинки с высокими берцами</div>
                  <div className="col-span-2 text-center text-emerald-400">2 г.</div>
                  <div className="col-span-2 text-right text-slate-500">4 500 ₽</div>
                  <div className="col-span-3 text-right text-slate-500">0 ₽</div>
                </div>
                <div className="h-6 border-b border-dashed border-slate-800 flex items-center justify-center">
                  <span className="text-[9px] text-slate-600 tracking-wider">... еще 24 позиции ...</span>
                </div>
                <div className="pt-2 flex justify-between items-center font-sans font-extrabold text-sm text-slate-200">
                  <span>ИТОГО К ВЫПЛАТЕ:</span>
                  <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-xs">
                    84 350 ₽
                  </span>
                </div>
              </div>

              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 text-center select-none">
                <FileText className="text-blue-400 w-12 h-12 mb-3 animate-pulse" />
                <h4 className="text-white font-bold text-base mb-1">Скриншот готовой справки Excel</h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  Сюда будет вставлен реальный скриншот сгенерированного файла Excel с детальными расчетами.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Retiring / Увольняющимся (Graphic Left, Text Right) */}
      <section className="relative z-10 py-24 md:py-32 bg-slate-950 border-t border-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Column: Interactive Report Placeholder */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 w-full relative flex justify-center order-2 lg:order-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl opacity-60" />
            <div className="relative w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl overflow-hidden group aspect-[1/1.3] flex flex-col justify-between">
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <FileText size={16} className="text-purple-400" />
                  <span className="text-xs text-slate-400 font-mono">Рапорт_на_выплату.docx</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                  WORD TEMPLATE
                </span>
              </div>

              <div className="flex-1 my-4 p-4.5 bg-slate-950/40 border border-slate-850 rounded-2xl flex flex-col justify-between text-[8px] font-sans text-slate-400 relative">
                <div className="absolute bottom-6 right-6 border-2 border-emerald-500/30 rounded-full px-2 py-1 transform rotate-12 flex flex-col items-center gap-0.5 select-none bg-slate-950/80">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span className="text-[7px] text-emerald-400 font-black tracking-widest uppercase">Готов к печати</span>
                </div>

                <div className="space-y-1.5 self-end w-2/3 text-right">
                  <div className="h-2 w-full bg-slate-800 rounded-sm" />
                  <div className="h-2 w-5/6 bg-slate-800 rounded-sm self-end" />
                  <div className="h-2 w-3/4 bg-slate-800 rounded-sm self-end" />
                </div>
                
                <div className="space-y-2 my-6">
                  <div className="h-3 w-16 bg-slate-700 rounded-sm mx-auto font-black text-center flex items-center justify-center text-[8px] text-white">РАПОРТ</div>
                  <div className="h-2 w-full bg-slate-850 rounded-sm" />
                  <div className="h-2 w-11/12 bg-slate-850 rounded-sm" />
                  <div className="h-2 w-full bg-slate-850 rounded-sm" />
                  <div className="h-2 w-4/5 bg-slate-850 rounded-sm" />
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-800/40">
                  <div className="h-2 w-16 bg-slate-800 rounded-sm" />
                  <div className="h-2 w-12 bg-slate-800 rounded-sm" />
                </div>
              </div>

              <div className="text-center">
                <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                  📄 Скачать рапорт в 1 клик
                </span>
              </div>

              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 text-center select-none">
                <FileText className="text-purple-400 w-12 h-12 mb-3 animate-pulse" />
                <h4 className="text-white font-bold text-base mb-1">Скриншот готового рапорта</h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  Сюда будет вставлен скриншот сгенерированного рапорта Word/PDF, полностью заполненного по вашим параметрам.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Text */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start order-1 lg:order-2"
          >
            <span className="text-purple-400 font-black tracking-widest uppercase text-xs sm:text-sm">Увольняющимся</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight">
              Защита прав и <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">получение рапорта</span>
            </h2>
            <div className="space-y-4 text-slate-300 text-base leading-relaxed text-left">
              <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl">
                <span className="text-rose-450 text-xs font-black uppercase tracking-widest block mb-1">Боль:</span>
                <p className="text-sm font-normal text-slate-300">
                  Бухгалтерия или тыл могут недосчитать компенсацию, из-за чего вы рискуете потерять честно заработанные десятки тысяч рублей при увольнении или выходе на пенсию.
                </p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl">
                <span className="text-emerald-450 text-xs font-black uppercase tracking-widest block mb-1">Решение:</span>
                <p className="text-sm font-normal text-slate-200">
                  Самостоятельно и анонимно перепроверьте расчеты. Получите готовый, юридически выверенный рапорт на выплату компенсации, который можно смело подавать руководству.
                </p>
              </div>
            </div>
            
            <div className="pt-2 w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStart}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-4.5 rounded-2xl font-black text-base shadow-lg shadow-purple-500/25 border border-purple-500/30 flex items-center justify-center gap-3 cursor-pointer w-full sm:w-auto"
              >
                <span>Получить рапорт</span>
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Auditors / КРО (Text Left, Graphic Right) */}
      <section className="relative z-10 py-24 md:py-32 bg-slate-950 border-t border-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Column: Text */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            <span className="text-emerald-400 font-black tracking-widest uppercase text-xs sm:text-sm">Аудит и контроль</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight">
              Ревизорам и <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">сотрудникам КРО</span>
            </h2>
            <div className="space-y-4 text-slate-300 text-base leading-relaxed text-left">
              <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl">
                <span className="text-rose-455 text-xs font-black uppercase tracking-widest block mb-1">Боль:</span>
                <p className="text-sm font-normal text-slate-300">
                  Проверка вещевых расчетов вручную — это муторный процесс, забирающий дни работы. Ошибки в формулах могут стоить крупных бюджетных штрафов или незаконных выплат.
                </p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl">
                <span className="text-emerald-455 text-xs font-black uppercase tracking-widest block mb-1">Решение:</span>
                <p className="text-sm font-normal text-slate-200">
                  Проведите быстрый аудит «в два клика». Сравните уже насчитанные справки с эталонным алгоритмом и мгновенно выявите расхождения, переплаты или недоплаты.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Comparison / Audit Placeholder */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 w-full relative flex justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl blur-3xl opacity-60" />
            <div className="relative w-full max-w-lg bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl overflow-hidden group">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800/60">
                <span className="text-xs text-slate-400 font-bold font-mono">Анализ расхождения сумм</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
                  КРО АУДИТ
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-black block">Расчет бухгалтерии (ручной)</span>
                    <span className="text-lg font-black text-rose-450">32 500 ₽</span>
                  </div>
                  <div className="text-[10px] bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded-lg border border-rose-500/20 font-bold">
                    ⚠️ Утеряно 18 позиций
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black block">ФСИН: Вещевка Pro</span>
                    <span className="text-lg font-black text-emerald-400">84 350 ₽</span>
                  </div>
                  <div className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-bold">
                    🛡️ 100% точно по нормам
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex justify-between items-center font-sans text-xs">
                  <span className="text-slate-400 font-medium">Разница в пользу сотрудника:</span>
                  <span className="text-emerald-400 font-black text-sm animate-pulse">
                    +51 850 ₽ 🚀
                  </span>
                </div>
              </div>

              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 text-center select-none">
                <Clock className="text-emerald-400 w-12 h-12 mb-3 animate-pulse" />
                <h4 className="text-white font-bold text-base mb-1">Скриншот аудита КРО</h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  Сюда будет вставлен скриншот сопоставления расчетов и поиска неучтенных выплат в реальном времени.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 4: Legal / Легальность (Graphic Left, Text Right) */}
      <section className="relative z-10 py-24 md:py-32 bg-slate-950 border-t border-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Column: Official Document Mockup Placeholder */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 w-full relative flex justify-center order-2 lg:order-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-3xl blur-2xl opacity-60" />
            <div className="relative w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl overflow-hidden group aspect-[1/1.3] flex flex-col justify-between">
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-blue-400" />
                  <span className="text-xs text-slate-400 font-mono">Нормативные_акты.pdf</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                  OFFICIAL DECREE
                </span>
              </div>

              <div className="flex-1 my-4 p-4.5 bg-slate-950/60 border border-slate-850 rounded-2xl flex flex-col justify-between text-[8px] font-sans text-slate-400 relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                  <Scale size={120} className="text-white" />
                </div>

                <div className="space-y-2">
                  <div className="h-3 w-3/4 bg-slate-700 rounded-sm mx-auto font-black text-center flex items-center justify-center text-[7px] text-white">ПРАВИТЕЛЬСТВО РОССИЙСКОЙ ФЕДЕРАЦИИ</div>
                  <div className="h-2 w-20 bg-slate-800 rounded-sm mx-auto" />
                </div>

                <div className="space-y-2.5 my-4">
                  <div className="h-1.5 w-full bg-slate-800 rounded-sm" />
                  <div className="h-1.5 w-11/12 bg-slate-800 rounded-sm" />
                  <div className="h-1.5 w-full bg-slate-800 rounded-sm" />
                  <div className="h-1.5 w-4/5 bg-slate-800 rounded-sm" />
                  <div className="h-1.5 w-full bg-slate-800 rounded-sm" />
                  <div className="h-1.5 w-9/10 bg-slate-800 rounded-sm" />
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-800/40">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[6px] text-slate-500">Гербовая печать</span>
                    <div className="w-6 h-6 rounded-full border border-blue-500/20 bg-blue-500/5 flex items-center justify-center">
                      <Scale size={10} className="text-blue-400" />
                    </div>
                  </div>
                  <div className="h-2 w-16 bg-slate-800 rounded-sm self-end" />
                </div>
              </div>

              <div className="text-center">
                <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  ⚖️ Проверено юристами УИС
                </span>
              </div>

              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 text-center select-none">
                <ShieldCheck className="text-blue-400 w-12 h-12 mb-3 animate-pulse" />
                <h4 className="text-white font-bold text-base mb-1">Скан нормативно-правового акта</h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  Сюда будет вставлен скан официального приказа ФСИН или Постановления Правительства с гербовой печатью.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Text */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start order-1 lg:order-2"
          >
            <span className="text-blue-400 font-black tracking-widest uppercase text-xs sm:text-sm">Легальность</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight">
              Строго по закону <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">и приказам ФСИН</span>
            </h2>
            <p className="text-slate-300 text-lg sm:text-xl leading-relaxed font-normal text-left">
              Наш алгоритм математически точно высчитывает износ (недонос) и положенность предметов вещевого имущества, опираясь на официальную нормативно-правовую базу:
            </p>
            
            <div className="space-y-4 w-full">
              <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/60 p-5 rounded-[1.5rem] flex gap-4 transition-all duration-300 hover:bg-slate-900/50 hover:border-slate-700/40 hover:translate-x-1 text-left">
                <CheckCircle2 className="text-emerald-450 shrink-0 w-5 h-5 mt-1" />
                <div>
                  <strong className="text-white block text-base font-bold mb-0.5">Постановление Правительства РФ № 150</strong>
                  <span className="text-slate-400 leading-relaxed text-xs sm:text-sm font-normal">От 10.02.2021 «О вещевом обеспечении сотрудников УИС». Основные правила выдачи форменной одежды и выплат.</span>
                </div>
              </div>
              <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/60 p-5 rounded-[1.5rem] flex gap-4 transition-all duration-300 hover:bg-slate-900/50 hover:border-slate-700/40 hover:translate-x-1 text-left">
                <CheckCircle2 className="text-emerald-450 shrink-0 w-5 h-5 mt-1" />
                <div>
                  <strong className="text-white block text-base font-bold mb-0.5">Постановление Правительства РФ № 789</strong>
                  <span className="text-slate-400 leading-relaxed text-xs sm:text-sm font-normal">От 22.12.2006 «Об утверждении Правил обеспечения вещевым имуществом сотрудников УИС».</span>
                </div>
              </div>
              <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/60 p-5 rounded-[1.5rem] flex gap-4 transition-all duration-300 hover:bg-slate-900/50 hover:border-slate-700/40 hover:translate-x-1 text-left">
                <CheckCircle2 className="text-emerald-450 shrink-0 w-5 h-5 mt-1" />
                <div>
                  <strong className="text-white block text-base font-bold mb-0.5">Приказы Минюста № 211 и ФСИН № 676</strong>
                  <span className="text-slate-400 leading-relaxed text-xs sm:text-sm font-normal">Об утверждении Порядка обеспечения вещевым имуществом. Регламентируют точные сроки носки и нормы снабжения.</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Telegram Bot Promo Section */}
      <section className="relative z-10 py-20 md:py-28 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 rounded-[2.5rem] p-10 md:p-12 mb-16 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl group"
          >
            {/* Top border spotlight highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-blue-500/30 via-indigo-500/20 to-transparent" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-500" />
            
            <div className="flex items-center gap-8 flex-1 flex-col sm:flex-row text-center sm:text-left">
              <div className="w-20 h-20 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-inner">
                <Smartphone size={36} />
              </div>
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  Мобильность
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">Работайте без компьютера прямо с телефона</h2>
                <p className="text-slate-355 text-[0.95rem] leading-relaxed font-normal">
                  Наш официальный Telegram-бот позволяет быстро внести данные арматурной карточки и мгновенно сгенерировать расчетную Excel-справку прямо на службе или в дороге. Полная синхронизация с вашим аккаунтом!
                </p>
              </div>
            </div>
            
            <motion.a 
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              href="https://t.me/fsin_calc_bot"
              target="_blank"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4.5 rounded-2xl font-black text-[0.925rem] shadow-md shadow-blue-600/25 border border-blue-500/30 flex items-center gap-2.5 shrink-0 cursor-pointer text-center"
            >
              <MessageSquare size={16} />
              Запустить Telegram бот
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-32 md:py-40 bg-slate-955/30 border-y border-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <span className="text-blue-400 font-black tracking-widest uppercase text-xs sm:text-sm">Тарифы</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mt-3 leading-[1.1] tracking-tight">
              Выберите подходящий <span className="text-slate-500 font-extrabold">формат работы</span>
            </h2>
          </motion.div>

          {/* Guaranteed Calculations Hybrid Billing Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto mb-16 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-purple-500/10 border border-blue-500/20 p-6 rounded-3xl text-center backdrop-blur-md relative overflow-hidden group shadow-lg"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/35 to-transparent" />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <span className="bg-emerald-500 text-slate-950 font-black px-3 py-1 rounded-full text-[10px] uppercase tracking-wider shadow-md shadow-emerald-500/20 animate-pulse">
                Уникальная гарантия 🛡️
              </span>
              <span className="text-base font-extrabold text-slate-100">
                PRO-подписка никогда не сгорит просто так!
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-3 max-w-3xl mx-auto leading-relaxed">
              Мы гарантируем ценность: ваши средства активны до тех пор, пока вы не совершите **минимум 5 расчетов** (для месячной подписки) или **30 расчетов** (для полугодовой подписки). Если за месяц у вас никто не уволился — подписка остается активной до проведения расчетов!
            </p>
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
                    <span className="text-slate-300 text-sm font-medium">Разовый расчет (без ограничений по времени)</span>
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
              <div className="absolute top-4 right-4 bg-blue-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md shadow-blue-500/30 z-20">
                Популярный
              </div>
              <div className="absolute top-4 left-4 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md shadow-emerald-500/5 z-20">
                <CheckCircle2 size={10} /> 5 расчетов гарантировано
              </div>
              
              <div className="relative z-10 flex-1 flex flex-col mt-4">
                <h3 className="text-2xl font-bold text-white mb-1">Для тыловиков и ревизоров</h3>
                <div className="text-sm text-blue-300 font-bold mb-4">Ежемесячная подписка</div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-extrabold text-white tracking-tight">990</span>
                  <span className="text-slate-400 font-bold text-sm">руб. / мес.</span>
                </div>
                <div className="text-blue-300 font-medium text-xs mb-6 leading-relaxed bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 flex-grow">
                  Идеальный инструмент, который позволит вам быстро, чётко и безошибочно рассчитывать компенсации. Получите точный расчёт, который поможет не попасться на штрафы по проверке КРО.
                  <div className="mt-3 text-emerald-400 font-bold flex items-start gap-1">
                    <span>🔥</span>
                    <span>Гарантия 5 расчетов: Подписка остается активной, пока вы не сделаете минимум 5 расчетов! Ваши деньги никогда не сгорят.</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-blue-400 shrink-0 w-5 h-5 mt-0.5" />
                    <span className="text-slate-200 text-sm font-medium">Безлимитная генерация всех справок</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-blue-400 shrink-0 w-5 h-5 mt-0.5" />
                    <span className="text-slate-200 text-sm font-medium">Сохранение всех справок в облачном архиве</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-blue-400 shrink-0 w-5 h-5 mt-0.5" />
                    <span className="text-slate-200 text-sm font-medium">Гарантия точности по приказам и нормативам</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-blue-400 shrink-0 w-5 h-5 mt-0.5" />
                    <span className="text-slate-200 text-sm font-medium">1 месяц PRO в подарок за рекомендацию</span>
                  </li>
                </ul>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartPro} 
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
              <div className="absolute top-4 left-4 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md shadow-emerald-500/5 z-20">
                <CheckCircle2 size={10} /> 30 расчетов гарантировано
              </div>
              
              <div className="relative z-10 flex-1 flex flex-col mt-4">
                <h3 className="text-2xl font-bold text-white mb-2">PRO на 6 месяцев</h3>
                <div className="text-sm text-emerald-300 font-bold mb-4 font-sans">Пакетное предложение</div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-extrabold text-white tracking-tight">3999</span>
                  <span className="text-slate-400 font-bold text-sm">руб. / за 6 мес.</span>
                </div>
                <div className="text-emerald-400 font-medium text-xs mb-6 leading-relaxed bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 flex-grow">
                  Идеальный решение для ревизоров (КРО). Экономьте десятки часов на рутинных проверках. Находите любые ошибки в расчетах за считанные секунды!
                  <div className="mt-3 text-emerald-400 font-bold flex items-start gap-1">
                    <span>🔥</span>
                    <span>Гарантия 30 расчетов: Подписка остается активной, пока вы не сделаете минимум 30 расчетов! Полная защита ваших средств.</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-400 shrink-0 w-5 h-5 mt-0.5" />
                    <span className="text-slate-300 text-sm font-medium">Десятки часов сэкономленного времени</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-400 shrink-0 w-5 h-5 mt-0.5" />
                    <span className="text-slate-300 text-sm font-medium">Окупается при первом же споре с бухгалтерией</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-400 shrink-0 w-5 h-5 mt-0.5" />
                    <span className="text-slate-300 text-sm font-medium">В разы дешевле найма юриста или аудитора</span>
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
                onClick={handleStartPro} 
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
            ФСИН Вещевка
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
