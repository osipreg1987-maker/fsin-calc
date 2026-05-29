// @ts-nocheck
"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, LogOut, User, Download, Plus, Trash2, HelpCircle, Archive, Crown, ChevronDown, ChevronUp, Lock, Unlock, FileText, X } from 'lucide-react';
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

  const { user, subscription, signOut, isLoading } = useAuth();
  const router = useRouter();

  const isPro = subscription?.is_pro || false;

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
              { element: '#tour-issue-log', popover: { title: 'Шаг 5: Арматурная карточка', description: 'Перенесите сюда данные из вашей арматурной карточки: просто выберите те вещи, которые вы ФАКТИЧЕСКИ получили на складе, и укажите год выдачи. Калькулятор сам рассчитает износ (недонос) и итоговую сумму компенсации за то, что вам недодали!' } },
              { element: '#tour-export', popover: { title: 'Шаг 6: Выгрузка справки', description: 'Когда закончите переносить имущество, нажмите сюда. Калькулятор мгновенно сгенерирует готовую справку-расчет в формате Excel, которую можно приложить к рапорту!' } }
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

  const handleExport = (type: 'comp' | 'ded' | 'b2c-comp') => {
      if (!isPro) {
          setProModalTitle('Экспорт в Excel доступен только в PRO');
          setIsProModalOpen(true);
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
      if (!isPro) {
          setProModalTitle('Экспорт рапорта доступен только в PRO');
          setIsProModalOpen(true);
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
          <div className="flex flex-col md:flex-row gap-3 flex-wrap ml-auto" id="tour-export">
              <button onClick={startTour} className="hidden md:flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors mr-2">
                  <HelpCircle size={18} /> <span className="text-sm font-medium">Обучение</span>
              </button>
              <a href="/instructions" target="_blank" className="hidden md:flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mr-4">
                  <FileText size={18} /> <span className="text-sm font-medium">Инструкция (спор)</span>
              </a>
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={handleReportExport} 
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]"
              >
                  <FileText size={18} /> Рапорт
              </motion.button>
          </div>
      </div>
      )}

      {/* Dashboards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div whileHover={{ y: -5 }} className="rounded-2xl overflow-hidden flex flex-col bg-gradient-to-br from-emerald-600 to-teal-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <button onClick={() => handleExport('comp')} className="p-5 text-left w-full hover:brightness-110 transition-all group flex-1">
                  <h3 className="text-emerald-50 font-medium mb-1 text-sm flex justify-between">
                      Положено компенсации
                      {!isTwa && <Download size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </h3>
                  <div className="text-2xl font-bold text-white">{formatCurrency(totalComp)}</div>
                  {!isTwa && (
                      <div className="mt-2 text-emerald-100 text-xs font-medium flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <Download size={14} /> Скачать справку
                      </div>
                  )}
              </button>
          </motion.div>

          <motion.button 
              whileHover={{ y: -5 }} 
              onClick={() => handleExport('ded')} 
              className="rounded-2xl p-5 text-left w-full bg-gradient-to-br from-rose-600 to-red-600 hover:brightness-110 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)] transition-all group flex flex-col justify-between"
          >
              <div>
                  <h3 className="text-rose-50 font-medium mb-1 text-sm flex justify-between">
                      Подлежит удержанию
                      {!isTwa && <Download size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </h3>
                  <div className="text-2xl font-bold text-white">{formatCurrency(totalDed)}</div>
              </div>
              {!isTwa && (
                  <div className="mt-2 text-rose-100 text-xs font-medium flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <Download size={14} /> Скачать справку
                  </div>
              )}
          </motion.button>

          <motion.button 
              whileHover={{ y: -5 }} 
              onClick={() => handleExport('b2c-comp')} 
              className="rounded-2xl p-5 text-left w-full bg-gradient-to-br from-purple-600 to-indigo-600 hover:brightness-110 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all group flex flex-col justify-between"
          >
              <div>
                  <h3 className="text-purple-50 font-medium mb-1 text-sm flex justify-between">
                      ИТОГОВЫЙ БАЛАНС
                      {!isTwa && <FileText size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </h3>
                  <div className="text-2xl font-bold text-white mb-1">{formatCurrency(Math.abs(finalBalance))}</div>
                  <div className="text-xs text-purple-100 opacity-90">
                      {isPositive ? 'К выплате сотруднику' : 'Взыскать в бюджет'}
                  </div>
              </div>
              {!isTwa && (
                  <div className="mt-2 text-purple-100 text-xs font-medium flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <FileText size={14} /> Скачать расширенное обоснование
                  </div>
              )}
          </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24">
        <div className="lg:col-span-4 space-y-6">
            
            {/* Параметры учреждения */}
            <div id="tour-inst-data" className="glass-panel rounded-2xl p-5">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsInstOpen(!isInstOpen)}>
                    <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                        <div className="w-1.5 h-5 bg-amber-500 rounded-full"></div>
                        Параметры учреждения
                        {isInstOpen ? <ChevronUp size={18} className="text-[var(--tw-hint)] ml-2" /> : <ChevronDown size={18} className="text-[var(--tw-hint)] ml-2" />}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); toggleInstLock(); }} className={`p-2 rounded-lg transition-colors ${isInstLocked ? 'bg-amber-500/20 text-amber-500' : 'text-[var(--tw-hint)] hover:text-amber-500'}`} title="Сохранить">
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
                                    <label className="block text-xs text-[var(--tw-hint)] mb-1">Учреждение</label>
                                    <input type="text" className="w-full bg-[var(--tw-bg-base)] border border-[var(--tw-hint)]/30 rounded-xl p-3 text-[var(--foreground)] outline-none" value={instData.institution} onChange={e => updateInstData('institution', e.target.value)} placeholder="ФКУ ИК-6" />
                                </div>
                                <div>
                                    <label className="block text-xs text-[var(--tw-hint)] mb-1">Регион / Управление</label>
                                    <input type="text" className="w-full bg-[var(--tw-bg-base)] border border-[var(--tw-hint)]/30 rounded-xl p-3 text-[var(--foreground)] outline-none" value={instData.region} onChange={e => updateInstData('region', e.target.value)} placeholder="ГУФСИН России по СО" />
                                </div>

                                <div className="pt-4 mt-4 border-t border-[var(--tw-hint)]/20">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-teal-500 text-xs font-semibold mb-2">Руководитель</h3>
                                            <div className="grid grid-cols-2 gap-2 mb-2">
                                                <input type="text" className="w-full bg-[var(--tw-bg-base)] border border-[var(--tw-hint)]/30 rounded-lg p-2.5 text-[var(--foreground)] text-sm outline-none" value={instData.bossTitle} onChange={e => updateInstData('bossTitle', e.target.value)} placeholder="Должность" />
                                                <input type="text" className="w-full bg-[var(--tw-bg-base)] border border-[var(--tw-hint)]/30 rounded-lg p-2.5 text-[var(--foreground)] text-sm outline-none" value={instData.bossRank} onChange={e => updateInstData('bossRank', e.target.value)} placeholder="Звание" />
                                            </div>
                                            <input type="text" className="w-full bg-[var(--tw-bg-base)] border border-[var(--tw-hint)]/30 rounded-lg p-2.5 text-[var(--foreground)] text-sm outline-none" value={instData.bossName} onChange={e => updateInstData('bossName', e.target.value)} placeholder="Инициалы, фамилия (А.А. Иванов)" />
                                        </div>

                                        <div className="pt-3 border-t border-[var(--tw-hint)]/20">
                                            <h3 className="text-teal-500 text-xs font-semibold mb-2">Начальник ОКБИ и ХО</h3>
                                            <div className="grid grid-cols-2 gap-2 mb-2">
                                                <input type="text" className="w-full bg-[var(--tw-bg-base)] border border-[var(--tw-hint)]/30 rounded-lg p-2.5 text-[var(--foreground)] text-sm outline-none" value={instData.okbiTitle} onChange={e => updateInstData('okbiTitle', e.target.value)} placeholder="Должность" />
                                                <input type="text" className="w-full bg-[var(--tw-bg-base)] border border-[var(--tw-hint)]/30 rounded-lg p-2.5 text-[var(--foreground)] text-sm outline-none" value={instData.okbiRank} onChange={e => updateInstData('okbiRank', e.target.value)} placeholder="Звание" />
                                            </div>
                                            <input type="text" className="w-full bg-[var(--tw-bg-base)] border border-[var(--tw-hint)]/30 rounded-lg p-2.5 text-[var(--foreground)] text-sm outline-none" value={instData.okbiName} onChange={e => updateInstData('okbiName', e.target.value)} placeholder="Инициалы, фамилия (Б.Б. Петров)" />
                                        </div>

                                        <div className="pt-3 border-t border-[var(--tw-hint)]/20">
                                            <h3 className="text-teal-500 text-xs font-semibold mb-2">Бухгалтерия</h3>
                                            <div className="grid grid-cols-2 gap-2 mb-2">
                                                <input type="text" className="w-full bg-[var(--tw-bg-base)] border border-[var(--tw-hint)]/30 rounded-lg p-2.5 text-[var(--foreground)] text-sm outline-none" value={instData.accTitle} onChange={e => updateInstData('accTitle', e.target.value)} placeholder="Должность" />
                                                <input type="text" className="w-full bg-[var(--tw-bg-base)] border border-[var(--tw-hint)]/30 rounded-lg p-2.5 text-[var(--foreground)] text-sm outline-none" value={instData.accRank} onChange={e => updateInstData('accRank', e.target.value)} placeholder="Звание" />
                                            </div>
                                            <input type="text" className="w-full bg-[var(--tw-bg-base)] border border-[var(--tw-hint)]/30 rounded-lg p-2.5 text-[var(--foreground)] text-sm outline-none" value={instData.accName} onChange={e => updateInstData('accName', e.target.value)} placeholder="Инициалы, фамилия (В.В. Сидорова)" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Employee Details Card */}
            <div id="tour-employee-details" className="glass-panel rounded-2xl p-5">
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-5 flex items-center gap-2">
                <div className="w-1.5 h-5 bg-blue-500 rounded-full"></div>
                Данные сотрудника
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[var(--tw-hint)] mb-1">ФИО сотрудника</label>
                  <input 
                    type="text" 
                    className="w-full bg-[var(--tw-bg-base)] border border-[var(--tw-hint)]/30 rounded-xl p-3 text-[var(--foreground)] outline-none focus:border-[var(--tw-link)] transition-all"
                    placeholder="Иванов Иван Иванович"
                    value={employeeFio}
                    onChange={(e) => setEmployeeFio(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--tw-hint)] mb-1">Звание</label>
                  <input 
                    type="text" 
                    className="w-full bg-[var(--tw-bg-base)] border border-[var(--tw-hint)]/30 rounded-xl p-3 text-[var(--foreground)] outline-none focus:border-[var(--tw-link)] transition-all"
                    placeholder="прапорщик вн. сл."
                    value={employeeRank}
                    onChange={(e) => setEmployeeRank(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--tw-hint)] mb-1">Основание увольнения</label>
                  <select
                      className="w-full bg-[var(--tw-bg-base)] border border-[var(--tw-hint)]/30 rounded-xl p-3 text-[var(--foreground)] outline-none focus:border-[var(--tw-link)] transition-all"
                      value={dismissalGroup}
                      onChange={(e) => setDismissalGroup(e.target.value)}
                  >
                      <option value="A">Положительные (Пенсия, ОШМ)</option>
                      <option value="B">Отрицательные (Нарушение, суд)</option>
                      <option value="V">Нейтральные (Собственное желание)</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div id="tour-gender">
                    <label className="block text-xs text-[var(--tw-hint)] mb-1">Пол</label>
                    <div className="flex p-1 bg-[var(--tw-bg-base)] rounded-xl border border-[var(--tw-hint)]/30">
                        <button 
                          onClick={() => handleGenderChange('M')}
                          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${gender === 'M' ? 'bg-[var(--tw-button-bg)] text-[var(--tw-button-text)] shadow-sm' : 'text-[var(--tw-hint)] hover:text-[var(--foreground)]'}`}
                        >
                          Муж
                        </button>
                        <button 
                          onClick={() => handleGenderChange('F')}
                          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${gender === 'F' ? 'bg-[var(--tw-button-bg)] text-[var(--tw-button-text)] shadow-sm' : 'text-[var(--tw-hint)] hover:text-[var(--foreground)]'}`}
                        >
                          Жен
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Periods Card */}
            <div id="tour-periods" className="glass-panel rounded-2xl p-5">
              <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
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
                          className="p-4 bg-[var(--tw-bg-base)] rounded-xl border border-[var(--tw-hint)]/20 space-y-3 relative group shadow-sm"
                      >
                          <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-[var(--tw-hint)]">
                                  Период службы ({activeNorms.find(n => n.id === period.norm)?.name?.match(/\((.*?)\)/)?.[1] || `№${index + 1}`})
                              </span>
                              {periods.length > 1 && (
                                  <button onClick={() => removePeriod(period.id)} className="text-rose-400 hover:text-rose-500 p-1">
                                      <Trash2 size={18} />
                                  </button>
                              )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                              <div>
                                  <label className="block text-[10px] uppercase font-bold text-[var(--tw-hint)] mb-1">Начало</label>
                                  <input 
                                      type="date" 
                                      className="w-full bg-transparent border border-[var(--tw-hint)]/30 rounded-lg p-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--tw-link)]"
                                      value={period.start}
                                      onChange={(e) => updatePeriod(period.id, 'start', e.target.value)}
                                  />
                              </div>
                              <div>
                                  <label className="block text-[10px] uppercase font-bold text-[var(--tw-hint)] mb-1">Конец</label>
                                  <input 
                                      type="date" 
                                      className="w-full bg-transparent border border-[var(--tw-hint)]/30 rounded-lg p-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--tw-link)]"
                                      value={period.end}
                                      onChange={(e) => updatePeriod(period.id, 'end', e.target.value)}
                                  />
                              </div>
                          </div>

                          <div>
                              <label className="block text-[10px] uppercase font-bold text-[var(--tw-hint)] mb-1">Норма</label>
                              <select 
                                  className="w-full bg-[var(--tw-bg-base)] border border-[var(--tw-hint)]/30 rounded-lg p-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--tw-link)]"
                                  value={period.norm}
                                  onChange={(e) => updatePeriod(period.id, 'norm', parseInt(e.target.value))}
                              >
                                  {activeNorms.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                              </select>
                          </div>
                      </motion.div>
                  ))}
                  </AnimatePresence>
                  
                  <div className="text-right text-sm text-[var(--tw-link)] mt-2 font-medium">
                      Выслуга: {formatServiceTime(totalServiceMonths)}
                  </div>

                  <button 
                      type="button"
                      onClick={addPeriod}
                      className="w-full py-3 border border-dashed border-[var(--tw-link)] rounded-xl text-[var(--tw-link)] hover:bg-[var(--tw-link)] hover:text-white transition-all flex items-center justify-center gap-2 text-sm font-medium mt-2"
                  >
                      <Plus size={16} />
                      Добавить период
                  </button>
              </div>
            </div>
        </div>
        
        <div className="lg:col-span-8 space-y-8">
            <div id="tour-issue-log" className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 glow-box">
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

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 glow-box">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                    Итоговый расчет по предметам
                </h2>
                <ResultsTable results={results} />
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

