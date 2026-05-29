import { Document, Paragraph, TextRun, Packer, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from "docx";
import { saveAs } from "file-saver";
import { declineRank } from "./exportHelpers";

// Helper to format any FIO format into "Initials Surname" (e.g., "А.А. Осипов")
const formatFioWithInitialsFirst = (fio: string): string => {
    if (!fio) return "ФИО";
    const cleanFio = fio.trim();
    const parts = cleanFio.split(/\s+/);
    if (parts.length < 2) return cleanFio;

    const initialsRegex = /^[A-ZА-ЯЁ]\.[A-ZА-ЯЁ]\.$/i;
    const initialSingleRegex = /^[A-ZА-ЯЁ]\.$/i;
    
    // Check if initials are already first (e.g. "А.А. Осипов")
    if (initialsRegex.test(parts[0]) || (parts.length > 2 && initialSingleRegex.test(parts[0]) && initialSingleRegex.test(parts[1]))) {
        return parts.join(" ");
    }

    // Check if initials are at the end (e.g. "Осипов А.А.")
    const lastPart = parts[parts.length - 1];
    if (initialsRegex.test(lastPart)) {
        return `${lastPart} ${parts.slice(0, parts.length - 1).join(" ")}`;
    }

    // Full FIO: "Иванов Иван Иванович" -> "И.И. Иванов"
    if (parts.length >= 3) {
        const surname = parts[0];
        const name = parts[1];
        const patronymic = parts[2];
        const nInit = name[0].toUpperCase() + ".";
        const pInit = patronymic[0].toUpperCase() + ".";
        return `${nInit}${pInit} ${surname}`;
    } else if (parts.length === 2) {
        // Just Surname and First name (e.g. "Иванов Иван" -> "И. Иванов")
        const surname = parts[0];
        const name = parts[1];
        const nInit = name[0].toUpperCase() + ".";
        return `${nInit} ${surname}`;
    }

    return cleanFio;
};

// Helper to decline Surname + Initials or Initials + Surname into Dative Case ("Д.А. Речкалову")
const declineFioDative = (fio: string): string => {
    if (!fio) return "Иванову И.И.";
    const clean = fio.trim();
    const parts = clean.split(/\s+/);
    if (parts.length < 2) return clean;

    const initialsRegex = /^[A-ZА-ЯЁ]\.[A-ZА-ЯЁ]\.$/i;
    const initialSingleRegex = /^[A-ZА-ЯЁ]\.$/i;

    const declineLastNameDative = (lastName: string): string => {
        const w = lastName.toLowerCase();
        if (w.endsWith('ов') || w.endsWith('ев') || w.endsWith('ин') || w.endsWith('ын')) return lastName + 'у';
        if (w.endsWith('ова') || w.endsWith('ева') || w.endsWith('ина') || w.endsWith('ына')) return lastName.slice(0, -1) + 'вой';
        if (w.endsWith('ский') || w.endsWith('цкий')) return lastName.slice(0, -2) + 'ому';
        if (w.endsWith('ская') || w.endsWith('цкая')) return lastName.slice(0, -2) + 'ой';
        return lastName;
    };

    // Case 1: Initials first, e.g. "Д.А. Речкалов" -> "Д.А. Речкалову"
    if (initialsRegex.test(parts[0])) {
        const declinedLastName = declineLastNameDative(parts[1]);
        return `${parts[0]} ${declinedLastName}`;
    }
    
    // Case 2: Initials split first, e.g. "Д. А. Речкалов" -> "Д.А. Речкалову"
    if (parts.length > 2 && initialSingleRegex.test(parts[0]) && initialSingleRegex.test(parts[1])) {
        const declinedLastName = declineLastNameDative(parts[2]);
        return `${parts[0]}${parts[1]} ${declinedLastName}`;
    }

    // Case 3: Surname and initials, e.g. "Речкалов Д.А." -> "Д.А. Речкалову"
    const lastPart = parts[parts.length - 1];
    if (initialsRegex.test(lastPart)) {
        const declinedLastName = declineLastNameDative(parts[0]);
        return `${lastPart} ${declinedLastName}`;
    }

    // Case 4: Full FIO: Surname Name Patronymic (e.g. "Речкалов Дмитрий Анатольевич")
    if (parts.length >= 3) {
        const surname = parts[0];
        const name = parts[1];
        const patronymic = parts[2];
        const declinedSurname = declineLastNameDative(surname);
        const nInit = name[0].toUpperCase() + ".";
        const pInit = patronymic[0].toUpperCase() + ".";
        return `${nInit}${pInit} ${declinedSurname}`;
    }

    return clean;
};

// Russian number-to-words converter for monetary sums
const numToWordsRu = (amount: number): string => {
    const rub = Math.floor(amount);
    const kop = Math.round((amount - rub) * 100);

    const units = [
        ["", "", ""],
        ["один", "одна", "одно"],
        ["два", "две", "два"],
        ["три", "три", "три"],
        ["четыре", "четыре", "четыре"],
        ["пять", "пять", "пять"],
        ["шесть", "шесть", "шесть"],
        ["семь", "семь", "семь"],
        ["восемь", "восемь", "восемь"],
        ["девять", "девять", "девять"]
    ];

    const teens = [
        "десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать",
        "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"
    ];

    const tens = [
        "", "", "двадцать", "тридцать", "сорок", "пятьдесят",
        "шестьдесят", "семьдесят", "восемьдесят", "девяносто"
    ];

    const hundreds = [
        "", "сто", "двести", "триста", "четыреста", "пятьсот",
        "шестьсот", "семьсот", "восемьсот", "девятьсот"
    ];

    const thousands = ["тысяча", "тысячи", "тысяч"];
    const millions = ["миллион", "миллиона", "миллионов"];

    const getWordForm = (n: number, forms: string[]) => {
        const n10 = n % 10;
        const n100 = n % 100;
        if (n100 >= 11 && n100 <= 19) return forms[2];
        if (n10 === 1) return forms[0];
        if (n10 >= 2 && n10 <= 4) return forms[1];
        return forms[2];
    };

    const convertChunk = (n: number, isFemale: boolean): string => {
        let str = "";
        const h = Math.floor(n / 100);
        const t = Math.floor((n % 100) / 10);
        const u = n % 10;

        if (h > 0) str += hundreds[h] + " ";

        if (t === 1) {
            str += teens[u] + " ";
        } else {
            if (t > 1) str += tens[t] + " ";
            if (u > 0) {
                if (u === 1) str += (isFemale ? "одна" : "один") + " ";
                else if (u === 2) str += (isFemale ? "две" : "два") + " ";
                else str += units[u][0] + " ";
            }
        }
        return str;
    };

    if (rub === 0) return "ноль рублей " + String(kop).padStart(2, '0') + " копеек";

    let result = "";
    const milVal = Math.floor(rub / 1000000);
    const thVal = Math.floor((rub % 1000000) / 1000);
    const rubVal = rub % 1000;

    if (milVal > 0) {
        result += convertChunk(milVal, false) + getWordForm(milVal, millions) + " ";
    }
    if (thVal > 0) {
        result += convertChunk(thVal, true) + getWordForm(thVal, thousands) + " ";
    }
    if (rubVal > 0) {
        result += convertChunk(rubVal, false);
    }

    result = result.trim();
    if (result.length > 0) {
        result = result.charAt(0).toUpperCase() + result.slice(1);
    }

    const rubForm = getWordForm(rub, ["рубль", "рубля", "рублей"]);
    const kopForm = getWordForm(kop, ["копейка", "копейки", "копеек"]);

    return `${result} ${rubForm} ${String(kop).padStart(2, '0')} ${kopForm}`;
};

// Date formatter for display in Russian
const formatDateStr = (dateVal: any): string => {
    if (!dateVal) return "—";
    const d = typeof dateVal === 'string' ? new Date(dateVal) : dateVal;
    if (isNaN(d.getTime())) return String(dateVal);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
};

// Helper to create Table Cells with Times New Roman and elegant styling
const createTableCell = (text: string, options: { 
    widthPercent: number; 
    bold?: boolean; 
    align?: any; 
    fillColor?: string; 
    size?: number;
    italic?: boolean;
    colSpan?: number;
}) => {
    return new TableCell({
        width: { size: options.widthPercent, type: WidthType.PERCENTAGE },
        shading: options.fillColor ? { fill: options.fillColor } : undefined,
        columnSpan: options.colSpan || undefined,
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        borders: {
            top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        },
        children: [
            new Paragraph({
                alignment: options.align || AlignmentType.CENTER,
                spacing: { after: 0, before: 0 },
                children: [
                    new TextRun({
                        text: text,
                        bold: options.bold || false,
                        italics: options.italic || false,
                        size: options.size || 18, // 18 in docx is 9pt
                        font: "Times New Roman"
                    })
                ]
            })
        ]
    });
};

export const generateWordReport = async (data: any) => {
    const { results, instData, employeeFio, employeeRank, periods } = data;
    
    // Calculate total compensation
    const targetResults = results.filter((r: any) => r.comp > 0 || r.earnedQty > 0 || r.issuedCount > 0);
    const totalSum = results.reduce((sum: number, r: any) => sum + r.comp, 0);
    const totalDeductions = results.reduce((sum: number, r: any) => sum + r.ded, 0);
    const finalBalance = totalSum - totalDeductions;
    const finalBalanceStr = finalBalance.toFixed(2).replace('.', ',');
    const finalBalanceWords = numToWordsRu(finalBalance);

    // Decline boss rank and name to Dative case
    const bossRankDative = declineRank(instData.bossRank || "начальник", "dative");
    const bossNameDative = declineFioDative(instData.bossName || "И.И. Иванов");
    const formattedEmployeeFio = formatFioWithInitialsFirst(employeeFio);
    
    const today = new Date();
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    const dateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()} г.`;

    // PAGE 1: РАПОРТ
    const pageChildren: any[] = [
        // Right Column Box for Boss Details (using a borderless table for compact alignment)
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "auto" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
                left: { style: BorderStyle.NONE, size: 0, color: "auto" },
                right: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
            },
            rows: [
                new TableRow({
                    children: [
                        // Left column: blank spacer (55% width)
                        new TableCell({
                            width: { size: 55, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ text: "" })]
                        }),
                        // Right column: centered boss details (45% width)
                        new TableCell({
                            width: { size: 45, type: WidthType.PERCENTAGE },
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    spacing: { line: 240, after: 0 }, // single line spacing
                                    children: [new TextRun({ text: "Начальнику", size: 24, font: "Times New Roman" })]
                                }),
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    spacing: { line: 240, after: 0 },
                                    children: [new TextRun({ text: instData.institution || "ФКУ СИЗО-2 ГУФСИН России", size: 24, font: "Times New Roman" })]
                                }),
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    spacing: { line: 240, after: 0 },
                                    children: [new TextRun({ text: instData.region || "по Свердловской области", size: 24, font: "Times New Roman" })]
                                }),
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    spacing: { line: 240, after: 0 },
                                    children: [new TextRun({ text: bossRankDative, size: 24, font: "Times New Roman" })]
                                }),
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    spacing: { line: 240, after: 0 },
                                    children: [new TextRun({ text: bossNameDative, size: 24, font: "Times New Roman", underline: {} })]
                                }),
                            ]
                        })
                    ]
                })
            ]
        }),
        new Paragraph({ text: "", spacing: { after: 400 } }), // Blank line spacer

        // Title
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({ text: "РАПОРТ", size: 28, font: "Times New Roman", bold: true }),
            ],
        }),
        new Paragraph({ text: "", spacing: { after: 300 } }), // Blank line spacer

        // Body
        new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            indent: { firstLine: 720 }, // 1.25 cm indent
            spacing: { line: 280, after: 200 },
            children: [
                new TextRun({ 
                    text: "Прошу Вас выплатить мне денежную компенсацию за неполученное вещевое имущество личного пользования в период прохождения службы на сумму ", 
                    size: 24, 
                    font: "Times New Roman" 
                }),
                new TextRun({ 
                    text: `${finalBalanceStr} руб.`, 
                    size: 24, 
                    font: "Times New Roman",
                    bold: true
                }),
                new TextRun({ 
                    text: " (подробная справка-расчет прилагается).", 
                    size: 24, 
                    font: "Times New Roman" 
                }),
            ],
        }),
        new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            indent: { firstLine: 720 },
            spacing: { line: 280, after: 400 },
            children: [
                new TextRun({ 
                    text: "Основание: ч. 2 ст. 69 Федерального закона от 19.07.2018 № 197-ФЗ «О службе в уголовно-исполнительной системе Российской Федерации и о внесении изменений в Закон Российской Федерации «Об учреждениях и органах, исполняющих уголовные наказания в виде лишения свободы», Постановление Правительства РФ от 10.02.2021 г. № 150.", 
                    size: 24, 
                    font: "Times New Roman" 
                }),
            ],
        }),

        // Application
        new Paragraph({
            spacing: { after: 500 },
            children: [
                new TextRun({ text: "Приложение: Справка-расчет на 1 л.", size: 24, font: "Times New Roman" }),
            ],
        }),

        // Footer - Employee Info
        new Paragraph({
            spacing: { line: 240, after: 0 },
            children: [
                new TextRun({ text: `[Ваша должность] ${instData.institution || "ФКУ СИЗО-2"}`, size: 24, font: "Times New Roman" }),
            ],
        }),
        new Paragraph({
            spacing: { line: 240, after: 0 },
            children: [
                new TextRun({ text: instData.region || "ГУФСИН России по Свердловской области", size: 24, font: "Times New Roman" }),
            ],
        }),
        
        // Signature Table (3 columns: Rank, Underline for sign, Formatted FIO initials-first)
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "auto" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
                left: { style: BorderStyle.NONE, size: 0, color: "auto" },
                right: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 45, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ spacing: { line: 240, after: 0 }, children: [new TextRun({ text: employeeRank || "капитан внутренней службы", size: 24, font: "Times New Roman" })] })]
                        }),
                        new TableCell({
                            width: { size: 25, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 240, after: 0 }, children: [new TextRun({ text: "___________", size: 24, font: "Times New Roman" })] })]
                        }),
                        new TableCell({
                            width: { size: 30, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { line: 240, after: 0 }, children: [new TextRun({ text: formattedEmployeeFio, size: 24, font: "Times New Roman" })] })]
                        }),
                    ]
                })
            ]
        }),

        new Paragraph({ text: "", spacing: { after: 200 } }), // Blank line spacer
        new Paragraph({
            children: [
                new TextRun({ text: dateStr, size: 24, font: "Times New Roman" }),
            ],
        }),
    ];

    // PAGE 2: СПРАВКА-ОБОСНОВАНИЕ (B2C-style detailed calculations)
    // We add page break directly on the first element of page 2
    pageChildren.push(
        new Paragraph({
            alignment: AlignmentType.RIGHT,
            pageBreakBefore: true,
            spacing: { before: 200, after: 200 },
            children: [
                new TextRun({ text: `Приложение № 1 к рапорту от ${dateStr}`, size: 20, font: "Times New Roman", italics: true })
            ]
        })
    );

    pageChildren.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
                new TextRun({ text: "СПРАВКА-ОБОСНОВАНИЕ РАСЧЕТА", size: 28, font: "Times New Roman", bold: true })
            ]
        })
    );

    pageChildren.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
                new TextRun({ text: "денежной компенсации вместо положенных предметов вещевого имущества личного пользования", size: 20, font: "Times New Roman", italics: true })
            ]
        })
    );

    // Administrative metadata block
    pageChildren.push(
        new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 80, line: 200 },
            children: [
                new TextRun({ text: "ФИО сотрудника: ", font: "Times New Roman", bold: true, size: 22 }),
                new TextRun({ text: employeeFio || "ФИО", font: "Times New Roman", size: 22 }),
            ]
        })
    );

    pageChildren.push(
        new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 80, line: 200 },
            children: [
                new TextRun({ text: "Специальное звание: ", font: "Times New Roman", bold: true, size: 22 }),
                new TextRun({ text: employeeRank || "капитан внутренней службы", font: "Times New Roman", size: 22 }),
            ]
        })
    );

    pageChildren.push(
        new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 80, line: 200 },
            children: [
                new TextRun({ text: "Учреждение: ", font: "Times New Roman", bold: true, size: 22 }),
                new TextRun({ text: `${instData.institution || "ФКУ СИЗО-2"} ${instData.region || "по Свердловской области"}`, font: "Times New Roman", size: 22 }),
            ]
        })
    );

    // List of active service periods
    let periodsStr = "";
    if (periods && periods.length > 0) {
        periodsStr = periods.map((p: any, idx: number) => 
            `Период ${idx + 1}: с ${formatDateStr(p.start)} по ${formatDateStr(p.end)} (Норма снабжения: № ${p.norm})`
        ).join("; ");
    } else {
        periodsStr = "не указаны";
    }

    pageChildren.push(
        new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 300, line: 200 },
            children: [
                new TextRun({ text: "Периоды службы: ", font: "Times New Roman", bold: true, size: 22 }),
                new TextRun({ text: periodsStr, font: "Times New Roman", size: 22, italics: true }),
            ]
        })
    );

    // Build calculations table
    const tableRows = [];

    // Header Row (9 Columns)
    tableRows.push(
        new TableRow({
            children: [
                createTableCell("№", { widthPercent: 5, bold: true, fillColor: "F1F5F9" }),
                createTableCell("Наименование предмета / Расчетные периоды службы", { widthPercent: 30, bold: true, fillColor: "F1F5F9", align: AlignmentType.LEFT }),
                createTableCell("Срок носки", { widthPercent: 10, bold: true, fillColor: "F1F5F9" }),
                createTableCell("Положено (шт.)", { widthPercent: 9, bold: true, fillColor: "F1F5F9" }),
                createTableCell("Выдано (шт.)", { widthPercent: 9, bold: true, fillColor: "F1F5F9" }),
                createTableCell("Износ (шт.)", { widthPercent: 9, bold: true, fillColor: "F1F5F9" }),
                createTableCell("К выплате (шт.)", { widthPercent: 9, bold: true, fillColor: "F1F5F9" }),
                createTableCell("Цена (руб.)", { widthPercent: 9, bold: true, fillColor: "F1F5F9" }),
                createTableCell("Сумма (руб.)", { widthPercent: 10, bold: true, fillColor: "F1F5F9" }),
            ]
        })
    );

    // Data rows
    targetResults.forEach((r: any, idx: number) => {
        const itemWear = r.wear_150 || r.wear_789 || 24;
        const amortQty = r.ded / r.price;
        const compQty = r.comp / r.price;
        const balanceQty = r.balance / r.price;

        // Main Item Row
        tableRows.push(
            new TableRow({
                children: [
                    createTableCell(String(idx + 1), { widthPercent: 5, bold: true }),
                    createTableCell(r.name, { widthPercent: 30, bold: true, align: AlignmentType.LEFT }),
                    createTableCell(`${Math.round(itemWear / 12)} г. (${itemWear}м)`, { widthPercent: 10 }),
                    createTableCell(r.earnedQty.toFixed(2), { widthPercent: 9 }),
                    createTableCell(String(r.issuedCount), { widthPercent: 9 }),
                    createTableCell(amortQty > 0 ? amortQty.toFixed(2) : "0,00", { widthPercent: 9 }),
                    createTableCell(balanceQty > 0 ? balanceQty.toFixed(2) : "0,00", { widthPercent: 9 }),
                    createTableCell(r.price.toFixed(2).replace('.', ','), { widthPercent: 9 }),
                    createTableCell(r.balance.toFixed(2).replace('.', ','), { widthPercent: 10, bold: true }),
                ]
            })
        );

        // Nested Period Details Sub-rows
        if (r.periodDetails && r.periodDetails.length > 0) {
            r.periodDetails.forEach((pd: any) => {
                const pdWear = pd.wearMonths || 24;
                tableRows.push(
                    new TableRow({
                        children: [
                            createTableCell("", { widthPercent: 5 }),
                            createTableCell(`↳ Период: с ${formatDateStr(pd.start)} по ${formatDateStr(pd.end)} (${pd.months} мес. службы)`, { widthPercent: 30, italic: true, align: AlignmentType.LEFT, size: 16 }),
                            createTableCell(`${Math.round(pdWear / 12)} г.`, { widthPercent: 10, size: 16 }),
                            createTableCell(pd.qty.toFixed(2), { widthPercent: 9, size: 16 }),
                            createTableCell("—", { widthPercent: 9, size: 16 }),
                            createTableCell("—", { widthPercent: 9, size: 16 }),
                            createTableCell("—", { widthPercent: 9, size: 16 }),
                            createTableCell("—", { widthPercent: 9, size: 16 }),
                            createTableCell(pd.money.toFixed(2).replace('.', ','), { widthPercent: 10, size: 16, italic: true }),
                        ]
                    })
                );
            });
        }

        // Nested Warehouse Issue Sub-row
        if (r.issuedCount > 0) {
            tableRows.push(
                new TableRow({
                    children: [
                        createTableCell("", { widthPercent: 5 }),
                        createTableCell(`↳ Получено со склада (минус из положенного вещевым)`, { widthPercent: 30, italic: true, align: AlignmentType.LEFT, size: 16 }),
                        createTableCell("—", { widthPercent: 10, size: 16 }),
                        createTableCell("—", { widthPercent: 9, size: 16 }),
                        createTableCell(String(r.issuedCount), { widthPercent: 9, size: 16 }),
                        createTableCell("—", { widthPercent: 9, size: 16 }),
                        createTableCell("—", { widthPercent: 9, size: 16 }),
                        createTableCell("—", { widthPercent: 9, size: 16 }),
                        createTableCell(`-${r.issuedMoney.toFixed(2).replace('.', ',')}`, { widthPercent: 10, size: 16, italic: true }),
                    ]
                })
            );
        }

        // Nested Amortization Sub-row
        if (r.ded > 0) {
            if (r.deductionLines && r.deductionLines.length > 0) {
                r.deductionLines.forEach((line: any) => {
                    const lWear = line.wearMonths || 24;
                    const lQty = line.monthsLeft / lWear;
                    tableRows.push(
                        new TableRow({
                            children: [
                                createTableCell("", { widthPercent: 5 }),
                                createTableCell(`↳ Амортизация за недонос: выдан ${formatDateStr(line.issueDateStr)} (недонос ${line.monthsLeft} мес.)`, { widthPercent: 30, italic: true, align: AlignmentType.LEFT, size: 16 }),
                                createTableCell("—", { widthPercent: 10, size: 16 }),
                                createTableCell("—", { widthPercent: 9, size: 16 }),
                                createTableCell("—", { widthPercent: 9, size: 16 }),
                                createTableCell(lQty.toFixed(2), { widthPercent: 9, size: 16 }),
                                createTableCell("—", { widthPercent: 9, size: 16 }),
                                createTableCell("—", { widthPercent: 9, size: 16 }),
                                createTableCell(`-${line.residualValue.toFixed(2).replace('.', ',')}`, { widthPercent: 10, size: 16, italic: true }),
                            ]
                        })
                    );
                });
            } else if (r.amortDetails && r.amortDetails.length > 0) {
                r.amortDetails.forEach((det: string) => {
                    tableRows.push(
                        new TableRow({
                            children: [
                                createTableCell("", { widthPercent: 5 }),
                                createTableCell(`↳ Амортизация: ${det}`, { widthPercent: 30, italic: true, align: AlignmentType.LEFT, size: 16 }),
                                createTableCell("—", { widthPercent: 10, size: 16 }),
                                createTableCell("—", { widthPercent: 9, size: 16 }),
                                createTableCell("—", { widthPercent: 9, size: 16 }),
                                createTableCell("—", { widthPercent: 9, size: 16 }),
                                createTableCell("—", { widthPercent: 9, size: 16 }),
                                createTableCell("—", { widthPercent: 9, size: 16 }),
                                createTableCell(`-${r.ded.toFixed(2).replace('.', ',')}`, { widthPercent: 10, size: 16, italic: true }),
                            ]
                        })
                    );
                });
            }
        }
    });

    // Subtotal bottom rows
    tableRows.push(
        new TableRow({
            children: [
                createTableCell("Итого начислено компенсаций по выслуге:", { widthPercent: 45, bold: true, align: AlignmentType.RIGHT, colSpan: 3 }),
                createTableCell("", { widthPercent: 9 }),
                createTableCell("", { widthPercent: 9 }),
                createTableCell("", { widthPercent: 9 }),
                createTableCell("", { widthPercent: 9 }),
                createTableCell("", { widthPercent: 9 }),
                createTableCell(totalSum.toFixed(2).replace('.', ','), { widthPercent: 10, bold: true }),
            ]
        })
    );

    tableRows.push(
        new TableRow({
            children: [
                createTableCell("Итого начислено амортизационного износа к удержанию:", { widthPercent: 45, bold: true, align: AlignmentType.RIGHT, colSpan: 3 }),
                createTableCell("", { widthPercent: 9 }),
                createTableCell("", { widthPercent: 9 }),
                createTableCell("", { widthPercent: 9 }),
                createTableCell("", { widthPercent: 9 }),
                createTableCell("", { widthPercent: 9 }),
                createTableCell(totalDeductions > 0 ? `-${totalDeductions.toFixed(2).replace('.', ',')}` : "0,00", { widthPercent: 10, bold: true }),
            ]
        })
    );

    tableRows.push(
        new TableRow({
            children: [
                createTableCell("ИТОГО К ВЫПЛАТЕ ПО РАСЧЕТУ (с учетом удержаний):", { widthPercent: 45, bold: true, align: AlignmentType.RIGHT, colSpan: 3, fillColor: "F1F5F9" }),
                createTableCell("", { widthPercent: 9, fillColor: "F1F5F9" }),
                createTableCell("", { widthPercent: 9, fillColor: "F1F5F9" }),
                createTableCell("", { widthPercent: 9, fillColor: "F1F5F9" }),
                createTableCell("", { widthPercent: 9, fillColor: "F1F5F9" }),
                createTableCell("", { widthPercent: 9, fillColor: "F1F5F9" }),
                createTableCell(finalBalance.toFixed(2).replace('.', ','), { widthPercent: 10, bold: true, fillColor: "F1F5F9" }),
            ]
        })
    );

    pageChildren.push(
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows
        })
    );

    pageChildren.push(new Paragraph({ text: "", spacing: { after: 200 } }));

    // Words total sum line
    pageChildren.push(
        new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 400, line: 240 },
            children: [
                new TextRun({ text: "Итого к выплате по настоящему расчету: ", font: "Times New Roman", bold: true, size: 24 }),
                new TextRun({ text: `${finalBalanceStr} руб. `, font: "Times New Roman", bold: true, size: 24 }),
                new TextRun({ text: `(${finalBalanceWords})`, font: "Times New Roman", size: 22, italics: true })
            ]
        })
    );

    pageChildren.push(
        new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 300, line: 200 },
            children: [
                new TextRun({ text: "Расчет составлен автоматически на сайте FSIN-Calc на основе действующих норм вещевого снабжения и пропорционального исчисления сроков носки.", font: "Times New Roman", size: 18, italics: true })
            ]
        })
    );

    // Administrative Signature rows for page 2
    pageChildren.push(
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "auto" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
                left: { style: BorderStyle.NONE, size: 0, color: "auto" },
                right: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
            },
            rows: [
                // okbi signature
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 45, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ spacing: { line: 240, after: 0 }, children: [new TextRun({ text: instData.okbiRank || "Начальник ОКБИ и ХО", size: 22, font: "Times New Roman" })] })]
                        }),
                        new TableCell({
                            width: { size: 25, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 240, after: 0 }, children: [new TextRun({ text: "___________", size: 22, font: "Times New Roman" })] })]
                        }),
                        new TableCell({
                            width: { size: 30, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { line: 240, after: 0 }, children: [new TextRun({ text: instData.okbiName || "ФИО", size: 22, font: "Times New Roman" })] })]
                        }),
                    ]
                }),
                // spacing row
                new TableRow({
                    children: [
                        new TableCell({ width: { size: 45, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "" })] }),
                        new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "" })] }),
                        new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "" })] }),
                    ]
                }),
                // accountant signature
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 45, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ spacing: { line: 240, after: 0 }, children: [new TextRun({ text: instData.accRank || "Главный бухгалтер", size: 22, font: "Times New Roman" })] })]
                        }),
                        new TableCell({
                            width: { size: 25, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 240, after: 0 }, children: [new TextRun({ text: "___________", size: 22, font: "Times New Roman" })] })]
                        }),
                        new TableCell({
                            width: { size: 30, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { line: 240, after: 0 }, children: [new TextRun({ text: instData.accName || "ФИО", size: 22, font: "Times New Roman" })] })]
                        }),
                    ]
                }),
                // spacing row
                new TableRow({
                    children: [
                        new TableCell({ width: { size: 45, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "" })] }),
                        new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "" })] }),
                        new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "" })] }),
                    ]
                }),
                // employee signature
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 45, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ spacing: { line: 240, after: 0 }, children: [new TextRun({ text: employeeRank || "С расчетом ознакомлен", size: 22, font: "Times New Roman", bold: true })] })]
                        }),
                        new TableCell({
                            width: { size: 25, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 240, after: 0 }, children: [new TextRun({ text: "___________", size: 22, font: "Times New Roman" })] })]
                        }),
                        new TableCell({
                            width: { size: 30, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { line: 240, after: 0 }, children: [new TextRun({ text: formattedEmployeeFio, size: 22, font: "Times New Roman", bold: true })] })]
                        }),
                    ]
                }),
            ]
        })
    );


    // Build Document with all child blocks
    const doc = new Document({
        sections: [{
            properties: {},
            children: pageChildren
        }]
    });

    try {
        const blob = await Packer.toBlob(doc);
        saveAs(blob, "Рапорт_на_компенсацию.docx");
    } catch (e: any) {
        console.error("Error generating report:", e);
        alert("Ошибка при создании рапорта: " + e.message);
    }
};
