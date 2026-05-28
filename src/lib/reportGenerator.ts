import { Document, Paragraph, TextRun, Packer, AlignmentType, HeadingLevel } from "docx";
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
    
    // Employee rank and name in Nominative case (or Genitive depending on style, usually "от кого: от старшего лейтенанта", but often just "старший лейтенант Осипов А.А.")
    // Let's use Genitive for the header "от кого"
    const employeeRankGenitive = declineRank(employeeRank || "сотрудник", "genitive");
    const employeeFioGenitive = declineFio(employeeFio || "Сотрудник С.С.", "genitive");

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // Header (Right aligned)
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({ text: "Начальнику", size: 24, font: "Times New Roman" }),
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({ text: `${instData.institution} ${instData.region}`, size: 24, font: "Times New Roman" }),
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({ text: `${bossRankDative}`, size: 24, font: "Times New Roman" }),
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({ text: `${bossNameDative}`, size: 24, font: "Times New Roman" }),
                    ],
                }),
                new Paragraph({ text: "", spacing: { after: 200 } }), // Blank line
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({ text: "от", size: 24, font: "Times New Roman" }),
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({ text: `${employeeRankGenitive}`, size: 24, font: "Times New Roman" }),
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({ text: `${employeeFioGenitive}`, size: 24, font: "Times New Roman" }),
                    ],
                }),
                new Paragraph({ text: "", spacing: { after: 400 } }), // Blank line

                // Title
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    heading: HeadingLevel.HEADING_1,
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

                // Footer
                new Paragraph({
                    children: [
                        new TextRun({ text: `${employeeRank || "Сотрудник"}`, size: 28, font: "Times New Roman" }),
                    ],
                }),
                new Paragraph({ text: "", spacing: { after: 200 } }), // Blank line
                new Paragraph({
                    alignment: AlignmentType.LEFT,
                    children: [
                        new TextRun({ text: "____________________ / ____________________ /", size: 28, font: "Times New Roman" }),
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.LEFT,
                    children: [
                        new TextRun({ text: "(подпись)                              (ФИО)", size: 20, font: "Times New Roman" }),
                    ],
                }),
                new Paragraph({ text: "", spacing: { after: 200 } }), // Blank line
                new Paragraph({
                    children: [
                        new TextRun({ text: `"_____" ______________ 20___ г.`, size: 28, font: "Times New Roman" }),
                    ],
                }),
            ],
        }],
    });

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "Рапорт_на_компенсацию.docx");
    });
};
