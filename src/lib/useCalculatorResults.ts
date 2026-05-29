// @ts-nocheck
import { useMemo } from 'react';
import { ITEMS, SPLIT_DATE, parseDate } from './constants';
import { getRoundedMonths, getItemCategory } from './helpers';

export function useCalculatorResults({ periods, gender, itemTotals, customPrices, dismissalGroup, dismissalDate }) {
    
    // 1. Формируем список активных норм и предметов
    const { activeNorms, activeItemsList, groupedItems } = useMemo(() => {
        const norms = new Set(periods.map(p => p.norm));
        const items = ITEMS.filter(i =>
            (i.gender === 'both' || i.gender === gender) &&
            i.norms.some(n => norms.has(n))
        ).map(i => ({ ...i, category: getItemCategory(i.name) }));

        const groups = {};
        items.forEach(item => {
            const cat = item.category;
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(item);
        });

        return { activeNorms: norms, activeItemsList: items, groupedItems: groups };
    }, [periods, gender]);

    // 2. Основной расчет результатов
    const results = useMemo(() => {
        const res = [];
        if (!periods || periods.length === 0 || !periods[0] || !periods[0].start || !periods[0].end) return res;

        const processedPeriods = [];
        periods.forEach((p, index) => {
            if (!p.start || !p.end) return;
            const startD = parseDate(p.start);
            const endD = parseDate(p.end);
            
            if (!startD || isNaN(startD.getTime()) || !endD || isNaN(endD.getTime())) return;
            if (startD > endD) return;

            const pIndex = index + 1;

            if (endD < SPLIT_DATE) {
                processedPeriods.push({ ...p, type: '789', start: startD, end: endD, pIndex, isTail: false });
            } else if (startD >= SPLIT_DATE) {
                processedPeriods.push({ ...p, type: '150', start: startD, end: endD, pIndex, isTail: false });
            } else {
                processedPeriods.push({ ...p, type: '789', start: startD, end: new Date(SPLIT_DATE.getTime() - 86400000), pIndex, isTail: false });
                processedPeriods.push({ ...p, type: '150', start: SPLIT_DATE, end: endD, pIndex, isTail: true });
            }
        });

        activeItemsList.forEach(item => {
            if (item.gender !== 'both' && item.gender !== gender) return;

            // 1. Считаем Начислено (Компенсация за время службы)
            let earnedQty = 0;
            let earnedMoney = 0;
            const periodDetails = [];

            processedPeriods.forEach(pp => {
                if (!item.norms.includes(pp.norm)) return;

                const wearKey = pp.type === '789' ? 'wear_789' : 'wear_150';
                const specificWearKey = `${wearKey}_norm${pp.norm}`;
                let wearMonths = item[specificWearKey] || item[wearKey];

                if (!wearMonths) return;

                const months = getRoundedMonths(pp.start, pp.end);
                // Применяем стандартное математическое округление количества до 2 знаков после запятой
                const qty = Math.round((months / wearMonths) * 100) / 100;
                // Начисляем деньги строго на основе округленного количества предметов
                const money = Math.round(qty * item.price * 100) / 100;

                earnedQty += qty;
                earnedMoney += money;
                periodDetails.push({ 
                    type: pp.type, 
                    norm: pp.norm, 
                    months, 
                    wearMonths, 
                    qty, 
                    money, 
                    pIndex: pp.pIndex, 
                    isTail: pp.isTail, 
                    start: pp.start, 
                    end: pp.end 
                });
            });

            // Округляем суммарные показатели начисления до 2 знаков
            earnedQty = Math.round(earnedQty * 100) / 100;
            earnedMoney = Math.round(earnedMoney * 100) / 100;

            // 2. Считаем Выдано (Полная стоимость)
            const issuedQty = Number(itemTotals[item.id]) || 0;
            const issuedMoney = Math.round(issuedQty * item.price * 100) / 100;

            // 3. Считаем Амортизацию (Удержание за неистекший срок)
            let amortMoney = 0;
            const amortDetails = [];
            
            const dismD = parseDate(dismissalDate);
            const lastPeriod = periods.find(p => {
                const s = parseDate(p.start);
                const e = parseDate(p.end);
                return s && e && dismD && dismD >= s && dismD <= e;
            }) || periods[periods.length - 1];

            let wearMonthsForDed = 0;
            if (lastPeriod) {
                const targetDate = (dismD && !isNaN(dismD.getTime())) ? dismD : (parseDate(lastPeriod.end) || new Date());
                const is789 = targetDate < SPLIT_DATE;
                const wearKey = is789 ? 'wear_789' : 'wear_150';
                const specificWearKey = `${wearKey}_norm${lastPeriod.norm}`;
                
                wearMonthsForDed = item[specificWearKey] || item[wearKey];
                if (!wearMonthsForDed) {
                    const altWearKey = is789 ? 'wear_150' : 'wear_789';
                    const altSpecific = `${altWearKey}_norm${lastPeriod.norm}`;
                    wearMonthsForDed = item[altSpecific] || item[altWearKey] || 0;
                }
            }

            const localDeductionLines = [];

            if (wearMonthsForDed > 0 && issuedQty > earnedQty) {
                // Вычисляем разницу в количестве с точностью до 2 знаков
                const diffQty = Math.round((issuedQty - earnedQty) * 100) / 100;
                let totalDeductionMonths = Math.round(diffQty * wearMonthsForDed);
                const priceToUse = customPrices[item.id] || item.price;
                
                if (totalDeductionMonths > 0) {
                    let baseDateForDeduction = dismD;
                    if (!baseDateForDeduction || isNaN(baseDateForDeduction.getTime())) {
                        baseDateForDeduction = parseDate(lastPeriod?.end) || new Date();
                    }

                    let remainingDeduction = totalDeductionMonths;
                    let n = 0;

                    while (remainingDeduction > 0) {
                        let dedMonths = remainingDeduction % wearMonthsForDed;
                        if (dedMonths === 0) dedMonths = wearMonthsForDed;
                        
                        const wornMonths = wearMonthsForDed - dedMonths;
                        let issueDate = new Date(baseDateForDeduction);
                        issueDate.setMonth(issueDate.getMonth() - wornMonths - (n * wearMonthsForDed));
                        
                        let issueDateStr = `${issueDate.getFullYear()}-${String(issueDate.getMonth() + 1).padStart(2, '0')}-${String(issueDate.getDate()).padStart(2, '0')}`;
                        
                        // Рассчитываем долю недоноса с математическим округлением до 2 знаков
                        const dedQty = Math.round((dedMonths / wearMonthsForDed) * 100) / 100;
                        // Рассчитываем сумму износа по округленной доле недоноса
                        const residualValue = Math.round(dedQty * priceToUse * 100) / 100;
                        
                        localDeductionLines.push({
                            name: item.name,
                            qty: 1,
                            wearMonths: wearMonthsForDed,
                            issueDateStr: issueDateStr,
                            monthsLeft: dedMonths,
                            price: priceToUse,
                            pricePerMonth: priceToUse / wearMonthsForDed,
                            residualValue: residualValue,
                            dedQty: dedQty
                        });
                        
                        amortMoney += residualValue;
                        
                        const parts = issueDateStr.split('-');
                        const formattedIssueDate = parts.length === 3 ? `${parts[1]}.${parts[0]}` : issueDateStr;
                        
                        const formattedVal = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 2 }).format(residualValue);
                        amortDetails.push(`Недонос ${dedMonths} мес. (выдано: ${formattedIssueDate}) - ${formattedVal}`);
                        
                        remainingDeduction -= dedMonths;
                        n++;
                    }
                }
            }

            // Округляем общую амортизацию предмета
            amortMoney = Math.round(amortMoney * 100) / 100;

            // 4. Логика Трех Групп
            const baseComp = Math.max(0, earnedMoney - issuedMoney);
            const baseDed = amortMoney;

            let comp = 0;
            let ded = 0;

            if (dismissalGroup === 'A') {
                comp = baseComp;
                ded = 0; // Прощается
            } else if (dismissalGroup === 'B') {
                comp = 0; // Обнуляется
                ded = baseDed;
            } else if (dismissalGroup === 'V') {
                comp = baseComp;
                ded = baseDed;
            }

            const balance = Math.round((comp - ded) * 100) / 100;

            if (comp > 0 || ded > 0 || earnedMoney > 0 || issuedMoney > 0) {
                res.push({
                    ...item,
                    earnedQty,
                    earnedMoney,
                    issuedMoney,
                    amortMoney,
                    comp,
                    ded,
                    balance,
                    periodDetails,
                    amortDetails,
                    issuedCount: issuedQty,
                    deductionLines: localDeductionLines
                });
            }
        });

        return res;
    }, [periods, gender, itemTotals, customPrices, dismissalGroup, dismissalDate, activeItemsList]);

    const totalComp = results.reduce((sum, r) => sum + r.comp, 0);
    const totalDed = results.reduce((sum, r) => sum + r.ded, 0);
    const finalBalance = totalComp - totalDed;
    const isPositive = finalBalance >= 0;

    return { activeItemsList, groupedItems, results, totalComp, totalDed, finalBalance, isPositive };
}
