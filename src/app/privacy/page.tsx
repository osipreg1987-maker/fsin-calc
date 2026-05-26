import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 relative">
        <Link href="/" className="absolute top-8 left-8 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-white mb-8 text-center mt-8 md:mt-0">Политика конфиденциальности</h1>
        <div className="space-y-6 text-slate-400 leading-relaxed">
          <p>Настоящая Политика конфиденциальности описывает, как Сервис «FSIN Calc» (далее — «Сервис») собирает, использует и хранит ваши данные.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8">1. Сбор информации</h2>
          <p>Мы собираем информацию, которую вы предоставляете при регистрации: email-адрес. Введенные вами данные сотрудников для расчетов (ФИО, звания) хранятся исключительно в зашифрованном виде в базе данных для обеспечения функции "Облачного архива" и недоступны третьим лицам.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8">2. Использование данных</h2>
          <p>Данные используются исключительно для обеспечения работоспособности Сервиса: авторизации, сохранения ваших расчетов и обратной связи.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8">3. Защита данных</h2>
          <p>Мы применяем современные технические меры (включая Row Level Security в БД) для защиты ваших данных от несанкционированного доступа. Никто, кроме вас, не может прочитать ваш архив расчетов.</p>

          <h2 className="text-xl font-semibold text-white mt-8">4. Передача третьим лицам</h2>
          <p>Мы не продаем, не обмениваем и не передаем личные данные пользователей сторонним компаниям, за исключением официального платежного шлюза ЮKassa исключительно для проведения платежа (Сервис не собирает и не хранит данные банковских карт).</p>
          
          <h2 className="text-xl font-semibold text-white mt-8">5. Контакты</h2>
          <p>Если у вас есть вопросы по политике конфиденциальности, свяжитесь с нами: <span className="text-amber-500 bg-amber-500/10 px-2 py-1 rounded">[ВСТАВЬТЕ ВАШ EMAIL]</span>.</p>
        </div>
      </div>
    </div>
  );
}
