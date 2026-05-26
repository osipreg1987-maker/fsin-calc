import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 relative">
        <Link href="/" className="absolute top-8 left-8 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-white mb-8 text-center mt-8 md:mt-0">Публичная оферта (Пользовательское соглашение)</h1>
        <div className="space-y-6 text-slate-400 leading-relaxed">
          <p>Настоящий документ является публичной офертой <span className="text-amber-500 bg-amber-500/10 px-2 py-1 rounded">[ВСТАВЬТЕ ФИО ИЛИ НАЗВАНИЕ ИП/САМОЗАНЯТОГО]</span> (далее — «Исполнитель») и содержит все существенные условия предоставления доступа к сервису «FSIN Calc».</p>
          
          <h2 className="text-xl font-semibold text-white mt-8">1. Общие положения</h2>
          <p>Оплата услуг (покупка PRO-подписки) означает полное и безоговорочное согласие Пользователя с условиями настоящей оферты.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8">2. Предмет соглашения</h2>
          <p>Исполнитель предоставляет Пользователю доступ к расширенному функционалу сервиса (PRO-тариф) на условиях подписки сроком на 1 месяц (или иной выбранный период). Бесплатная версия предоставляется "как есть".</p>
          
          <h2 className="text-xl font-semibold text-white mt-8">3. Права и обязанности</h2>
          <p>Пользователь обязуется не использовать сервис для незаконных целей. Исполнитель обязуется обеспечивать работоспособность сервиса, за исключением случаев проведения профилактических и технических работ.</p>

          <h2 className="text-xl font-semibold text-white mt-8">4. Стоимость и порядок расчетов</h2>
          <p>Стоимость услуг указана на странице тарифов Сервиса. Оплата производится безналичным путем через официальный платежный шлюз ЮKassa. Услуга считается оказанной в полном объеме в момент предоставления доступа к PRO-функциям на аккаунте Пользователя.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8">5. Реквизиты Исполнителя</h2>
          <p className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <strong>Статус:</strong> <span className="text-amber-500">[Самозанятый / Индивидуальный предприниматель]</span><br/>
            <strong>ФИО:</strong> <span className="text-amber-500">[Иванов Иван Иванович]</span><br/>
            <strong>ИНН:</strong> <span className="text-amber-500">[000000000000]</span><br/>
            <strong>Email:</strong> <span className="text-amber-500">[example@email.com]</span>
          </p>
        </div>
      </div>
    </div>
  );
}
