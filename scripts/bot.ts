import { Telegraf, Markup } from 'telegraf';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { calculateCore } from '../src/lib/botCalculatorCore';
import { generateExcelHtml } from '../src/lib/exportHelpers';

// Загружаем переменные окружения из .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) {
    console.error("❌ TELEGRAM_BOT_TOKEN не найден в .env.local");
    process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
const supabase = createClient(supabaseUrl, supabaseKey);

const bot = new Telegraf(botToken);

// Команда /start
bot.start(async (ctx) => {
    const payload = ctx.payload; // То, что идет после /start (например: t.me/bot?start=token)
    
    if (payload) {
        ctx.reply("⏳ Проверяю токен привязки...");
        
        try {
            // Ищем пользователя с таким токеном в таблице subscriptions
            const { data: sub, error: searchErr } = await supabase
                .from('subscriptions')
                .select('user_id')
                .eq('telegram_link_token', payload)
                .single();

            if (searchErr || !sub) {
                return ctx.reply("❌ Неверный или устаревший токен привязки.");
            }

            // Привязываем telegram_id и удаляем токен
            const { error: updateErr } = await supabase
                .from('subscriptions')
                .update({ 
                    telegram_id: ctx.from.id.toString(),
                    telegram_link_token: null // Очищаем токен после использования
                })
                .eq('user_id', sub.user_id);

            if (updateErr) throw updateErr;

            ctx.reply("✅ Отлично! Ваш аккаунт успешно привязан. Теперь вы можете использовать команду /my_archive для просмотра своих расчетов.");

        } catch (e) {
            console.error(e);
            ctx.reply("❌ Произошла ошибка при привязке аккаунта.");
        }

    } else {
        ctx.reply(
            "Привет! Я бот FSIN Calc 🧮.\n\n" +
            "Я помогу вам быстро получать доступ к вашим расчетам прямо из мессенджера.\n" +
            "Для начала свяжите свой аккаунт на сайте с Telegram!\n\n" +
            "Команды:\n" +
            "/my_archive - Показать последние расчеты\n" +
            "/calc - Открыть калькулятор",
            Markup.keyboard([
                [Markup.button.webApp('🧮 Открыть калькулятор', 'https://03521a07d8f1c8.lhr.life')]
            ]).resize()
        );
    }
});

// Команда /my_archive
bot.command('my_archive', async (ctx) => {
    ctx.reply("⏳ Ищу ваши расчеты в облачной базе данных Supabase...");
    
    try {
        const telegramId = ctx.from.id.toString();

        // 1. Ищем пользователя по telegram_id
        const { data: sub, error: subErr } = await supabase
            .from('subscriptions')
            .select('user_id, is_pro')
            .eq('telegram_id', telegramId)
            .single();

        if (subErr || !sub) {
            return ctx.reply("❌ Ваш аккаунт не привязан к Telegram.\nЗайдите в Личный кабинет на сайте и нажмите 'Привязать Telegram'.");
        }

        // 2. Ищем расчеты этого пользователя
        const { data, error } = await supabase
            .from('archives')
            .select('*')
            .eq('user_id', sub.user_id)
            .limit(sub.is_pro ? 10 : 3) // PRO видит больше
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            return ctx.reply("Ваш архив пока пуст. Сохраните расчет на сайте!");
        }

        let msg = `Ваши последние расчеты (Найдено: ${data.length}):\n\n`;
        for (let i = 0; i < data.length; i++) {
            const r = data[i];
            const sum = r.item_totals && r.item_totals.comp ? r.item_totals.comp : 0;
            const text = `${i+1}. 👤 ФИО: ${r.employee_fio}\nЗвание: ${r.employee_rank}\n💰 Компенсация: ${sum.toLocaleString('ru-RU')} руб.`;
            
            if (sub.is_pro) {
                await ctx.reply(text, Markup.inlineKeyboard([
                    [Markup.button.callback('⬇️ На выплату', `xls_comp_${r.id}`), Markup.button.callback('⬇️ На удержание', `xls_ded_${r.id}`)]
                ]));
            } else {
                await ctx.reply(text);
            }
        }

        if (!sub.is_pro) {
            await ctx.reply("⭐️ Перейдите на PRO, чтобы бот мог выгружать Excel-справки прямо в чат!");
        }

    } catch (e) {
        console.error(e);
        ctx.reply("❌ Произошла ошибка при доступе к базе данных.");
    }
});

bot.command('calc', (ctx) => {
    ctx.reply("Нажмите на кнопку ниже, чтобы открыть калькулятор:", Markup.keyboard([
        [Markup.button.webApp('🧮 Открыть калькулятор', 'https://03521a07d8f1c8.lhr.life')]
    ]).resize());
});

// Обработка нажатий на кнопки скачивания Excel
bot.action(/xls_(comp|ded)_(.+)/, async (ctx) => {
    try {
        const type = ctx.match[1];
        const archiveId = ctx.match[2];
        
        await ctx.answerCbQuery('Генерирую Excel файл...');
        
        const { data: record, error } = await supabase
            .from('archives')
            .select('*')
            .eq('id', archiveId)
            .single();
            
        if (error || !record) throw new Error('Запись не найдена');

        // Прогоняем данные через чистое математическое ядро
        const calculated = calculateCore({
            periods: record.periods,
            gender: record.gender,
            itemTotals: record.item_totals,
            customPrices: record.custom_prices,
            dismissalGroup: record.dismissal_group,
            dismissalDate: record.dism_date
        });

        const exportData = {
            results: calculated.results,
            instData: { institution: 'Учреждение', region: 'Регион' }, // В будущем можно сохранять instData в архив
            employeeFio: record.employee_fio,
            employeeRank: record.employee_rank,
            dismissalDate: record.dism_date
        };

        const htmlString = generateExcelHtml(type, exportData);
        
        // Превращаем строку в буфер (файл)
        const buffer = Buffer.from(htmlString, 'utf-8');
        
        const filename = type === 'comp' ? `Kompensaciya_${record.employee_fio}.xls` : `Uderzhanie_${record.employee_fio}.xls`;
        
        await ctx.replyWithDocument({
            source: buffer,
            filename: filename
        });

    } catch (e) {
        console.error(e);
        await ctx.answerCbQuery('Ошибка генерации файла', { show_alert: true });
    }
});

bot.on('web_app_data', async (ctx) => {
    try {
        const dataStr = ctx.message.web_app_data.data;
        const payload = JSON.parse(dataStr);
        
        ctx.reply("⏳ Принял расчет! Генерирую Excel файлы...");

        const calculated = calculateCore({
            periods: payload.periods,
            gender: payload.gender,
            itemTotals: payload.itemTotals || {},
            customPrices: payload.customPrices || {},
            dismissalGroup: payload.dismissalGroup,
            dismissalDate: payload.dismDate
        });

        const exportData = {
            results: calculated.results,
            instData: payload.instData || { institution: 'Учреждение', region: 'Регион' },
            employeeFio: payload.employeeFio || 'Сотрудник',
            employeeRank: payload.employeeRank || '',
            dismissalDate: payload.dismDate
        };

        const htmlComp = generateExcelHtml('comp', exportData);
        const htmlDed = generateExcelHtml('ded', exportData);
        
        const bufComp = Buffer.from(htmlComp, 'utf-8');
        const bufDed = Buffer.from(htmlDed, 'utf-8');
        
        await ctx.replyWithDocument({ source: bufComp, filename: `Kompensaciya_${exportData.employeeFio}.xls` });
        await ctx.replyWithDocument({ source: bufDed, filename: `Uderzhanie_${exportData.employeeFio}.xls` });

    } catch (e) {
        console.error(e);
        ctx.reply("❌ Произошла ошибка при генерации файлов. Убедитесь, что все поля заполнены.");
    }
});

bot.on('text', (ctx) => {
    ctx.reply("Я понимаю только команды. Нажмите /start или /my_archive.");
});

bot.launch().then(() => {
    console.log("=========================================");
    console.log("🚀 Telegram Bot запущен в режиме Long-Polling!");
    console.log("=========================================");
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
