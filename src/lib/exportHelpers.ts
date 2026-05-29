// @ts-nocheck
export const declineFio = (fio, gcase) => {
    if (!fio) return '';
    const cleanFio = fio.trim();
    const parts = cleanFio.split(/\s+/);
    if (parts.length < 2) return cleanFio;

    const initialsRegex = /^[A-ZА-ЯЁ]\.[A-ZА-ЯЁ]\.$/i;
    const initialSingleRegex = /^[A-ZА-ЯЁ]\.$/i;
    let isGen = gcase === 'genitive';

    const declineLastName = (lastName) => {
        const w = lastName.toLowerCase();
        if (w.endsWith('ов') || w.endsWith('ев') || w.endsWith('ин') || w.endsWith('ын')) return lastName + (isGen ? 'а' : 'у');
        if (w.endsWith('ова') || w.endsWith('ева') || w.endsWith('ина') || w.endsWith('ына')) return lastName.slice(0, -1) + (isGen ? 'ой' : 'ой');
        if (w.endsWith('ский') || w.endsWith('цкий')) return lastName.slice(0, -2) + (isGen ? 'ого' : 'ому');
        if (w.endsWith('ская') || w.endsWith('цкая')) return lastName.slice(0, -2) + (isGen ? 'ой' : 'ой');
        return lastName;
    };

    // Case 1: Initials first, e.g. "Д.А. Речкалов"
    if (initialsRegex.test(parts[0])) {
        const declinedLastName = declineLastName(parts[1]);
        return `${parts[0]} ${declinedLastName}`;
    }
    
    // Case 2: Initials first split, e.g. "Д. А. Речкалов"
    if (parts.length > 2 && initialSingleRegex.test(parts[0]) && initialSingleRegex.test(parts[1])) {
        const declinedLastName = declineLastName(parts[2]);
        return `${parts[0]}${parts[1]} ${declinedLastName}`;
    }

    // Case 3: Surname and initials, e.g. "Речкалов Д.А."
    const lastPart = parts[parts.length - 1];
    if (initialsRegex.test(lastPart)) {
        const declinedLastName = declineLastName(parts[0]);
        return `${lastPart} ${declinedLastName}`;
    }

    // Case 4: Full FIO: Surname Name Patronymic (e.g. "Речкалов Дмитрий Анатольевич")
    if (parts.length >= 3) {
        const surname = parts[0];
        const name = parts[1];
        const patronymic = parts[2];
        const declinedSurname = declineLastName(surname);
        
        // Return declined initials + surname for dative, or declined full name for genitive
        if (gcase === 'dative') {
            const nInit = name[0].toUpperCase() + ".";
            const pInit = patronymic[0].toUpperCase() + ".";
            return `${nInit}${pInit} ${declinedSurname}`;
        } else {
            // Genitive declension for full name
            const declineWord = (word, type) => {
                let w = word.toLowerCase();
                if (type === 'first') {
                    if (w.endsWith('а') || w.endsWith('я')) return word.slice(0, -1) + (w.endsWith('я') ? 'и' : 'ы');
                    if (w.endsWith('й') || w.endsWith('ь')) return word.slice(0, -1) + 'я';
                    if (/[бвгджзклмнпрстфхцчшщ]$/.test(w)) return word + 'а';
                }
                if (type === 'middle') {
                    if (w.endsWith('ич')) return word + 'а';
                    if (w.endsWith('на')) return word.slice(0, -1) + 'ы';
                }
                return word;
            };
            return `${declinedSurname} ${declineWord(name, 'first')} ${declineWord(patronymic, 'middle')}`;
        }
    }

    return cleanFio;
};

// Format FIO into "Initials Surname" (e.g., "А.А. Осипов")
export const formatFioWithInitialsFirst = (fio) => {
    if (!fio) return "ФИО";
    const cleanFio = fio.trim();
    const parts = cleanFio.split(/\s+/);
    if (parts.length < 2) return cleanFio;

    const initialsRegex = /^[A-ZА-ЯЁ]\.[A-ZА-ЯЁ]\.$/i;
    const initialSingleRegex = /^[A-ZА-ЯЁ]\.$/i;
    
    if (initialsRegex.test(parts[0]) || (parts.length > 2 && initialSingleRegex.test(parts[0]) && initialSingleRegex.test(parts[1]))) {
        return parts.join(" ");
    }

    const lastPart = parts[parts.length - 1];
    if (initialsRegex.test(lastPart)) {
        return `${lastPart} ${parts.slice(0, parts.length - 1).join(" ")}`;
    }

    if (parts.length >= 3) {
        const surname = parts[0];
        const name = parts[1];
        const patronymic = parts[2];
        const nInit = name[0].toUpperCase() + ".";
        const pInit = patronymic[0].toUpperCase() + ".";
        return `${nInit}${pInit} ${surname}`;
    } else if (parts.length === 2) {
        const surname = parts[0];
        const name = parts[1];
        const nInit = name[0].toUpperCase() + ".";
        return `${nInit} ${surname}`;
    }

    return cleanFio;
};

export const declineRank = (rank, gcase) => {
    if (!rank) return '';
    let isGen = gcase === 'genitive';
    const rules = {
        'младший': isGen ? 'младшего' : 'младшему',
        'старший': isGen ? 'старшего' : 'старшему',
        'рядовой': isGen ? 'рядового' : 'рядовому',
        'сержант': isGen ? 'сержанта' : 'сержанту',
        'старшина': isGen ? 'старшины' : 'старшине',
        'прапорщик': isGen ? 'прапорщика' : 'прапорщику',
        'лейтенант': isGen ? 'лейтенанта' : 'лейтенанту',
        'капитан': isGen ? 'капитана' : 'капитану',
        'майор': isGen ? 'майора' : 'майору',
        'подполковник': isGen ? 'подполковника' : 'подполковнику',
        'полковник': isGen ? 'полковника' : 'полковнику',
        'генерал-майор': isGen ? 'генерал-майора' : 'генерал-майору',
        'генерал-лейтенант': isGen ? 'генерал-лейтенанта' : 'генерал-лейтенанту',
        'генерал-полковник': isGen ? 'генерал-полковника' : 'генерал-полковнику',
    };
    return rank.split(' ').map(w => rules[w.toLowerCase()] || w).join(' ');
};

export const formatDateToMMYYYY = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[1]}.${parts[0]}`;
    return dateStr;
};

export const generateExcelHtml = (type, data) => {
    const { results, instData, employeeFio, employeeRank, dismissalDate } = data;
    const isComp = type === 'comp';
    const isB2c = type === 'b2c-comp';
    let html = '';

    if (isB2c) {
        html += `
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:x="urn:schemas-microsoft-com:office:excel"
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="utf-8">
            <style>
                table { border-collapse: collapse; width: 100%; font-family: 'Times New Roman', Times, serif; font-size: 11pt; }
                td, th { border: 1px solid black; padding: 5px; text-align: center; vertical-align: middle; }
                .no-border { border: none !important; text-align: center; }
                .no-border.left { text-align: left; }
                .bold { font-weight: bold; }
                .red { color: #dc2626; }
                .center { text-align: center; }
                .right { text-align: right; }
                .left { text-align: left; }
                .underline { text-decoration: underline; }
                .italic { font-style: italic; color: #475569; }
                .bg-header { background-color: #f1f5f9; font-weight: bold; }
                .bg-item { background-color: #f8fafc; font-weight: bold; }
                .indent { padding-left: 20px; }
            </style>
        </head>
        <body>
            <table>
                <colgroup>
                    <col width="40" />
                    <col width="320" />
                    <col width="50" />
                    <col width="120" />
                    <col width="120" />
                    <col width="120" />
                    <col width="120" />
                    <col width="120" />
                    <col width="90" />
                    <col width="110" />
                </colgroup>
                <tr><td colspan="10" style="border: none;">${instData.institution} ${instData.region}</td></tr>
                <tr><td colspan="10" style="border: none;"></td></tr>
                <tr><td colspan="10" style="border: none;" class="center bold" style="font-size: 13pt;">СПРАВКА-ОБОСНОВАНИЕ РАСЧЕТА КОМПЕНСАЦИИ</td></tr>
                <tr><td colspan="10" style="border: none;" class="center bold" style="font-size: 11pt;">вместо положенных предметов вещевого имущества личного пользования</td></tr>
                <tr><td colspan="10" style="border: none;" class="center bold underline" style="font-size: 12pt;">Кому: ${declineFio(employeeFio, 'dative') || '_________________________________'}</td></tr>
                <tr><td colspan="10" style="border: none;" class="center bold underline red">${declineRank(employeeRank, 'dative') || '_________________________________'}</td></tr>
                <tr><td colspan="10" style="border: none;"></td></tr>
                <tr><td colspan="10" style="border: none;" class="left"><b>Обоснование для выплаты компенсации:</b> ч. 2 ст. 69 Федерального закона от 19.07.2018 № 197-ФЗ, Постановление Правительства РФ № 150 от 10.02.2021 г., Приказы Минюста РФ № 211 и ФСИН № 676.</td></tr>
                <tr><td colspan="10" style="border: none;" class="left red"><b>Дата окончания службы (увольнения):</b> ${dismissalDate ? formatDateToMMYYYY(dismissalDate) : '_________________'}</td></tr>
                <tr><td colspan="10" style="border: none;"></td></tr>
                <tr class="bg-header">
                    <td>№</td>
                    <td>Наименование вещевого имущества / Расчетные периоды</td>
                    <td>Ед.<br>изм.</td>
                    <td>Срок носки<br>(по норме)</td>
                    <td>Прослужено<br>в период</td>
                    <td>Положено по<br>выслуге (шт)</td>
                    <td>Выдано со склада /<br>Амортизация (шт)</td>
                    <td>К выплате<br>(недополучено)</td>
                    <td>Цена<br>предмета (руб)</td>
                    <td>Сумма к<br>выплате (руб)</td>
                </tr>
        `;

        const targetResults = results.filter((r: any) => r.comp > 0);
        const formattedEmployeeFio = formatFioWithInitialsFirst(employeeFio);
        
        targetResults.forEach((r: any, idx: number) => {
            let unit = 'шт.';
            const safeName = r.name || 'Предмет';
            if (safeName.toLowerCase().includes('костюм') || safeName.toLowerCase().includes('белье')) unit = 'к-т';
            if (safeName.toLowerCase().includes('ботинки') || safeName.toLowerCase().includes('полусапоги') || safeName.toLowerCase().includes('носки') || safeName.toLowerCase().includes('перчатки') || safeName.toLowerCase().includes('сапоги')) unit = 'пар.';
            
            let qty = (r.comp || 0) / (r.price || 1);
            let earnedQty = r.earnedQty || 0;
            let amortQty = (r.amortMoney || 0) / (r.price || 1);
            let totalDeductions = (r.issuedCount || 0) + amortQty;
            
            html += `
                <tr class="bg-item">
                    <td class="bold">${idx + 1}</td>
                    <td class="bold left">${safeName}</td>
                    <td>${unit}</td>
                    <td>-</td>
                    <td>-</td>
                    <td style="mso-number-format:'0.00';">${earnedQty.toFixed(2).replace('.', ',')}</td>
                    <td style="mso-number-format:'0.00';">${totalDeductions > 0 ? totalDeductions.toFixed(2).replace('.', ',') : '-'}</td>
                    <td class="bold red" style="mso-number-format:'0.00';">${qty.toFixed(2).replace('.', ',')}</td>
                    <td style="mso-number-format:'0.00';">${r.price || 0}</td>
                    <td class="bold red" style="mso-number-format:'0.00';">${(r.comp || 0).toFixed(2).replace('.', ',')}</td>
                </tr>
            `;

            // Period details
            if (r.periodDetails && r.periodDetails.length > 0) {
                r.periodDetails.forEach((p: any) => {
                    const normMonths = p.wearMonths || 24;
                    const normYears = Math.round(normMonths / 12);
                    const monthsInPeriod = p.months || 0;
                    const earned = p.qty || 0;
                    
                    const startD = p.start ? (typeof p.start === 'string' ? new Date(p.start) : p.start) : null;
                    const endD = p.end ? (typeof p.end === 'string' ? new Date(p.end) : p.end) : null;
                    const startStr = startD ? formatDateToMMYYYY(startD.toISOString().split('T')[0]) : '';
                    const endStr = endD ? formatDateToMMYYYY(endD.toISOString().split('T')[0]) : '';
                    
                    html += `
                        <tr>
                            <td></td>
                            <td class="left italic indent">↳ Срок службы: с ${startStr} по ${endStr} (Пост. ${p.type || '150'})</td>
                            <td></td>
                            <td>${normYears} г. (${normMonths} мес.)</td>
                            <td>${monthsInPeriod} мес.</td>
                            <td style="mso-number-format:'0.00';">${earned.toFixed(2).replace('.', ',')}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    `;
                });
            }

            // Deductions
            if (r.issuedCount > 0) {
                html += `
                        <tr>
                            <td></td>
                            <td class="left italic indent">↳ Выдано со склада (ранее получено лично в носку)</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style="mso-number-format:'0.00';">${r.issuedCount.toFixed(2).replace('.', ',')}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                `;
            }

            if (r.amortMoney > 0) {
                const amortQty = r.amortMoney / r.price;
                html += `
                        <tr>
                            <td></td>
                            <td class="left italic indent">↳ Амортизация (удержан износ одежды за время носки)</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style="mso-number-format:'0.00';">${amortQty.toFixed(2).replace('.', ',')}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                `;
            }
        });

        const totalSum = targetResults.reduce((sum: number, r: any) => sum + r.comp, 0);
        const totalQty = targetResults.reduce((sum: number, r: any) => sum + (r.comp / r.price), 0);

        html += `
                <tr class="bg-header">
                    <td colspan="7" class="right bold">Итого к выплате:</td>
                    <td class="bold red center" style="mso-number-format:'0.00';">${totalQty.toFixed(2).replace('.', ',')}</td>
                    <td style="border: none;"></td>
                    <td class="bold red" style="mso-number-format:'0.00';">${totalSum.toFixed(2).replace('.', ',')}</td>
                </tr>
                <tr><td colspan="10" class="center bold">Итого начислено компенсаций к выплате: ${totalQty.toFixed(2).replace('.', ',')} предметов на сумму ${totalSum.toFixed(2).replace('.', ',')} руб.</td></tr>
                
                <tr><td colspan="10" style="border: none;"></td></tr>
                <tr><td colspan="10" style="border: none;" class="left italic">Расчет является официальной справкой-обоснованием, составлен строго в соответствии с нормами вещевого снабжения ФСИН РФ и формулами пропорционального исчисления сроков носки.</td></tr>
                <tr><td colspan="10" style="border: none;"></td></tr>
                <tr>
                    <td colspan="5" style="border: none;" class="left"><b>${employeeRank || 'капитан внутренней службы'}</b></td>
                    <td colspan="5" style="border: none;" class="right"><b>${formattedEmployeeFio}</b></td>
                </tr>
            </table>
        </body>
        </html>
        `;
    } else if (isComp) {
        html += `
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:x="urn:schemas-microsoft-com:office:excel"
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="utf-8">
            <style>
                table { border-collapse: collapse; width: 100%; font-family: 'Times New Roman', Times, serif; font-size: 12pt; }
                td, th { border: 1px solid black; padding: 4px; text-align: center; vertical-align: middle; }
                .no-border { border: none !important; text-align: center; }
                .no-border.left { text-align: left; }
                .bold { font-weight: bold; }
                .red { color: red; }
                .center { text-align: center; }
                .right { text-align: right; }
                .left { text-align: left; }
                .underline { text-decoration: underline; }
            </style>
        </head>
        <body>
            <table>
                <colgroup>
                    <col width="64" />
                    <col width="320" />
                    <col width="96" />
                    <col width="96" />
                    <col width="96" />
                    <col width="96" />
                </colgroup>
                <tr><td colspan="6" style="border: none;">${instData.institution} ${instData.region}</td></tr>
                <tr><td colspan="6" style="border: none;"></td></tr>
                <tr><td colspan="6" style="border: none;" class="center bold">Справка № ___ на выплату денежной компенсации</td></tr>
                <tr><td colspan="6" style="border: none;" class="center bold">вместо положенных предметов форменного обмундирования</td></tr>
                <tr><td colspan="6" style="border: none;" class="center bold underline">${declineFio(employeeFio, 'dative') || '_________________________________'}</td></tr>
                <tr><td colspan="6" style="border: none;" class="center bold underline red">${declineRank(employeeRank, 'dative') || '_________________________________'}</td></tr>
                <tr><td colspan="6" style="border: none;" class="left">Арматурная карточка № _____</td></tr>
                <tr><td colspan="6" style="border: none;" class="left">Основание для выплаты компенсации: ФЗ. № 197 от 19.07.2018г., Приказ № 742 от 29.08.2019 г.</td></tr>
                <tr><td colspan="6" style="border: none;" class="left red">приказ № _______ л/с от _________________</td></tr>
                
                <tr>
                    <td class="bold">№ п/п</td>
                    <td class="bold">Наименование предметов</td>
                    <td class="bold">Единица<br>измерения</td>
                    <td class="bold">Количество<br>предметов</td>
                    <td class="bold">Размер денежной<br>компенсации за<br>один предмет (руб.)</td>
                    <td class="bold">Сумма к<br>выплате<br>(руб.)</td>
                </tr>
        `;

        const targetResults = results.filter(r => r.comp > 0);
        
        targetResults.forEach((r, idx) => {
            let unit = 'шт.';
            if (r.name.toLowerCase().includes('костюм') || r.name.toLowerCase().includes('белье')) unit = 'к-т';
            if (r.name.toLowerCase().includes('ботинки') || r.name.toLowerCase().includes('полусапоги') || r.name.toLowerCase().includes('носки') || r.name.toLowerCase().includes('перчатки') || r.name.toLowerCase().includes('сапоги')) unit = 'пар.';
            
            let qty = Math.round(r.comp / r.price);
            
            html += `
                <tr>
                    <td>${idx + 1}</td>
                    <td class="left">${r.name}</td>
                    <td>${unit}</td>
                    <td style="mso-number-format:'0';">${qty}</td>
                    <td style="mso-number-format:'0.00';">${r.price}</td>
                    <td style="mso-number-format:'0.00';">${r.comp.toFixed(2).replace('.', ',')}</td>
                </tr>
            `;
        });

        const totalSum = targetResults.reduce((sum, r) => sum + r.comp, 0);
        const totalQty = targetResults.reduce((sum, r) => sum + Math.round(r.comp / r.price), 0);

        html += `
                <tr>
                    <td colspan="3" class="right bold">Итого:</td>
                    <td class="bold red center" style="mso-number-format:'0';">${totalQty}</td>
                    <td style="border: none;"></td>
                    <td class="bold red" style="mso-number-format:'0.00';">${totalSum.toFixed(2).replace('.', ',')}</td>
                </tr>
                <tr><td colspan="6" class="center">Количество предметов: ${totalQty}</td></tr>
                <tr><td colspan="6" class="center">Сумма к выплате: ${totalSum.toFixed(2).replace('.', ',')} руб.</td></tr>
                
                <tr><td colspan="6" style="border: none;"></td></tr>
                <tr>
                    <td colspan="2" style="border: none;" class="left">${instData.bossTitle || 'Начальник'}</td>
                    <td colspan="2" style="border: none;" class="center"></td>
                    <td colspan="2" style="border: none;" class="right"></td>
                </tr>
                <tr>
                    <td colspan="2" style="border: none;" class="left">${instData.bossRank || '________________________________'}</td>
                    <td colspan="2" style="border: none;" class="center">М.П.</td>
                    <td colspan="2" style="border: none;" class="right">${instData.bossName || '________________'}</td>
                </tr>
                <tr><td colspan="6" style="border: none;"></td></tr>
                <tr>
                    <td colspan="2" style="border: none;" class="left">${instData.okbiTitle || 'Начальник ОКБИ и ХО'}</td>
                    <td colspan="2" style="border: none;" class="center"></td>
                    <td colspan="2" style="border: none;" class="right"></td>
                </tr>
                <tr>
                    <td colspan="2" style="border: none;" class="left">${instData.okbiRank || '________________________________'}</td>
                    <td colspan="2" style="border: none;" class="center">"____" ___________ 20___ года</td>
                    <td colspan="2" style="border: none;" class="right">${instData.okbiName || '________________'}</td>
                </tr>
            </table>
        </body>
        </html>
        `;
    } else {
        html += `
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:x="urn:schemas-microsoft-com:office:excel"
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="utf-8">
            <style>
                table { border-collapse: collapse; width: 100%; font-family: 'Times New Roman', Times, serif; font-size: 12pt; }
                td, th { border: 1px solid black; padding: 4px; text-align: center; vertical-align: middle; }
                .no-border { border: none !important; text-align: center; }
                .no-border.left { text-align: left; }
                .bold { font-weight: bold; }
                .red { color: red; }
                .center { text-align: center; }
                .right { text-align: right; }
                .left { text-align: left; }
                .underline { text-decoration: underline; }
            </style>
        </head>
        <body>
            <table>
                <colgroup>
                    <col width="64" />
                    <col width="320" />
                    <col width="96" />
                    <col width="96" />
                    <col width="96" />
                    <col width="96" />
                    <col width="96" />
                    <col width="96" />
                    <col width="96" />
                </colgroup>
                <tr><td colspan="9" style="border: none;">${instData.institution} ${instData.region}</td></tr>
                <tr><td colspan="9" style="border: none;">С П Р А В К А - Р А С Ч Е Т № ___</td></tr>
                <tr><td colspan="9" style="border: none;">стоимости вещевого имущества на удержание</td></tr>
                <tr><td colspan="9" style="border: none;"></td></tr>
                <tr><td colspan="9" style="border: none;" class="center"><span class="red">${employeeRank ? (/^(старш)/i.test(employeeRank) ? 'со ' : 'с ') + declineRank(employeeRank, 'genitive') : 'с ___________________'}</span></td></tr>
                <tr><td colspan="9" style="border: none;" class="center"><u><span class="red">${declineFio(employeeFio, 'genitive') || '__________________________________'}</span></u></td></tr>
                <tr><td colspan="9" style="border: none;"></td></tr>
                <tr><td colspan="9" style="border: none;" class="left">Уволенного приказом от «___» ___________ 20__ г. №______________________</td></tr>
                <tr><td colspan="9" style="border: none;" class="left">Основание: ФЗ от 19.07.2018 № 197 – ФЗ п.4 ст. 71</td></tr>
                <tr><td colspan="9" style="border: none;"></td></tr>
                <tr>
                    <td>№<br>п/<br>п</td>
                    <td>наименование<br>имущества</td>
                    <td>кол-во<br>предмет<br>ов</td>
                    <td>срок<br>носки в<br>месяцах</td>
                    <td>время<br>выдачи в<br>носку</td>
                    <td>срок не<br>доноса в<br>месяцах</td>
                    <td>цена<br>предмета,<br>руб.</td>
                    <td>стоимость<br>предмета<br>в месяц,<br>руб.</td>
                    <td>сумма к<br>удержанию в<br>руб. и коп.</td>
                </tr>
                <tr>
                    <td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td>
                </tr>
        `;

        let dedLines = [];
        results.forEach(r => {
            if (r.deductionLines && r.deductionLines.length > 0) {
                dedLines.push(...r.deductionLines);
            }
        });

        let totalSum = 0;
        dedLines.forEach((line, idx) => {
            totalSum += line.residualValue;
            html += `
                <tr>
                    <td>${idx + 1}</td>
                    <td class="left">${line.name}</td>
                    <td style="mso-number-format:'0';">${line.qty}</td>
                    <td style="mso-number-format:'0';">${line.wearMonths}</td>
                    <td style="mso-number-format:'\@';">${formatDateToMMYYYY(line.issueDateStr)}</td>
                    <td style="mso-number-format:'0';">${line.monthsLeft}</td>
                    <td style="mso-number-format:'0.00';">${line.price.toFixed(2).replace('.', ',')}</td>
                    <td style="mso-number-format:'0.00';">${line.pricePerMonth.toFixed(2).replace('.', ',')}</td>
                    <td style="mso-number-format:'0.00';">${line.residualValue.toFixed(2).replace('.', ',')}</td>
                </tr>
            `;
        });

        html += `
                <tr>
                    <td colspan="8" class="left">Итого:</td>
                    <td style="mso-number-format:'0.00';">${totalSum.toFixed(2).replace('.', ',')}</td>
                </tr>
                <tr><td colspan="9" style="border: none;"></td></tr>
                <tr><td colspan="9" style="border: none;" class="left"><u>________________________________________________________ рублей ____ копеек</u></td></tr>
                <tr><td colspan="9" style="border: none;" class="center">(сумму к удержанию прописью)</td></tr>
                <tr><td colspan="9" style="border: none;"></td></tr>
                <tr><td colspan="9" style="border: none;" class="left">Количество предметов, время выдачи и сумма к удержанию указаны правильно</td></tr>
                <tr><td colspan="9" style="border: none;"></td></tr>
                <tr><td colspan="9" style="border: none;" class="left">____________________________________________________________________</td></tr>
                <tr><td colspan="9" style="border: none;"></td></tr>
                <tr><td colspan="9" style="border: none;" class="left">«___» ________________ 20___ г.</td></tr>
                <tr><td colspan="9" style="border: none;"></td></tr>
                <tr>
                    <td colspan="4" style="border: none;" class="left">${instData.bossTitle || 'Начальник'}</td>
                    <td colspan="2" style="border: none;" class="center"></td>
                    <td colspan="3" style="border: none;" class="right"></td>
                </tr>
                <tr>
                    <td colspan="4" style="border: none;" class="left">${instData.bossRank || '________________________________'}</td>
                    <td colspan="2" style="border: none;" class="center">___________</td>
                    <td colspan="3" style="border: none;" class="right">${instData.bossName || '________________'}</td>
                </tr>
                <tr><td colspan="9" style="border: none;"></td></tr>
                <tr>
                    <td colspan="4" style="border: none;" class="left">${instData.okbiTitle || 'Начальник ОКБИ и ХО'}</td>
                    <td colspan="2" style="border: none;" class="center"></td>
                    <td colspan="3" style="border: none;" class="right"></td>
                </tr>
                <tr>
                    <td colspan="4" style="border: none;" class="left">${instData.okbiRank || '________________________________'}</td>
                    <td colspan="2" style="border: none;" class="center">___________</td>
                    <td colspan="3" style="border: none;" class="right">${instData.okbiName || '________________'}</td>
                </tr>
                <tr><td colspan="9" style="border: none;"></td></tr>
                <tr>
                    <td colspan="4" style="border: none;" class="left">${instData.accTitle || 'Главный бухгалтер'}</td>
                    <td colspan="2" style="border: none;" class="center"></td>
                    <td colspan="3" style="border: none;" class="right"></td>
                </tr>
                <tr>
                    <td colspan="4" style="border: none;" class="left">${instData.accRank || '________________________________'}</td>
                    <td colspan="2" style="border: none;" class="center">___________</td>
                    <td colspan="3" style="border: none;" class="right">${instData.accName || '________________'}</td>
                </tr>
                <tr><td colspan="9" style="border: none;"></td></tr>
                <tr><td colspan="9" style="border: none;" class="left">«___» ____________ 20___ г.</td></tr>
            </table>
        </body>
        </html>
        `;
    }
    
    return html;
};

export const exportToExcel = (type, data) => {
    try {
        const isComp = type === 'comp' || type === 'b2c-comp';
        const html = generateExcelHtml(type, data);
        
        const blob = new Blob([html], { type: 'application/vnd.ms-excel' });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.target = '_blank';
        a.download = type === 'b2c-comp' ? 'Spravka_Obosnovanie_Fsin.xls' : (type === 'comp' ? 'Spravka_Kompensaciya.xls' : 'Spravka_Uderzhanie.xls');
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    } catch (e: any) {
        alert('Ошибка при выгрузке: ' + e.message + '\n' + e.stack);
        console.error('Export Excel Error:', e);
    }
};

