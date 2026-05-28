import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, AlertCircle, CheckCircle2, FileQuestion } from 'lucide-react';

export default function InstructionsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-8 font-medium">
          <ArrowLeft size={20} /> Вернуться в калькулятор
        </Link>
        
        <div className="glass-panel rounded-3xl p-8 md:p-10 border border-indigo-500/20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            Инструкция: Как получить компенсацию за вещевое имущество
          </h1>
          
          <div className="prose prose-invert prose-indigo max-w-none">
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Многие увольняющиеся сотрудники сталкиваются с тем, что бухгалтерия занижает сумму компенсации за неполученное вещевое имущество или затягивает выплаты. Эта инструкция поможет вам защитить свои права.
            </p>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <FileQuestion className="text-amber-400" /> Шаг 1: Запросите Арматурную карточку
              </h2>
              <p className="text-slate-300 mb-4">
                Первое, что вам необходимо сделать — это получить в тыловой службе (ОКБИ и ХО) вашу <strong>арматурную карточку</strong> (или справку о положенности).
              </p>
              <ul className="space-y-2 text-slate-300 mb-4">
                <li className="flex gap-2"><CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} /> Арматурная карточка содержит точные даты выдачи и положенности всех предметов формы.</li>
                <li className="flex gap-2"><CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} /> Без нее невозможно сделать точный расчет.</li>
                <li className="flex gap-2"><CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} /> Тыловики обязаны предоставить вам выписку из карточки или дать возможность сфотографировать ее при увольнении.</li>
              </ul>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <FileText className="text-blue-400" /> Шаг 2: Внесите данные в калькулятор
              </h2>
              <p className="text-slate-300 mb-4">
                Откройте наш калькулятор и перенесите данные из арматурной карточки:
              </p>
              <ul className="space-y-2 text-slate-300 mb-4">
                <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div> Укажите периоды вашей службы и нормы снабжения.</li>
                <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div> Заполните даты фактической выдачи каждого предмета (или оставьте поле пустым, если вещь не выдавалась вообще).</li>
                <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div> Укажите точную дату увольнения — программа автоматически рассчитает сроки носки и пропорционально вычтет стоимость, если это необходимо.</li>
              </ul>
            </div>

            <div className="bg-slate-800/50 border border-indigo-500/30 rounded-xl p-6 mb-8 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <AlertCircle className="text-rose-400" /> Шаг 3: Распечатайте документы и подайте Рапорт
              </h2>
              <p className="text-slate-300 mb-4">
                После расчета скачайте два документа:
              </p>
              <ol className="list-decimal pl-5 space-y-3 text-slate-300 mb-6">
                <li><strong>Справка-обоснование (Excel).</strong> В ней уже прописаны все нормативно-правовые акты (ПП № 150, Приказ ФСИН № 676, ч. 2 ст. 69 ФЗ № 197), которые обязывают бухгалтерию выплатить вам рассчитанную сумму.</li>
                <li><strong>Готовый рапорт (Word).</strong> В нем уже заполнены данные начальника, ваши данные и итоговая сумма.</li>
              </ol>
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-lg text-rose-200 text-sm">
                <strong>Важно!</strong> Подавайте рапорт с приложенной справкой-обоснованием через канцелярию (секретариат) в двух экземплярах. На вашем экземпляре должны поставить входящий номер и дату. Это ваша страховка на случай суда.
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Как спорить с бухгалтерией?</h2>
              <p className="text-slate-300 mb-4">
                Если бухгалтерия отказывается выплачивать сумму по вашему расчету, ссылаясь на "свои программы" или "внутренние указания":
              </p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex gap-3">
                  <div className="bg-indigo-500/20 text-indigo-400 rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                  <span>Требуйте предоставить их расчет <strong>в письменном виде</strong> с указанием формул и ссылок на нормативные акты.</span>
                </li>
                <li className="flex gap-3">
                  <div className="bg-indigo-500/20 text-indigo-400 rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                  <span>Сравните их расчет с вашей справкой-обоснованием. Частая ошибка бухгалтеров — неправильное применение сроков носки по <em>Постановлению Правительства № 150</em>.</span>
                </li>
                <li className="flex gap-3">
                  <div className="bg-indigo-500/20 text-indigo-400 rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                  <span>Сообщите, что ваш расчет опирается на прямые нормы закона (ФЗ № 197 и ПП № 150), и в случае невыплаты вы будете вынуждены обратиться в прокуратуру и суд с требованием взыскать не только компенсацию, но и пени за задержку выплат. Обычно на этом этапе спор решается в пользу сотрудника.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
