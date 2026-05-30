// @ts-nocheck
"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, LogOut, User, Download, Plus, Trash2, HelpCircle, Archive, Crown, ChevronDown, ChevronUp, Lock, Unlock, FileText, X, Scale, ArrowRight, Check, Calculator as CalculatorIcon } from 'lucide-react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import IssueLogTable from './IssueLogTable';
import ResultsTable from './ResultsTable';
import ProModal from './ProModal';
import PaywallModal from './PaywallModal';
import TelegramLinkButton from './TelegramLinkButton';
import { useCalculatorResults } from '../lib/useCalculatorResults';
import { formatCurrency, getRoundedMonths } from '../lib/helpers';
import { exportToExcel } from '../lib/exportHelpers';
import { generateWordReport } from '../lib/reportGenerator';
import { parseDate } from '../lib/constants';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';

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
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [proModalTitle, setProModalTitle] = useState('');
  const [isTwa, setIsTwa] = useState(false);
  const [isLoadingUnlock, setIsLoadingUnlock] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const [copied, setCopied] = useState(false);
  const [showJustPaidModal, setShowJustPaidModal] = useState(false);
  const [justPaidPlanType, setJustPaidPlanType] = useState<'monthly' | 'half-year' | null>(null);

  const searchParams = useSearchParams();
  const { user, subscription, signOut, isLoading, fetchSubscription } = useAuth();
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ref = searchParams.get('ref');
      if (ref) {
        localStorage.setItem('fsin_ref_code', ref);
      }
      
      const buyPro = searchParams.get('buy_pro') === 'true';
      if (buyPro) {
        setIsPaywallOpen(true);
      }
      
      if (searchParams.get('just_paid') === 'true') {
        const plan = searchParams.get('planType') as 'monthly' | 'half-year';
        setJustPaidPlanType(plan);
        setShowJustPaidModal(true);
      }
      
      if (ref || searchParams.get('just_paid') === 'true' || buyPro) {
        // Clean up search params gracefully without full reload
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [searchParams]);

  const getReferralLink = () => {
    if (typeof window === 'undefined') return '';
    const code = subscription?.referral_code || '';
    return `${window.location.origin}/auth?ref=${code}`;
  };

  const handleCopyReferralLink = () => {
    const link = getReferralLink();
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      setIsLocked(true);
  };

  const startNewCalculation = () => {
      setEmployeeFio('');
      setEmployeeRank('');
      setDismissalGroup('V');
      setGender('M');
      setPeriods([{ id: Math.random(), start: '', end: '', norm: 2 }]);
      setItemTotals({});
      setCustomPrices({});
      setIsLocked(false);
      if (typeof window !== 'undefined') {
          localStorage.removeItem('fsin_calc_draft');
      }
  };

  const handlePerformCalculation = async () => {
      if (!employeeFio.trim()) {
          alert("Пожалуйста, заполните ФИО сотрудника перед выполнением расчета!");
          return;
      }
      
      setIsLocked(true);
      
      if (user) {
          const existing = archive.find(r => r.employee_fio.trim().toLowerCase() === employeeFio.trim().toLowerCase());
          
          if (!isPro && archive.length >= 1 && !existing) {
              setProModalTitle('Безлимитный архив доступен в PRO');
              setIsProModalOpen(true);
              setIsLocked(false);
              return;
          }

          const record = {
              user_id: user.id,
              employee_fio: employeeFio.trim(),
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
              console.error("Ошибка автосохранения", res.error);
              alert("Ошибка автосохранения в облако. Но расчет выполнен!");
          } else {
              fetchArchive();
          }
          
          if (isPro) {
              await incrementCalculationsCount();
          }
      }
      
      setTimeout(() => {
          const resultsEl = document.getElementById('results-section');
          if (resultsEl) {
              resultsEl.scrollIntoView({ behavior: 'smooth' });
          }
      }, 100);
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

  const handleUnlockPro = async (planType: 'monthly' | 'half-year' = 'monthly') => {
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
              body: JSON.stringify({ planType })
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

  const incrementCalculationsCount = async () => {
      if (!user || !isPro) return;
      
      // Генерируем уникальный ключ для текущего расчета (ФИО + Дата + Группа)
      const hash = `${(employeeFio || 'unnamed').trim().toLowerCase()}_${dismDate || 'nodate'}_${dismissalGroup || 'V'}`;
      
      try {
          const { data, error } = await supabase.rpc('log_pro_calculation', {
              user_id_param: user.id,
              employee_hash_param: hash
          });
          if (error) {
              console.error("Ошибка логирования расчета в Supabase:", error);
          } else if (data === true) {
              console.log("Успешно залогирован новый уникальный расчет. Лимит списан.");
              // Обновляем данные подписки
              fetchSubscription(user.id);
          }
      } catch (e) {
          console.error("Ошибка вызова log_pro_calculation:", e);
      }
  };

  const handleExport = async (type: 'comp' | 'ded' | 'b2c-comp') => {
      if (!isUnlocked) {
          setIsPaywallOpen(true);
          return;
      }
      
      // Запускаем инкремент счетчика уникальных расчетов для PRO
      await incrementCalculationsCount();

      exportToExcel(type, {
          results,
          instData,
          employeeFio,
          employeeRank,
          dismissalDate: dismDate
      });
  };

  const handleReportExport = async () => {
      if (!isUnlocked) {
          setIsPaywallOpen(true);
          return;
      }

      // Запускаем инкремент счетчика уникальных расчетов для PRO
      await incrementCalculationsCount();

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
      {isLocked ? (
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
      ) : (
          <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 text-center shadow-xl shadow-black/25 relative overflow-hidden group mb-8"
          >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/25 to-transparent" />
              <div className="max-w-md mx-auto py-8 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 animate-pulse">
                      <CalculatorIcon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Расчет ожидается</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                      Заполните параметры сотрудника, укажите периоды выслуги и журнал выдачи. Затем нажмите кнопку **«Выполнить расчет»** для получения детального отчета и скачивания документов.
                  </p>
              </div>
          </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24">
        <div className="lg:col-span-4 space-y-6">
            
            {/* Статус подписки PRO */}
            <div className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-5 shadow-xl shadow-black/20 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/35 via-amber-500/10 to-transparent" />
                
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-4">
                    <Crown className={isPro ? "text-amber-400 animate-pulse" : "text-slate-500"} size={18} />
                    Статус подписки
                </h2>
                
                {!user ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Режим:</span>
                            <span className="text-slate-400 font-bold uppercase tracking-wider bg-slate-850 border border-slate-800 px-2 py-0.5 rounded-md text-[10px]">Гостевой (Бесплатный)</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                            Авторизуйтесь, чтобы включить облачный архив, скачивать рапорты в 1 клик и убрать ограничения.
                        </p>
                        <button 
                            onClick={() => router.push('/auth')}
                            className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-black rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all text-center"
                        >
                            Войти в систему
                        </button>
                    </div>
                ) : isPro ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Режим:</span>
                            <span className="text-amber-400 font-extrabold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md text-[10px]">PRO Активен</span>
                        </div>
                        
                        {subscription?.pro_until && (
                            <div className="space-y-1 pt-2 border-t border-slate-800/50">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Осталось времени:</span>
                                    <span className="text-slate-200 font-bold">
                                        {Math.max(0, Math.ceil((new Date(subscription.pro_until).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} дн.
                                    </span>
                                </div>
                                <div className="text-[10px] text-slate-500">
                                    Действует до: {new Date(subscription.pro_until).toLocaleDateString()}
                                </div>
                            </div>
                        )}
                        
                        {subscription?.guaranteed_calculations !== undefined && subscription.guaranteed_calculations > 0 && (
                            <div className="space-y-1 pt-2 border-t border-slate-800/50">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Уникальные расчеты:</span>
                                    <span className="text-emerald-400 font-black">
                                        {Math.max(0, subscription.guaranteed_calculations - (subscription.pro_calculations_made || 0))} из {subscription.guaranteed_calculations}
                                    </span>
                                </div>
                                <div className="text-[10px] text-slate-500 leading-normal">
                                    Квота гарантированных расчетов. PRO не сгорит, пока не израсходован этот остаток!
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Режим:</span>
                            <span className="text-slate-400 font-bold uppercase tracking-wider bg-slate-850 border border-slate-800 px-2 py-0.5 rounded-md text-[10px]">Базовый (Бесплатный)</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                            Скачивание Word-рапортов и Excel-справок заблокировано.
                         </p>
                         <button 
                             onClick={() => setIsPaywallOpen(true)}
                             className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-450 hover:to-yellow-450 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all text-center"
                         >
                             Активировать PRO 👑
                         </button>
                     </div>
                )}

                {/* Integrated Referral Accordion */}
                <div className="mt-4 pt-4 border-t border-slate-800/60">
                    <button 
                        type="button"
                        onClick={() => setIsReferralOpen(!isReferralOpen)}
                        className="w-full flex justify-between items-center text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
                            👥 Продлить PRO бесплатно
                        </span>
                        {isReferralOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    
                    <AnimatePresence>
                        {isReferralOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                className="overflow-hidden space-y-3"
                            >
                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                    {isPro 
                                      ? 'Порекомендуйте калькулятор сослуживцам! За каждого друга вы получите до 3 месяцев безлимитного PRO бесплатно, а ваш друг — скидку до 1000 ₽!' 
                                      : 'Позовите коллегу на службу! Друг получит скидку до 1000 ₽ на PRO подписку, а вы — 1 месяц безлимитного PRO бесплатно, когда он сделает любую оплату подписки!'
                                    }
                                </p>
                                
                                {!user ? (
                                  <button 
                                    onClick={() => router.push('/auth')} 
                                    className="w-full py-2.5 bg-indigo-650/20 hover:bg-indigo-655/35 border border-indigo-500/25 hover:border-indigo-400 text-indigo-300 font-bold rounded-xl text-xs transition-all cursor-pointer text-center"
                                  >
                                    Войти, чтобы пригласить друзей
                                  </button>
                                ) : (
                                  <div className="space-y-3 pt-1">
                                    <div>
                                      <span className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Ваша реферальная ссылка:</span>
                                      <div className="flex gap-2">
                                        <input 
                                          type="text" 
                                          readOnly 
                                          value={getReferralLink()} 
                                          className="flex-1 bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-lg p-2 text-xs text-slate-300 outline-none select-all"
                                        />
                                        <button 
                                          onClick={handleCopyReferralLink}
                                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center justify-center min-w-[80px]"
                                        >
                                          {copied ? 'Скопировано!' : 'Копировать'}
                                        </button>
                                      </div>
                                    </div>
                                    
                                    {subscription?.referral_code && (
                                      <div className="pt-2.5 border-t border-slate-850 flex justify-between items-center text-xs">
                                        <div className="text-slate-400">
                                          Друзей пришло: <strong className="text-slate-200 font-bold">{subscription.referred_friends_count || 0}</strong>
                                        </div>
                                        <div className="text-emerald-400 font-bold">
                                          Бонус: +{subscription.referred_friends_count || 0} мес. PRO
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

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
                    className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-xl p-3 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Иванов Иван Иванович"
                    value={employeeFio}
                    onChange={(e) => setEmployeeFio(e.target.value)}
                    disabled={isLocked}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Звание</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-xl p-3 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="прапорщик вн. сл."
                    value={employeeRank}
                    onChange={(e) => setEmployeeRank(e.target.value)}
                    disabled={isLocked}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Основание увольнения</label>
                  <select
                      className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-xl p-3 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      value={dismissalGroup}
                      onChange={(e) => setDismissalGroup(e.target.value)}
                      disabled={isLocked}
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
                          whileHover={isLocked ? {} : { scale: 1.02 }}
                          whileTap={isLocked ? {} : { scale: 0.98 }}
                          onClick={() => !isLocked && handleGenderChange('M')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'} ${gender === 'M' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 'text-slate-400 hover:text-slate-200'} ${isLocked && gender !== 'M' ? 'opacity-30' : ''}`}
                        >
                          Муж
                        </motion.button>
                        <motion.button 
                          whileHover={isLocked ? {} : { scale: 1.02 }}
                          whileTap={isLocked ? {} : { scale: 0.98 }}
                          onClick={() => !isLocked && handleGenderChange('F')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'} ${gender === 'F' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 'text-slate-400 hover:text-slate-200'} ${isLocked && gender !== 'F' ? 'opacity-30' : ''}`}
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
                  <div className="w-1.5 h-5 bg-indigo-50 rounded-full"></div>
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
                              {periods.length > 1 && !isLocked && (
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
                                      className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                      value={period.start}
                                      onChange={(e) => updatePeriod(period.id, 'start', e.target.value)}
                                      disabled={isLocked}
                                  />
                              </div>
                              <div>
                                  <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Конец</label>
                                  <input 
                                      type="date" 
                                      className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                      value={period.end}
                                      onChange={(e) => updatePeriod(period.id, 'end', e.target.value)}
                                      disabled={isLocked}
                                  />
                              </div>
                          </div>

                          <div>
                              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Норма</label>
                              <select 
                                  className="w-full bg-slate-950/45 backdrop-blur-md border border-slate-800/80 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                  value={period.norm}
                                  onChange={(e) => updatePeriod(period.id, 'norm', parseInt(e.target.value))}
                                  disabled={isLocked}
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

                  {!isLocked && (
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
                  )}
              </div>
            </div>

            {/* Cloud Archive Card */}
            <div className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-5 shadow-xl shadow-black/20 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500/30 to-transparent" />
                
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        <Archive className="text-indigo-400" size={18} />
                        Архив расчетов
                        {user && archive.length > 0 && (
                            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/25 px-2 py-0.5 rounded-full font-black">
                                {archive.length}
                            </span>
                        )}
                    </h2>
                </div>

                {/* Permanent "+ Новый расчет" Button */}
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startNewCalculation}
                    className="w-full py-3 mb-4 bg-gradient-to-r from-blue-600/15 via-indigo-600/10 to-purple-600/15 hover:from-blue-600/25 hover:to-purple-600/25 border border-blue-500/25 hover:border-blue-400 text-blue-400 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                    <Plus size={14} />
                    Новый расчет
                </motion.button>

                {!user ? (
                    <div className="p-4 bg-slate-950/45 border border-slate-850 rounded-2xl text-center space-y-3 shadow-inner">
                        <Lock className="w-8 h-8 text-slate-500 mx-auto opacity-60" />
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                            Авторизуйтесь, чтобы включить облачный архив расчетов и сохранять свои справки в 1 клик.
                        </p>
                        <button 
                            onClick={() => router.push('/auth')} 
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition-all cursor-pointer"
                        >
                            Войти в систему
                        </button>
                    </div>
                ) : archive.length === 0 ? (
                    <div className="p-4 bg-slate-950/20 border border-dashed border-slate-800 rounded-2xl text-center text-[11px] text-slate-500 py-6">
                        Архив пуст. Сделайте свой первый расчет!
                    </div>
                ) : (
                    <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                        {archive.map(record => {
                            const isActive = isLocked && employeeFio.trim().toLowerCase() === record.employee_fio.trim().toLowerCase();
                            return (
                                <div 
                                    key={record.id} 
                                    onClick={() => loadFromArchive(record)}
                                    className={`flex justify-between items-center p-3 rounded-xl transition-all cursor-pointer group text-left relative overflow-hidden ${
                                        isActive 
                                            ? 'bg-indigo-650/15 border border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.12)]' 
                                            : 'bg-slate-950/45 hover:bg-slate-950/70 border border-slate-850 hover:border-slate-750'
                                    }`}
                                >
                                    {isActive && (
                                        <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-indigo-50" />
                                    )}
                                    <div className="flex-1 min-w-0 pr-2">
                                        <div className={`font-bold text-xs truncate ${isActive ? 'text-indigo-300' : 'text-slate-200 group-hover:text-indigo-400 transition-colors'}`}>
                                            {record.employee_fio}
                                        </div>
                                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                            {record.employee_rank || 'Звание не указано'} • {record.dism_date ? new Date(record.dism_date).toLocaleDateString() : 'Нейтральный'}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => removeFromArchive(e, record.id)} 
                                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all shrink-0 cursor-pointer animate-none"
                                        title="Удалить"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
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
                    isLocked={isLocked}
                />
                
                {isLocked ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-950/65 backdrop-blur-md border border-slate-800/85 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6"
                    >
                        <div className="flex items-center gap-3 text-left">
                            <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/25 rounded-xl flex items-center justify-center text-indigo-400 shrink-0">
                                <Lock size={18} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">🔒 Расчет выполнен и зафиксирован</h4>
                                <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                                    Изменения заблокированы во избежание ошибок. Для нового сотрудника нажмите **«Новый расчет»** в боковой панели.
                                </p>
                            </div>
                        </div>
                        {!user && (
                            <span className="text-[10px] font-black bg-rose-500/10 border border-rose-500/25 text-rose-400 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                                Локальный режим
                            </span>
                        )}
                    </motion.div>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePerformCalculation}
                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4.5 rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 border border-blue-500/30 text-base uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-3.5 group animate-pulse"
                    >
                        <span>{user ? "Выполнить расчет и сохранить в облако ⚡" : "Выполнить расчет ⚡"}</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                )}
            </div>

            {isLocked && (
                <div id="results-section" className="bg-slate-900/40 backdrop-blur-xl rounded-[1.75rem] border border-slate-800/80 p-6 shadow-xl shadow-black/25 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500/30 via-purple-500/10 to-transparent" />
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                        Итоговый расчет по предметам
                    </h2>
                    <ResultsTable 
                        results={results} 
                        isUnlocked={isUnlocked}
                        onUnlock={() => setIsPaywallOpen(true)}
                        onUnlockPro={handleUnlockPro}
                        isLoadingUnlock={isLoadingUnlock}
                        dismissalGroup={dismissalGroup}
                    />
                </div>
            )}
        </div>
      </div>



      <ProModal 
        isOpen={isProModalOpen} 
        onClose={() => setIsProModalOpen(false)} 
        title={proModalTitle} 
      />

      <PaywallModal 
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onUnlockSingle={handleUnlockSingleCalculation}
        onUnlockPro={handleUnlockPro}
        isLoadingUnlock={isLoadingUnlock}
        resultsCount={results.length}
        finalBalance={finalBalance}
      />

      <AnimatePresence>
        {showJustPaidModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-slate-900 border-2 border-amber-500/30 rounded-[2.5rem] w-full max-w-lg shadow-[0_20px_50px_rgba(245,158,11,0.25)] overflow-hidden relative z-10 p-6 md:p-8 text-center"
            >
              <div className="absolute top-5 right-5 z-20">
                <button 
                  onClick={() => setShowJustPaidModal(false)} 
                  className="text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 p-2 rounded-full transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Glowing lights */}
              <div className="absolute top-[-10%] left-[50%] translate-x-[-50%] w-64 h-64 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none" />

              <div className="w-16 h-16 bg-amber-500/15 text-amber-400 border border-amber-500/25 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-inner animate-bounce">
                <Crown size={32} />
              </div>

              <h2 className="text-2xl font-black text-white leading-tight">
                Вы теперь в команде PRO! 👑
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Поздравляем! Вам открыт полный безлимитный доступ ко всем расчетам, архивам и мгновенному скачиванию документов в Word и Excel.
              </p>

              <div className="my-6 p-4 bg-slate-950/45 border border-slate-800/80 rounded-2xl text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-500 to-purple-600 text-white text-[8px] font-black px-2.5 py-0.5 rounded-bl-xl uppercase tracking-wider">
                  Подарок
                </div>
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  🎁 Понравился калькулятор?
                </h4>
                <p className="text-[11px] text-slate-300 mt-2 font-medium leading-relaxed">
                  Порекомендуйте калькулятор сослуживцам!
                  За каждого приглашенного друга вы получите до **3 месяцев PRO бесплатно** в подарок, а ваш друг — скидку до **1000 ₽** на подписку!
                </p>
                <div className="mt-4 space-y-2">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">Ваша реферальная ссылка:</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={getReferralLink()} 
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none select-all"
                    />
                    <button 
                      onClick={handleCopyReferralLink}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 min-w-[90px] justify-center animate-none"
                    >
                      {copied ? <Check size={12} className="text-white mr-1" /> : null}
                      <span>{copied ? 'Скопировано' : 'Копировать'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowJustPaidModal(false)}
                className="w-full bg-gradient-to-tr from-amber-500 to-yellow-500 hover:from-amber-450 hover:to-yellow-450 text-slate-950 font-black py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all font-bold"
              >
                Отлично, к расчетам!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Bar (Only for Telegram Web App) */}
      {isTwa && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--background)]/85 backdrop-blur-lg border-t border-[var(--tw-hint)]/20 shadow-2xl z-40">
              <div className="max-w-5xl mx-auto flex gap-3">
                  <motion.button 
                    type="button"
                    whileTap={{ scale: 0.95 }} 
                    onClick={sendToTelegramBot} 
                    className="flex-1 flex justify-center items-center gap-2 bg-[var(--tw-button-bg)] text-[var(--tw-button-text)] p-3.5 rounded-xl font-bold transition-all shadow-lg cursor-pointer"
                  >
                      Отправить расчет боту
                  </motion.button>
              </div>
          </div>
      )}
    </div>
  );
}

