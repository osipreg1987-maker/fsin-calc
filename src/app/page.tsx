"use client";

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Calculator, Clock, Scale, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/calc');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-[#1e293b]/20">
      {/* Navbar */}
      <nav className="bg-[#1e293b] text-white p-4 md:px-8 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl tracking-wide">
          <Scale className="text-[#d4af37]" />
          <span>ФСИН Компенсация</span>
        </div>
        <button 
          onClick={handleStart}
          className="bg-[#d4af37] text-[#1e293b] px-5 py-2 rounded-lg font-bold hover:bg-yellow-500 transition-colors flex items-center gap-2"
        >
          <Calculator size={18} />
          <span className="hidden sm:inline">Рассчитать</span>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24 max-w-6xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 max-w-3xl"
        >
          <p className="text-sm md:text-base font-bold text-slate-500 uppercase tracking-widest">
            Для действующих сотрудников и пенсионеров ФСИН России
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e293b] leading-tight">
            Точный расчет компенсации <br className="hidden md:block" />
            за вещевое имущество
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-medium">
            Узнайте точную сумму выплаты по актуальным ценам за 2 минуты. Без сложных таблиц, формул и бюрократии.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleStart}
              className="bg-[#1e293b] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 hover:-translate-y-1"
            >
              Начать расчет
              <ArrowRight size={20} className="text-[#d4af37]" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-8 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-green-600" />
              <span>Абсолютно анонимно</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-blue-600" />
              <span>Занимает 2 минуты</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-purple-600" />
              <span>Готовая справка-расчет</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Pain Points Section */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1e293b] mb-4">Сталкиваетесь с этим при оформлении рапорта?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Мы создали этот сервис, чтобы решить главные проблемы сотрудников тылового обеспечения и увольняющихся.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#f8fafc] p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 text-red-600 flex items-center justify-center rounded-full mb-4">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Сложная бюрократия</h3>
              <p className="text-slate-600">Самостоятельный расчет по запутанным таблицам приказов и нормам положенности занимает часы и часто ведет к ошибкам.</p>
            </div>
            <div className="bg-[#f8fafc] p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 flex items-center justify-center rounded-full mb-4">
                <Calculator size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Ошибки бухгалтерии</h3>
              <p className="text-slate-600">Постоянное ощущение, что финансовая часть занижает суммы выплат или использует устаревшие справки-расчеты стоимости.</p>
            </div>
            <div className="bg-[#f8fafc] p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full mb-4">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Возврат документов</h3>
              <p className="text-slate-600">Малейшая ошибка в расчетах в рапорте приводит к возврату документов и затягиванию сроков выплат на месяцы.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Legal Section */}
      <section className="py-16 bg-[#1e293b] text-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-[#d4af37]">Строго по закону и приказам</h2>
            <p className="text-slate-300 text-lg">
              Наш алгоритм математически точно высчитывает износ (недонос) и положенность предметов вещевого имущества, опираясь на официальную нормативно-правовую базу:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <CheckCircle2 className="text-green-400 shrink-0 mt-1" />
                <span><strong className="text-white block mb-1">Приказ Минюста РФ № 211</strong><span className="text-slate-400 text-sm">Об утверждении Порядка обеспечения вещевым имуществом сотрудников УИС (сроки носки и нормы положенности).</span></span>
              </li>
              <li className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <CheckCircle2 className="text-green-400 shrink-0 mt-1" />
                <span><strong className="text-white block mb-1">Ежегодные Распоряжения ФСИН</strong><span className="text-slate-400 text-sm">Актуальная база данных справок-расчетов стоимости предметов вещевого имущества.</span></span>
              </li>
            </ul>
          </div>
          <div className="flex-1 bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden">
            <ShieldCheck size={160} className="text-slate-700/30 absolute -top-10 -right-10 transform rotate-12" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4 text-white">Юридическая точность</h3>
              <p className="text-slate-300 mb-8 leading-relaxed">Готовую Excel-справку можно смело прикладывать к рапорту на увольнение или использовать для сверки с бухгалтерией. Все формулы проверены юристами.</p>
              <button onClick={handleStart} className="bg-white text-[#1e293b] px-6 py-4 rounded-xl font-bold hover:bg-slate-100 transition-colors w-full flex items-center justify-center gap-2 text-lg">
                <Calculator size={20} />
                Проверить свою сумму
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-500 py-10 text-center px-4">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
          <Scale size={32} className="text-slate-700" />
          <p>© {new Date().getFullYear()} ФСИН Калькулятор Pro. Все расчеты носят информационный характер.</p>
          <p className="text-xs bg-slate-800 px-4 py-2 rounded-full inline-block">🔒 Данные не сохраняются на серверах и не передаются третьим лицам.</p>
        </div>
      </footer>
    </div>
  );
}
