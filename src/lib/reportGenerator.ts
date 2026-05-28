import { Document, Paragraph, TextRun, Packer, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle } from "docx";
import { saveAs } from "file-saver";
import { declineFio, declineRank } from "./exportHelpers";

export const generateWordReport = async (data: any) => {
    const { results, instData, employeeFio, employeeRank } = data;
    
    // Calculate total compensation
    const targetResults = results.filter((r: any) => r.comp > 0);
    const totalSum = targetResults.reduce((sum: number, r: any) => sum + r.comp, 0);
    const totalSumStr = totalSum.toFixed(2).replace('.', ',');

    // Decline boss rank and name to Dative case
    const bossRankDative = declineRank(instData.bossRank || "начальник", "dative");
    const bossNameDative = declineFio(instData.bossName || "Иванов И.И.", "dative");
    
    const today = new Date();
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    const dateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()} г.`;

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // Header (Right aligned)
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({ text: "Начальнику", size: 28, font: "Times New Roman" }),
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({ text: `${instData.institution || "Учреждение"} ${instData.region || "регион"}`, size: 28, font: "Times New Roman" }),
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({ text: `${bossRankDative}`, size: 28, font: "Times New Roman" }),
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({ text: `${bossNameDative}`, size: 28, font: "Times New Roman" }),
                    ],
                }),
                new Paragraph({ text: "", spacing: { after: 400 } }), // Blank line

                // Title
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: "РАПОРТ", size: 32, font: "Times New Roman", bold: true }),
                    ],
                }),
                new Paragraph({ text: "", spacing: { after: 200 } }), // Blank line

                // Body
                new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    indent: { firstLine: 720 }, // 1.25 cm indent
                    children: [
                        new TextRun({ 
                            text: "Прошу Вас выплатить мне денежную компенсацию за неполученное вещевое имущество личного пользования в период прохождения службы на сумму ", 
                            size: 28, 
                            font: "Times New Roman" 
                        }),
                        new TextRun({ 
                            text: `${totalSumStr} руб.`, 
                            size: 28, 
                            font: "Times New Roman",
                            bold: true
                        }),
                        new TextRun({ 
                            text: " (подробная справка-расчет прилагается).", 
                            size: 28, 
                            font: "Times New Roman" 
                        }),
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    indent: { firstLine: 720 },
                    spacing: { before: 200 },
                    children: [
                        new TextRun({ 
                            text: "Основание: ч. 2 ст. 69 Федерального закона от 19.07.2018 № 197-ФЗ «О службе в уголовно-исполнительной системе Российской Федерации и о внесении изменений в Закон Российской Федерации «Об учреждениях и органах, исполняющих уголовные наказания в виде лишения свободы», Постановление Правительства РФ от 10.02.2021 г. № 150.", 
                            size: 28, 
                            font: "Times New Roman" 
                        }),
                    ],
                }),
                new Paragraph({ text: "", spacing: { after: 600 } }), // Blank line

                // Application
                new Paragraph({
                    children: [
                        new TextRun({ text: "Приложение: Справка-расчет на 1 л.", size: 28, font: "Times New Roman" }),
                    ],
                }),
                new Paragraph({ text: "", spacing: { after: 600 } }), // Blank line

                // Footer - Employee Info
                new Paragraph({
                    children: [
                        new TextRun({ text: `[Ваша должность] ${instData.institution || "Учреждение"}`, size: 28, font: "Times New Roman" }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: `${instData.region || "регион"}`, size: 28, font: "Times New Roman" }),
                    ],
                }),
                
                // Signature Table
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
                                    children: [new Paragraph({ children: [new TextRun({ text: employeeRank || "Сотрудник", size: 28, font: "Times New Roman" })] })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "____________", size: 28, font: "Times New Roman" })] })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: employeeFio || "ФИО", size: 28, font: "Times New Roman" })] })]
                                }),
                            ]
                        })
                    ]
                }),

                new Paragraph({ text: "", spacing: { after: 200 } }), // Blank line
                new Paragraph({
                    children: [
                        new TextRun({ text: dateStr, size: 28, font: "Times New Roman" }),
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
