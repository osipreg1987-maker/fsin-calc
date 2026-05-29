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
        if (w.endsWith('ова') || w.endsWith('ева') || w.endsWith('ина') || w.endsWith('ына')) return lastName.slice(0, -1) + 'ой';
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

export const generateWordReport = async (data: any) => {
    const { results, instData, employeeFio, employeeRank } = data;
    
    // Calculate total compensation
    const targetResults = results.filter((r: any) => r.comp > 0);
    const totalSum = targetResults.reduce((sum: number, r: any) => sum + r.comp, 0);
    const totalSumStr = totalSum.toFixed(2).replace('.', ',');

    // Decline boss rank and name to Dative case
    const bossRankDative = declineRank(instData.bossRank || "начальник", "dative");
    const bossNameDative = declineFioDative(instData.bossName || "И.И. Иванов");
    const formattedEmployeeFio = formatFioWithInitialsFirst(employeeFio);
    
    const today = new Date();
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    const dateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()} г.`;

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
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
                            text: `${totalSumStr} руб.`, 
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
            ],
        }],
    });

    try {
        const blob = await Packer.toBlob(doc);
        saveAs(blob, "Рапорт_на_компенсацию.docx");
    } catch (e: any) {
        console.error("Error generating report:", e);
        alert("Ошибка при создании рапорта: " + e.message);
    }
};
