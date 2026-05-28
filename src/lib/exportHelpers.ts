// @ts-nocheck
export const declineFio = (fio, gcase) => {
    if (!fio) return '';
    const parts = fio.trim().split(/\s+/);
    if (parts.length < 2) return fio;
    const declineWord = (word, type, gcase) => {
        let w = word.toLowerCase();
        let isGen = gcase === 'genitive';
        if (type === 'last') {
            if (w.endsWith('ов') || w.endsWith('ев') || w.endsWith('ин') || w.endsWith('ын')) return word + (isGen ? 'а' : 'у');
            if (w.endsWith('ова') || w.endsWith('ева') || w.endsWith('ина') || w.endsWith('ына')) return word.slice(0, -1) + (isGen ? 'ой' : 'ой');
            if (w.endsWith('ский') || w.endsWith('цкий')) return word.slice(0, -2) + (isGen ? 'ого' : 'ому');
            if (w.endsWith('ская') || w.endsWith('цкая')) return word.slice(0, -2) + (isGen ? 'ой' : 'ой');
        }
        if (type === 'first') {
            if (w.endsWith('а') || w.endsWith('я')) {
                if (w.endsWith('ия')) return word.slice(0, -1) + (isGen ? 'и' : 'и');
                return word.slice(0, -1) + (isGen ? (w.endsWith('я')?'и':'ы') : 'е');
            }
            if (w.endsWith('й') || w.endsWith('ь')) return word.slice(0, -1) + (isGen ? 'я' : 'ю');
            if (/[бвгджзклмнпрстфхцчшщ]$/.test(w)) return word + (isGen ? 'а' : 'у');
        }
        if (type === 'middle') {
            if (w.endsWith('ич')) return word + (isGen ? 'а' : 'у');
            if (w.endsWith('на')) return word.slice(0, -1) + (isGen ? 'ы' : 'е');
        }
        return word;
    };
    let result = [];
    if (parts.length >= 3) {
        result.push(declineWord(parts[0], 'last', gcase));
        result.push(declineWord(parts[1], 'first', gcase));
        result.push(declineWord(parts[2], 'middle', gcase));
        for(let i=3; i<parts.length; i++) result.push(parts[i]);
    } else {
        result.push(declineWord(parts[0], 'last', gcase));
        result.push(declineWord(parts[1], 'first', gcase));
    }
    return result.join(' ');
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
                .italic { font-style: italic; }
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
                <tr><td colspan="6" style="border: none;" class="center bold">Справка-обоснование на выплату денежной компенсации</td></tr>
                <tr><td colspan="6" style="border: none;" class="center bold">вместо положенных предметов форменного обмундирования</td></tr>
                <tr><td colspan="6" style="border: none;" class="center bold underline">${declineFio(employeeFio, 'dative') || '_________________________________'}</td></tr>
                <tr><td colspan="6" style="border: none;" class="center bold underline red">${declineRank(employeeRank, 'dative') || '_________________________________'}</td></tr>
                <tr><td colspan="6" style="border: none;" class="left">Арматурная карточка № _____</td></tr>
                <tr><td colspan="6" style="border: none;" class="left">Обоснование для выплаты компенсации:</td></tr>
                <tr><td colspan="6" style="border: none;" class="left">- ч. 2 ст. 69 Федерального закона от 19.07.2018 № 197-ФЗ</td></tr>
                <tr><td colspan="6" style="border: none;" class="left">- Постановление Правительства РФ от 10.02.2021 г. № 150</td></tr>
                <tr><td colspan="6" style="border: none;" class="left">- Приказ Минюста РФ № 211 и Приказ ФСИН № 676 (Нормы снабжения и сроки носки)</td></tr>
                <tr><td colspan="6" style="border: none;" class="left red">Дата увольнения: ${dismissalDate ? formatDateToMMYYYY(dismissalDate) : '_________________'}</td></tr>
                <tr><td colspan="6" style="border: none;"></td></tr>
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
                <tr><td colspan="6" style="border: none;" class="left italic">Настоящий расчет произведен на основании данных из Арматурной карточки и является законным обоснованием для выплаты денежной компенсации за недополученное вещевое имущество.</td></tr>
                <tr><td colspan="6" style="border: none;"></td></tr>
                <tr>
                    <td colspan="3" style="border: none;" class="left">${employeeRank || '________________________________'}</td>
                    <td colspan="3" style="border: none;" class="right">${employeeFio || '________________'}</td>
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
    const isComp = type === 'comp' || type === 'b2c-comp';
    const html = generateExcelHtml(type, data);
    
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = type === 'b2c-comp' ? 'Spravka_Obosnovanie_Fsin.xls' : (type === 'comp' ? 'Spravka_Kompensaciya.xls' : 'Spravka_Uderzhanie.xls');
    a.click();
    URL.revokeObjectURL(url);
};

