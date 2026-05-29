// @ts-nocheck
"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, LogOut, User, Download, Plus, Trash2, HelpCircle, Archive, Crown, ChevronDown, ChevronUp, Lock, Unlock, FileText, X, Scale } from 'lucide-react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import IssueLogTable from './IssueLogTable';
import ResultsTable from './ResultsTable';
import ProModal from './ProModal';
import TelegramLinkButton from './TelegramLinkButton';
import { useCalculatorResults } from '../lib/useCalculatorResults';
import { formatCurrency, getRoundedMonths } from '../lib/helpers';
import { exportToExcel } from '../lib/exportHelpers';
import { generateWordReport } from '../lib/reportGenerator';
import { parseDate } from '../lib/constants';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Calculator() {
  const [employeeFio, setEmployeeFio] = useState('');
  const [employeeRank, setEmployeeRank] = useState('');
  const [gender, setGender] = useState('M');
  const [periods, setPeriods] = useState([{ id: 1, start: '', end: '', norm: 2 }]);
  const dismDate = periods[periods.length - 1]?.end || '';
  const [dismissalGroup, setDismissalGroup] = useState('V');
  const [itemTotals, setItemTotals] = useState({});
  const [customPrices, setCustomPrices] = useState({});
  
  const [instData, setInstData] = useState({
      institution: '',
      region: '',
      bossTitle: 'Начальник', bossRank: 'полковник внутренней службы', bossName: '',
      okbiTitle: 'Начальник ОКБИ и ХО', okbiRank: 'майор внутренней службы', okbiName: '',
      accTitle: 'Главный бухгалтер', accRank: '', accName: ''
  });
  const [isInstLocked, setIsInstLocked] = useState(false);
  const [isInstOpen, setIsInstOpen] = useState(true);
  const [archive, setArchive] = useState<any[]>([]);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [proModalTitle, setProModalTitle] = useState('');
  const [isTwa, setIsTwa] = useState(false);
  const [isLoadingUnlock, setIsLoadingUnlock] = useState(false);

  const { user, subscription, signOut, isLoading } = useAuth();
  const router = useRouter();

  const isPro = subscription?.is_pro || false;

  const existingRecord = useMemo(() => {
    if (!employeeFio) return null;
    return archive.find(r => r.employee_fio.trim().toLowerCase() === employeeFio.trim().toLowerCase());
  }, [archive, employeeFio]);

  const isUnlocked = isPro || existingRecord?.is_unlocked === true;

  const fetchArchive = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('archives')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Ошибка загрузки архива:', error);
      alert('Не удалось загрузить архив. Проверьте соединение и права доступа.');
      setArchive([]);
      return;
    }
    setArchive(data ?? []);
  };

  useEffect(() => {
    if (user) fetchArchive();
    else setArchive([]);
  }, [user]);

  useEffect(() => {
    const draftStr = localStorage.getItem('fsin_calc_draft');
    if (draftStr) {
      try {
        const draft = JSON.parse(draftStr);
        if (draft.employeeFio) setEmployeeFio(draft.employeeFio);
        if (draft.employeeRank) setEmployeeRank(draft.employeeRank);
        if (draft.dismissalGroup) setDismissalGroup(draft.dismissalGroup);
        if (draft.gender) setGender(draft.gender);
        if (draft.periods && Array.isArray(draft.periods) && draft.periods.length > 0) setPeriods(draft.periods);
        if (draft.itemTotals && typeof draft.itemTotals === 'object') setItemTotals(draft.itemTotals);
        if (draft.customPrices && typeof draft.customPrices === 'object') setCustomPrices(draft.customPrices);
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  }, []);

  useEffect(() => {
    const draft = { employeeFio, employeeRank, dismissalGroup, gender, periods, itemTotals, customPrices };
    localStorage.setItem('fsin_calc_draft', JSON.stringify(draft));
  }, [employeeFio, employeeRank, dismissalGroup, gender, periods, itemTotals, customPrices]);


  useEffect(() => {
      const saved = localStorage.getItem('fsin_instData');
      if (saved) {
          setInstData(JSON.parse(saved));
      } else {
          setInstData(prev => ({
              ...prev,
              institution: localStorage.getItem('fsin_institution') || '',
              region: localStorage.getItem('fsin_region') || ''
          }));
      }
      setIsInstLocked(localStorage.getItem('fsin_inst_locked') === 'true');
      
      // Инициализация Telegram Web App
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
          const tg = (window as any).Telegram.WebApp;
          if (tg.initData) {
              setIsTwa(true);
              tg.ready();
              tg.expand();
          }
      }

      // Launch onboarding tour
      const tourCompleted = localStorage.getItem('fsin_tour_completed');
      if (tourCompleted !== 'true' && !(typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initData)) {
          setTimeout(startTour, 1500);
      }
  }, []);

  const startTour = () => {
      const driverObj = driver({
          showProgress: true,
          animate: true,
          nextBtnText: 'Далее ➔',
          prevBtnText: 'Назад',
          doneBtnText: 'Понятно',
          steps: [
              { element: '#tour-inst-data', popover: { title: 'Шаг 1: Данные учреждения', description: 'Заполните данные об учреждении и руководстве. Нажмите на замочек 🔒, чтобы сохранить их для последующих справок!' } },
              { element: '#tour-employee-details', popover: { title: 'Шаг 2: Данные сотрудника', description: 'Введите ваше ФИО и основание увольнения. Эти данные никуда не отправляются и нужны только для красивого оформления итоговой Excel-справки.' } },
              { element: '#tour-gender', popover: { title: 'Шаг 3: Укажите ваш пол', description: 'Это очень важно! Нормы положенности, а также сроки носки (особенно для офисного и полевого обмундирования) отличаются для мужчин и женщин.' } },
              { element: '#tour-periods', popover: { title: 'Шаг 4: Периоды службы', description: 'Добавьте периоды вашей службы. Обязательно добавляйте НОВЫЙ период (через кнопку "Добавить период"), если вы переходили из Младшего начальствующего состава (МНС) в Офицеры, так как нормы для них кардинально разные!' } },
              { element: '#tour-issue-log', popover: { title: 'Шаг 5: Арматурная карточка', description: 'Перенесите сюда данные из вашей арматурной карточки: просто выберите те вещи, которые вы ФАКТИЧЕСКИ получили на складе. Калькулятор сам рассчитает износ (недонос) и итоговую сумму компенсации за то, что вам недодали!' } },
              { element: '#tour-dashboards', popover: { title: 'Шаг 6: Скачивание справок', description: 'Нажмите на любую из этих панелей, чтобы скачать нужную справку (на выплату, удержание или обоснование). Файлы формируются мгновенно!' } },
              { element: '#tour-export', popover: { title: 'Шаг 7: Рапорт и инструкции', description: 'Здесь вы можете скачать готовый шаблон рапорта, а также найти подробную инструкцию для спорных ситуаций с бухгалтерией.' } }
          ],
          onDestroyStarted: () => {
              localStorage.setItem('fsin_tour_completed', 'true');
              driverObj.destroy();
          }
      });
      driverObj.drive();
  };

  const sendToTelegramBot = () => {
      const tg = (window as any).Telegram.WebApp;
      if (!tg) return;
      
      const payload = {
          employeeFio,
          employeeRank,
          dismissalGroup,
          dismDate,
          gender,
          periods,
          instData,
          itemTotals,
          customPrices
      };
      
      tg.sendData(JSON.stringify(payload));
  };

  const updateInstData = (field: string, value: string) => {
      const newData = { ...instData, [field]: value };
      setInstData(newData);
      if (isInstLocked) localStorage.setItem('fsin_instData', JSON.stringify(newData));
  };

  const toggleInstLock = () => {
      const newVal = !isInstLocked;
      setIsInstLocked(newVal);
      localStorage.setItem('fsin_inst_locked', newVal.toString());
      if (newVal) {
          localStorage.setItem('fsin_instData', JSON.stringify(instData));
      } else {
          localStorage.removeItem('fsin_instData');
      }
  };

  const saveToArchive = async () => {
      if (!user) {
          alert("Для сохранения архива необходимо авторизоваться!");
          router.push('/auth');
          return;
      }
      if (!employeeFio) return alert("Сначала введите ФИО сотрудника!");
      
      const existing = archive.find(r => r.employee_fio === employeeFio);
      
      if (!isPro && archive.length >= 1 && !existing) {
          setProModalTitle('Безлимитный архив доступен в PRO');
          setIsProModalOpen(true);
          return;
      }

      const record = {
          user_id: user.id,
          employee_fio: employeeFio,
          employee_rank: employeeRank,
          dismissal_group: dismissalGroup,
          dism_date: dismDate,
          gender,
          periods,
          item_totals: itemTotals,
          custom_prices: customPrices
      };
      
      let res;
      if (existing) {
          res = await supabase.from('archives').update(record).eq('id', existing.id);
      } else {
          res = await supabase.from('archives').insert([record]);
      }
          
      if (res.error) {
          console.error("Ошибка сохранения", res.error);
          alert("Ошибка сохранения в облако");
      } else {
          alert("Расчет успешно сохранен в облачный архив!");
          fetchArchive();
      }
  };

  const loadFromArchive = (record: any) => {
      if (!confirm(`Загрузить расчет для ${record.employee_fio}? Текущие несохраненные данные будут стерты.`)) return;
      
      const safeParse = (val: any, fallback: any) => {
          if (typeof val === 'string') {
              try { return JSON.parse(val); } catch(e) { return fallback; }
          }
          return val || fallback;
      };

      let parsedPeriods = safeParse(record.periods, [{ id: 1, start: '', end: '', norm: 2 }]);
      if (!Array.isArray(parsedPeriods) || parsedPeriods.length === 0) {
          parsedPeriods = [{ id: 1, start: '', end: '', norm: 2 }];
      }

      let parsedTotals = safeParse(record.item_totals, {});
      if (typeof parsedTotals !== 'object' || parsedTotals === null || Array.isArray(parsedTotals)) {
          parsedTotals = {};
      }

      let parsedPrices = safeParse(record.custom_prices, {});
      if (typeof parsedPrices !== 'object' || parsedPrices === null || Array.isArray(parsedPrices)) {
          parsedPrices = {};
      }

      setEmployeeFio(record.employee_fio || '');
      setEmployeeRank(record.employee_rank || '');
      setDismissalGroup(record.dismissal_group || 'V');
      setGender(record.gender || 'M');
      setPeriods(parsedPeriods);
      setItemTotals(parsedTotals);
      setCustomPrices(parsedPrices);
      setIsArchiveOpen(false);
  };
  
  const removeFromArchive = async (e: any, id: string) => {
      e.stopPropagation();
      if (!confirm('Удалить расчет из облачного архива?')) return;
      const { error } = await supabase.from('archives').delete().eq('id', id);
      if (error) {
          alert("Ошибка удаления");
      } else {
          fetchArchive();
      }
  };

  const totalServiceMonths = useMemo(() => {
      let total = 0;
      periods.forEach(p => {
          if (p.start && p.end) {
              const s = parseDate(p.start);
              const e = parseDate(p.end);
              if (s && e && s <= e) {
                  total += getRoundedMonths(s, e);
              }
          }
      });
      return total;
  }, [periods]);

  const formatServiceTime = (totalMonths: number) => {
      if (totalMonths === 0) return '0 месяцев';
      const years = Math.floor(totalMonths / 12);
      const months = totalMonths % 12;
      let res = [];
      if (years > 0) {
          let yStr = 'лет';
          if (years % 10 === 1 && years % 100 !== 11) yStr = 'год';
          else if ([2,3,4].includes(years % 10) && ![12,13,14].includes(years % 100)) yStr = 'года';
          res.push(`${years} ${yStr}`);
      }
      if (months > 0) {
          let mStr = 'месяцев';
          if (months === 1) mStr = 'месяц';
          else if ([2,3,4].includes(months)) mStr = 'месяца';
          res.push(`${months} ${mStr}`);
      }
      return res.join(' ');
  };

  const activeNorms = gender === 'M' ? [
    { id: 1, name: 'Норма № 1 (Генералы)' },
    { id: 21, name: 'Норма № 2 (Полковники)' },
    { id: 2, name: 'Норма № 2 (От мл. лейтенанта до подполковника)' },
    { id: 3, name: 'Норма № 3 (Младший начсостав)' }
  ] : [
    { id: 1, name: 'Норма № 1 (Генералы - женщины)' },
    { id: 21, name: 'Норма № 2 (Полковники - женщины)' },
    { id: 2, name: 'Норма № 2 (Офицеры до подполковника)' },
    { id: 4, name: 'Норма № 4 (Младший начсостав - женщины)' }
  ];

  const handleGenderChange = (newGender: string) => {
    setGender(newGender);
    setPeriods([{ id: Math.random(), start: '', end: '', norm: newGender === 'M' ? 2 : 2 }]);
    setItemTotals({});
    setCustomPrices({});
  };

  const addPeriod = () => {
    setPeriods([...periods, { id: Math.random(), start: '', end: '', norm: activeNorms[0].id }]);
  };
  const updatePeriod = (id: number, field: string, value: any) => {
    setPeriods(periods.map(p => p.id === id ? { ...p, [field]: value } : p));
  };
  const removePeriod = (id: number) => {
    if (periods.length > 1) setPeriods(periods.filter(p => p.id !== id));
  };

  const { activeItemsList, groupedItems, results, totalComp, totalDed, finalBalance, isPositive } = useCalculatorResults({
      periods, gender, itemTotals, customPrices, dismissalGroup, dismissalDate: dismDate
  });

  const handleUnlockSingleCalculation = async () => {
      if (!user) {
          alert("Для оплаты и сохранения расчета необходимо авторизоваться!");
          router.push('/auth');
          return;
      }
      if (!employeeFio) {
          alert("Пожалуйста, заполните ФИО сотрудника, чтобы оформить именной расчет.");
          return;
      }

      setIsLoadingUnlock(true);
      try {
          const existing = archive.find(r => r.employee_fio.trim().toLowerCase() === employeeFio.trim().toLowerCase());
          
          const record = {
              user_id: user.id,
              employee_fio: employeeFio,
              employee_rank: employeeRank,
              dismissal_group: dismissalGroup,
              dism_date: dismDate,
              gender,
              periods,
              item_totals: itemTotals,
              custom_prices: customPrices
          };

          let recordId = '';
          if (existing) {
              recordId = existing.id;
              const { error } = await supabase.from('archives').update(record).eq('id', recordId);
              if (error) throw error;
          } else {
              const { data, error } = await supabase.from('archives').insert([record]).select('id').single();
              if (error) throw error;
              recordId = data.id;
          }

          // Обновляем архив локально
          await fetchArchive();

          // Делаем запрос к API оплаты
          const response = await fetch('/api/checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  planType: 'single',
                  archiveId: recordId
              })
          });

          const resData = await response.json();
          if (resData.url) {
              window.location.href = resData.url;
          } else {
              throw new Error(resData.error || 'Не удалось получить ссылку на оплату');
          }
      } catch (err) {
          console.error("Ошибка при разблокировке расчета:", err);
          alert(err instanceof Error ? err.message : "Не удалось начать процесс оплаты. Попробуйте еще раз.");
      } finally {
          setIsLoadingUnlock(false);
      }
  };

  const handleUnlockPro = async () => {
      if (!user) {
          alert("Для оплаты подписки необходимо авторизоваться!");
          router.push('/auth');
          return;
      }
      setIsLoadingUnlock(true);
      try {
          const response = await fetch('/api/checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ planType: 'monthly' })
          });
          const resData = await response.json();
          if (resData.url) {
              window.location.href = resData.url;
          } else {
              throw new Error(resData.error || 'Не удалось получить ссылку на оплату');
          }
      } catch (err) {
          console.error("Ошибка при оплате PRO:", err);
          alert("Не удалось запустить оплату подписки.");
      } finally {
          setIsLoadingUnlock(false);
      }
  };

  const handleExport = (type: 'comp' | 'ded' | 'b2c-comp') => {
      if (!isUnlocked) {
          handleUnlockSingleCalculation();
          return;
      }
      exportToExcel(type, {
          results,
          instData,
          employeeFio,
          employeeRank,
          dismissalDate: dismDate
      });
  };

  const handleReportExport = () => {
      if (!isUnlocked) {
          handleUnlockSingleCalculation();
          return;
      }
      generateWordReport({
          results,
          instData,
          employeeFio,
          employeeRank
      });
  };

  return (
    <div className="space-y-8">
      {/* Header and Export Buttons */}
      {!isTwa && (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
              {isLoading ? (
                  <div className="bg-slate-800/50 border border-slate-700/50 text-slate-400 px-5 py-2 rounded-xl flex items-center gap-2 animate-pulse">
                      <div className="w-4 h-4 rounded-full bg-slate-700"></div>
                      <span className="text-sm">Загрузка...</span>
                  </div>
              ) : user ? (
                  <div className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl px-4 py-2 rounded-xl flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                          <User size={16} className="text-white" />
                      </div>
                      <div className="text-sm">
                          <div className="text-slate-400 text-xs flex items-center gap-1">
                              Личный кабинет
                              {isPro && <Crown size={12} className="text-amber-400" />}
                          </div>
                          <div className="text-white font-medium">{user.email}</div>
                      </div>
                      <TelegramLinkButton />
                      <button onClick={signOut} className="ml-2 p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors" title="Выйти">
                          <LogOut size={16} />
                      </button>
                  </div>
              ) : (
                  <button onClick={() => router.push('/auth')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-medium transition-colors">
                      Войти в систему
                  </button>
              )}
          </div>
          <div className="flex flex-wrap items-center gap-2 ml-auto bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 p-1.5 rounded-2xl shadow-lg shadow-black/20" id="tour-export">
              <motion.button 
                  whileHover={{ scale: 1.03, x: 2 }} 
                  whileTap={{ scale: 0.97 }}
                  onClick={startTour} 
                  className="hidden md:flex items-center gap-2 text-slate-300 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                  <HelpCircle size={15} /> Обучение
              </motion.button>
              
              <motion.a 
                  whileHover={{ scale: 1.03, x: 2 }} 
                  whileTap={{ scale: 0.97 }}
                  href="/instructions" 
                  target="_blank" 
                  className="hidden md:flex items-center gap-2 text-slate-300 hover:text-purple-400 hover:bg-purple-500/10 transition-all px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                  <FileText size={15} /> Инструкция (спор)
              </motion.a>
              
              <div className="h-5 w-px bg-slate-800/80 hidden md:block mx-1"></div>
              
              <motion.button 
                whileHover={{ scale: 1.04 }} 
                whileTap={{ scale: 0.96 }} 
                onClick={handleReportExport} 
                className="flex items-center gap-2 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(79,70,229,0.25)] transition-all cursor-pointer"
              >
                  <FileText size={15} /> Скачать Рапорт
              </motion.button>
          </div>
      </div>
      )}

      {/* Dashboards */}
      <div id="tour-dashboards" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Dashboard 1: Compensation */}
          <motion.button 
              whileHover={{ y: -5, scale: 1.01 }} 
              whileTap={{ scale: 0.99 }}
              onClick={() => handleExport('comp')} 
              className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 text-left w-full transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full group cursor-pointer hover:border-emerald-500/40 hover:bg-slate-900/50 hover:shadow-[0_0_30px_rgba(52,211,153,0.08)]"
          >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/30 via-emerald-500/10 to-transparent" />
              <div className="w-full">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-xl group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all shadow-inner">
                          <Scale size={24} />
                      </div>
                      <h3 className="text-slate-400 font-medium text-base">
                          Положено компенсации
                      </h3>
                  </div>
                  <div className="text-3xl lg:text-4xl font-extrabold text-emerald-400 mb-2 drop-shadow-[0_0_15px_rgba(52,211,153,0.15)]">{formatCurrency(totalComp)}</div>
              </div>
              {!isTwa && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 text-emerald-500/80 text-sm font-semibold flex items-center gap-2 group-hover:text-emerald-400 transition-colors w-full">
                      <Download size={16} /> Скачать справку
                  </div>
              )}
          </motion.button>

          {/* Dashboard 2: Deduction */}
          <motion.button 
              whileHover={{ y: -5, scale: 1.01 }} 
              whileTap={{ scale: 0.99 }}
              onClick={() => handleExport('ded')} 
              className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 text-left w-full transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full group cursor-pointer hover:border-rose-500/40 hover:bg-slate-900/50 hover:shadow-[0_0_30px_rgba(251,113,133,0.08)]"
          >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-500/30 via-rose-500/10 to-transparent" />
              <div className="w-full">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="bg-rose-500/10 text-rose-400 p-2.5 rounded-xl group-hover:scale-110 group-hover:bg-rose-500/20 transition-all shadow-inner">
                          <Scale size={24} />
                      </div>
                      <h3 className="text-slate-400 font-medium text-base">
                          Подлежит удержанию
                      </h3>
                  </div>
                  <div className="text-3xl lg:text-4xl font-extrabold text-rose-400 mb-2 drop-shadow-[0_0_15px_rgba(251,113,133,0.15)]">{formatCurrency(totalDed)}</div>
              </div>
              {!isTwa && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 text-rose-500/80 text-sm font-semibold flex items-center gap-2 group-hover:text-rose-400 transition-colors w-full">
                      <Download size={16} /> Скачать справку
                  </div>
              )}
          </motion.button>

          {/* Dashboard 3: Net Balance */}
          <motion.button 
              whileHover={{ y: -5, scale: 1.01 }} 
              whileTap={{ scale: 0.99 }}
              onClick={() => handleExport('b2c-comp')} 
              className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 text-left w-full transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full group cursor-pointer hover:border-purple-500/40 hover:bg-slate-900/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.08)]"
          >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500/30 via-indigo-500/20 to-transparent" />
              <div className="w-full">
                  <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                          <div className="bg-purple-500/10 text-purple-400 p-2.5 rounded-xl group-hover:scale-110 group-hover:bg-purple-500/20 transition-all shadow-inner">
                              <Scale size={24} />
                          </div>
                          <h3 className="text-slate-400 font-medium text-base">
                              Итоговый баланс
                          </h3>
                      </div>
                      {isPositive ? (
                          <span className="text-[9px] font-extrabold bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md border border-emerald-500/20 tracking-wider uppercase select-none">К выплате</span>
                      ) : (
                          <span className="text-[9px] font-extrabold bg-rose-500/10 text-rose-400 px-2 py-1 rounded-md border border-rose-500/20 tracking-wider uppercase select-none">К удержанию</span>
                      )}
                  </div>
                  <div className={`text-3xl lg:text-4xl font-extrabold mb-2 drop-shadow-sm`}>
                      {isPositive ? (
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.15)]">
                              {formatCurrency(Math.abs(finalBalance))}
                          </span>
                      ) : (
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                              {formatCurrency(Math.abs(finalBalance))}
                          </span>
                      )}
                  </div>
              </div>
              {!isTwa && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 text-purple-400/80 text-sm font-semibold flex items-center gap-2 group-hover:text-purple-400 transition-colors w-full">
                      <FileText size={16} /> Скачать обоснование
                  </div>
              )}
          </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24">
        <div className="lg:col-span-4 space-y-6">
            
            {/* Параметры учреждения */}
            <div id="tour-inst-data" className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-5 shadow-xl shadow-black/20 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/30 to-transparent" />
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsInstOpen(!isInstOpen)}>
                    <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        <div className="w-1.5 h-5 bg-amber-500 rounded-full"></div>
                        Параметры учреждения
                        {isInstOpen ? <ChevronUp size={18} className="text-slate-400 ml-2" /> : <ChevronDown size={18} className="text-slate-400 ml-2" />}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); toggleInstLock(); }} className={`p-2 rounded-lg transition-colors cursor-pointer ${isInstLocked ? 'bg-amber-500/20 text-amber-500' : 'text-slate-400 hover:text-amber-500'}`} title="Сохранить">
                            {isInstLocked ? <Lock size={16} /> : <Unlock size={16} />}
                        </button>
                    </div>
                </div>
                
                <AnimatePresence>
                    {isInstOpen && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-4 mt-5">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Учреждение</label>
                                    <input type="text" className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-xl p-3 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all" value={instData.institution} onChange={e => updateInstData('institution', e.target.value)} placeholder="ФКУ ИК-6" />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Регион / Управление</label>
                                    <input type="text" className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-xl p-3 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all" value={instData.region} onChange={e => updateInstData('region', e.target.value)} placeholder="ГУФСИН России по СО" />
                                </div>

                                <div className="pt-4 mt-4 border-t border-slate-800/80">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-teal-400 text-xs font-semibold mb-2">Руководитель</h3>
                                            <div className="grid grid-cols-2 gap-2 mb-2">
                                                <input type="text" className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all" value={instData.bossTitle} onChange={e => updateInstData('bossTitle', e.target.value)} placeholder="Должность" />
                                                <input type="text" className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all" value={instData.bossRank} onChange={e => updateInstData('bossRank', e.target.value)} placeholder="Звание" />
                                            </div>
                                            <input type="text" className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all" value={instData.bossName} onChange={e => updateInstData('bossName', e.target.value)} placeholder="Инициалы, фамилия (А.А. Иванов)" />
                                        </div>

                                        <div className="pt-3 border-t border-slate-800/80">
                                            <h3 className="text-teal-400 text-xs font-semibold mb-2">Начальник ОКБИ и ХО</h3>
                                            <div className="grid grid-cols-2 gap-2 mb-2">
                                                <input type="text" className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all" value={instData.okbiTitle} onChange={e => updateInstData('okbiTitle', e.target.value)} placeholder="Должность" />
                                                <input type="text" className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all" value={instData.okbiRank} onChange={e => updateInstData('okbiRank', e.target.value)} placeholder="Звание" />
                                            </div>
                                            <input type="text" className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all" value={instData.okbiName} onChange={e => updateInstData('okbiName', e.target.value)} placeholder="Инициалы, фамилия (Б.Б. Петров)" />
                                        </div>

                                        <div className="pt-3 border-t border-slate-800/80">
                                            <h3 className="text-teal-400 text-xs font-semibold mb-2">Бухгалтерия</h3>
                                            <div className="grid grid-cols-2 gap-2 mb-2">
                                                <input type="text" className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all" value={instData.accTitle} onChange={e => updateInstData('accTitle', e.target.value)} placeholder="Должность" />
                                                <input type="text" className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all" value={instData.accRank} onChange={e => updateInstData('accRank', e.target.value)} placeholder="Звание" />
                                            </div>
                                            <input type="text" className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all" value={instData.accName} onChange={e => updateInstData('accName', e.target.value)} placeholder="Инициалы, фамилия (В.В. Сидорова)" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Employee Details Card */}
            <div id="tour-employee-details" className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-5 shadow-xl shadow-black/20 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/30 to-transparent" />
              <h2 className="text-lg font-bold text-slate-100 mb-5 flex items-center gap-2">
                <div className="w-1.5 h-5 bg-blue-500 rounded-full"></div>
                Данные сотрудника
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">ФИО сотрудника</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-xl p-3 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all"
                    placeholder="Иванов Иван Иванович"
                    value={employeeFio}
                    onChange={(e) => setEmployeeFio(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Звание</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-xl p-3 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all"
                    placeholder="прапорщик вн. сл."
                    value={employeeRank}
                    onChange={(e) => setEmployeeRank(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Основание увольнения</label>
                  <select
                      className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-xl p-3 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all text-xs font-semibold"
                      value={dismissalGroup}
                      onChange={(e) => setDismissalGroup(e.target.value)}
                  >
                      <option value="A" className="bg-slate-900 text-slate-200">Положительные (Пенсия, ОШМ)</option>
                      <option value="B" className="bg-slate-900 text-slate-200">Отрицательные (Нарушение, суд)</option>
                      <option value="V" className="bg-slate-900 text-slate-200">Нейтральные (Собственное желание)</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div id="tour-gender" className="w-full col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">Пол</label>
                    <div className="flex p-1 bg-slate-950/45 backdrop-blur-md rounded-xl border border-slate-800/80">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleGenderChange('M')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${gender === 'M' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                          Муж
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleGenderChange('F')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${gender === 'F' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                          Жен
                        </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Periods Card */}
            <div id="tour-periods" className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-5 shadow-xl shadow-black/20 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500/30 to-transparent" />
              <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <div className="w-1.5 h-5 bg-indigo-500 rounded-full"></div>
                  Периоды службы
                  </h2>
              </div>
              
              <div className="space-y-4">
                  <AnimatePresence>
                  {periods.map((period, index) => (
                      <motion.div 
                          key={period.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-4 bg-slate-950/35 backdrop-blur-md rounded-2xl border border-slate-800/60 space-y-3 relative group shadow-lg shadow-black/20"
                      >
                          <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-400">
                                  Период службы ({activeNorms.find(n => n.id === period.norm)?.name?.match(/\((.*?)\)/)?.[1] || `№${index + 1}`})
                              </span>
                              {periods.length > 1 && (
                                  <button onClick={() => removePeriod(period.id)} className="text-rose-400 hover:text-rose-500 p-1 cursor-pointer animate-none">
                                      <Trash2 size={16} />
                                  </button>
                              )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                              <div>
                                  <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Начало</label>
                                  <input 
                                      type="date" 
                                      className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all"
                                      value={period.start}
                                      onChange={(e) => updatePeriod(period.id, 'start', e.target.value)}
                                  />
                              </div>
                              <div>
                                  <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Конец</label>
                                  <input 
                                      type="date" 
                                      className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all"
                                      value={period.end}
                                      onChange={(e) => updatePeriod(period.id, 'end', e.target.value)}
                                  />
                              </div>
                          </div>

                          <div>
                              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Норма</label>
                              <select 
                                  className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all text-xs"
                                  value={period.norm}
                                  onChange={(e) => updatePeriod(period.id, 'norm', parseInt(e.target.value))}
                              >
                                  {activeNorms.map(n => <option key={n.id} value={n.id} className="bg-slate-900 text-slate-200">{n.name}</option>)}
                              </select>
                          </div>
                      </motion.div>
                  ))}
                  </AnimatePresence>
                  
                  <div className="text-right text-xs text-indigo-400 mt-2 font-bold tracking-wide">
                      Выслуга: {formatServiceTime(totalServiceMonths)}
                  </div>

                  <motion.button 
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={addPeriod}
                      className="w-full py-3.5 border border-dashed border-blue-500/40 hover:border-blue-400 rounded-xl text-blue-400 hover:text-white hover:bg-blue-600/10 transition-all flex items-center justify-center gap-2 text-xs font-bold mt-2 cursor-pointer animate-none"
                  >
                      <Plus size={14} />
                      Добавить период
                  </motion.button>
              </div>
            </div>
        </div>
        
        <div className="lg:col-span-8 space-y-8">
            <div id="tour-issue-log" className="bg-slate-900/40 backdrop-blur-xl rounded-[1.75rem] border border-slate-800/80 p-6 shadow-xl shadow-black/25 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500/30 via-teal-500/10 to-transparent" />
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <div className="w-2 h-6 bg-teal-500 rounded-full"></div>
                    Журнал выдачи со склада
                </h2>
                <IssueLogTable 
                    groupedItems={groupedItems} 
                    itemTotals={itemTotals} 
                    setItemTotals={setItemTotals} 
                    customPrices={customPrices} 
                    setCustomPrices={setCustomPrices} 
                    results={results} 
                    dismissalGroup={dismissalGroup} 
                    isPro={isPro}
                    setIsProModalOpen={setIsProModalOpen}
                    periodCount={periods.length}
                />
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl rounded-[1.75rem] border border-slate-800/80 p-6 shadow-xl shadow-black/25 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500/30 via-purple-500/10 to-transparent" />
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                    Итоговый расчет по предметам
                </h2>
                <ResultsTable 
                    results={results} 
                    isUnlocked={isUnlocked}
                    onUnlock={handleUnlockSingleCalculation}
                    onUnlockPro={handleUnlockPro}
                    isLoadingUnlock={isLoadingUnlock}
                    dismissalGroup={dismissalGroup}
                />
            </div>
        </div>
      </div>

      {/* Archive Modal */}
      <AnimatePresence>
          {isArchiveOpen && (
              <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
              >
                  <motion.div 
                      initial={{ scale: 0.9, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.9, opacity: 0, y: 20 }}
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                      className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
                  >
                      <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-800/50">
                          <h2 className="text-xl font-bold text-white flex items-center gap-2">
                              <Archive className="text-indigo-400" size={24} />
                              Архив расчетов
                          </h2>
                          <button onClick={() => setIsArchiveOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                              <X size={24} />
                          </button>
                      </div>
                      <div className="p-5 overflow-y-auto flex-1">
                          {archive.length === 0 ? (
                              <div className="text-center py-10 text-slate-500">
                                  <Archive className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                  Архив пуст. Сохраните первый расчет!
                              </div>
                          ) : (
                              <div className="space-y-3">
                                  <AnimatePresence>
                                      {archive.map(record => (
                                          <motion.div 
                                              key={record.id} 
                                              initial={{ opacity: 0, x: -20 }}
                                              animate={{ opacity: 1, x: 0 }}
                                              exit={{ opacity: 0, x: 20, scale: 0.9 }}
                                              className="flex justify-between items-center p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-colors cursor-pointer group" 
                                              onClick={() => loadFromArchive(record)}
                                          >
                                              <div>
                                                  <div className="font-bold text-slate-200 text-lg group-hover:text-indigo-400 transition-colors">{record.employee_fio}</div>
                                                  <div className="text-sm text-slate-400">{record.employee_rank || 'Звание не указано'} • Уволен: {record.dism_date || 'Дата не указана'}</div>
                                              </div>
                                              <div className="flex items-center gap-4">
                                                  <div className="text-xs text-slate-500 text-right hidden sm:block">
                                                      Сохранен:<br/>{new Date(record.created_at).toLocaleDateString()}
                                                  </div>
                                                  <button onClick={(e) => removeFromArchive(e, record.id)} className="p-2 text-slate-500 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors">
                                                      <Trash2 size={18} />
                                                  </button>
                                              </div>
                                          </motion.div>
                                      ))}
                                  </AnimatePresence>
                              </div>
                          )}
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

      <ProModal 
        isOpen={isProModalOpen} 
        onClose={() => setIsProModalOpen(false)} 
        title={proModalTitle} 
      />

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--background)]/80 backdrop-blur-lg border-t border-[var(--tw-hint)]/20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-40">
          <div className="max-w-5xl mx-auto flex gap-3">
              {isTwa ? (
                  <motion.button 
                    type="button"
                    whileTap={{ scale: 0.95 }} 
                    onClick={sendToTelegramBot} 
                    className="flex-1 flex justify-center items-center gap-2 bg-[var(--tw-button-bg)] text-[var(--tw-button-text)] p-3.5 rounded-xl font-bold transition-all shadow-lg"
                  >
                      Отправить расчет боту
                  </motion.button>
              ) : (
                  <>
                      <motion.button 
                        type="button"
                        whileTap={{ scale: 0.95 }} 
                        onClick={() => setIsArchiveOpen(true)} 
                        className="flex-[0.3] flex justify-center items-center bg-[var(--tw-bg-base)] text-[var(--foreground)] p-3.5 rounded-xl font-medium transition-all shadow-sm border border-[var(--tw-hint)]/20"
                      >
                          <Archive size={20} />
                      </motion.button>
                      <motion.button 
                        type="button"
                        whileTap={{ scale: 0.95 }} 
                        onClick={saveToArchive} 
                        className="flex-1 flex justify-center items-center gap-2 bg-[var(--tw-button-bg)] text-[var(--tw-button-text)] p-3.5 rounded-xl font-bold transition-all shadow-lg"
                      >
                          <Save size={18} /> Сохранить в облако
                      </motion.button>
                  </>
              )}
          </div>
      </div>
    </div>
  );
}

