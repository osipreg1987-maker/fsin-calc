import { NextResponse } from 'next/server';
import { Telegraf, Markup } from 'telegraf';
import { createClient } from '@supabase/supabase-js';
import { calculateCore } from '@/lib/botCalculatorCore';
import { generateExcelHtml } from '@/lib/exportHelpers';

const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) {
    throw new Error("TELEGRAM_BOT_TOKEN is not defined");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
const supabase = createClient(supabaseUrl, supabaseKey);

const bot = new Telegraf(botToken);

// ========================
// ЛОГИКА БОТА
// ========================

// Команда /start
bot.start(async (ctx) => {
    const payload = ctx.payload;
    
    if (payload) {
        ctx.reply("⏳ Проверяю токен привязки...");
        try {
            const { data: sub, error: searchErr } = await supabase
                .from('subscriptions')
                .select('user_id')
                .eq('telegram_link_token', payload)
                .single();

            if (searchErr || !sub) {
                return ctx.reply("❌ Неверный или устаревший токен привязки.");
            }

            const { data: updateData, error: updateErr } = await supabase
                .from('subscriptions')
                .update({ 
                    telegram_id: ctx.from.id.toString(),
                    telegram_link_token: null 
                })
                .eq('user_id', sub.user_id)
                .select();

            if (updateErr) {
                return ctx.reply("❌ Ошибка обновления: " + JSON.stringify(updateErr));
            }
            if (!updateData || updateData.length === 0) {
                return ctx.reply("❌ Права доступа (RLS) заблокировали запись. Проверьте SUPABASE_SERVICE_ROLE_KEY в Vercel.");
            }

            ctx.reply("✅ Отлично! Ваш аккаунт успешно привязан. Теперь вы можете использовать команду /my_archive для просмотра своих расчетов.");
        } catch (e) {
            console.error(e);
            ctx.reply("❌ Произошла ошибка: " + String(e));
        }
    } else {
        const webAppUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fsin-calc.vercel.app';
        ctx.reply(
            "Привет! Я бот FSIN Calc 🧮.\n\n" +
            "Я помогу вам быстро получать доступ к вашим расчетам прямо из мессенджера.\n" +
            "Для начала свяжите свой аккаунт на сайте с Telegram!\n\n" +
            "Команды:\n" +
            "/my_archive - Показать последние расчеты\n" +
            "/calc - Открыть калькулятор",
            Markup.keyboard([
                [Markup.button.webApp('🧮 Открыть калькулятор', webAppUrl)]
            ]).resize()
        );
    }
});

// Команда /my_archive
bot.command('my_archive', async (ctx) => {
    ctx.reply("⏳ Ищу ваши расчеты в облачной базе данных Supabase...");
    try {
        const telegramId = ctx.from.id.toString();

        const { data: sub, error: subErr } = await supabase
            .from('subscriptions')
            .select('user_id, is_pro')
            .eq('telegram_id', telegramId)
            .single();

        if (subErr || !sub) {
            return ctx.reply("❌ Ваш аккаунт не привязан к Telegram.\nЗайдите в Личный кабинет на сайте и нажмите 'Привязать Telegram'.");
        }

        const { data, error } = await supabase
            .from('archives')
            .select('*')
            .eq('user_id', sub.user_id)
            .limit(sub.is_pro ? 10 : 3)
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

// Команда /calc
bot.command('calc', (ctx) => {
    const webAppUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fsin-calc.vercel.app';
    ctx.reply("Нажмите на кнопку ниже, чтобы открыть калькулятор:", Markup.keyboard([
        [Markup.button.webApp('🧮 Открыть калькулятор', webAppUrl)]
    ]).resize());
});

// Скачивание Excel из архива (Callback Query)
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
            instData: { institution: 'Учреждение', region: 'Регион' },
            employeeFio: record.employee_fio,
            employeeRank: record.employee_rank,
            dismissalDate: record.dism_date
        };

        const htmlString = generateExcelHtml(type as 'comp'|'ded', exportData);
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

// Данные из Telegram Web App
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

// ========================
// NEXT.JS API ROUTES HANDLERS
// ========================

// Обработчик Webhooks (Telegram шлет сюда POST запросы)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        // Передаем тело запроса в Telegraf
        await bot.handleUpdate(body);
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ ok: false, error: 'Failed to process webhook' }, { status: 500 });
    }
}

// Вспомогательный роут: дерните его в браузере (GET /api/telegram/bot) чтобы зарегистрировать webhook
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const domain = process.env.NEXT_PUBLIC_SITE_URL || `${url.protocol}//${url.host}`;
        const webhookUrl = `${domain}/api/telegram/bot`;

        // Говорим Telegram'у: "шли обновления на этот URL"
        await bot.telegram.setWebhook(webhookUrl);
        
        return NextResponse.json({ 
            ok: true, 
            message: `Webhook successfully set to ${webhookUrl}` 
        });
    } catch (error) {
        return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
    }
}
