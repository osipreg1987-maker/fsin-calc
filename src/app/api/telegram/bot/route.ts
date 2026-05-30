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

            // Сначала отвязываем этот telegram_id от всех других аккаунтов, чтобы не было дублей
            await supabase
                .from('subscriptions')
                .update({ telegram_id: null })
                .eq('telegram_id', ctx.from.id.toString());

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
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fsin-calculator.ru';
        const webAppUrl = `${baseUrl}/calc`;
        const mainMenu = Markup.keyboard([
            [Markup.button.webApp('🧮 Открыть калькулятор', webAppUrl)],
            ['📂 Мои расчеты', '❓ Частые вопросы'],
            ['🎧 Поддержка', '📄 Шаблон рапорта']
        ]).resize();
        
        ctx.reply(
            "Привет! Я бот FSIN Calc 🧮.\n\n" +
            "Я помогу вам быстро получать доступ к вашим расчетам прямо из мессенджера.\n" +
            "Для начала свяжите свой аккаунт на сайте с Telegram!\n\n" +
            "Команды:\n" +
            "/my_archive - Показать последние расчеты\n" +
            "/calc - Открыть калькулятор",
            mainMenu
        );
    }
});

// Команда /my_archive и кнопка
const handleArchive = async (ctx: any) => {
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
            const calculated = calculateCore({
                periods: r.periods || [],
                gender: r.gender || 'M',
                itemTotals: r.item_totals || {},
                customPrices: r.custom_prices || {},
                dismissalGroup: r.dismissal_group || 'V',
                dismissalDate: r.dism_date || ''
            });
            const sum = calculated.totalComp || 0;
            const text = `${i+1}. 👤 ФИО: ${r.employee_fio}\nЗвание: ${r.employee_rank}\n💰 Компенсация: ${sum.toLocaleString('ru-RU')} руб.`;
            
            if (sub.is_pro) {
                await ctx.reply(text, Markup.inlineKeyboard([
                    [Markup.button.callback('⬇️ На выплату', `xls_comp_${r.id}`), Markup.button.callback('⬇️ На удержание', `xls_ded_${r.id}`)],
                    [Markup.button.callback('⬇️ Обоснование', `xls_b2c-comp_${r.id}`)]
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
};

bot.command('my_archive', handleArchive);
bot.hears('📂 Мои расчеты', handleArchive);

// Частые вопросы (FAQ)
bot.hears('❓ Частые вопросы', (ctx) => {
    const faqText = `
*❓ Частые вопросы (FAQ)*

*1. На основании чего производится расчет?*
Все расчеты ведутся строго в соответствии с Приказами ФСИН России (в частности, приказ по нормам снабжения вещевым имуществом).

*2. Почему калькулятор считает именно так?*
Логика калькулятора учитывает сроки носки каждого предмета одежды и высчитывает положенное количество или компенсацию пропорционально отслуженному времени в каждом периоде.

*3. Как выгрузить расчет в Excel?*
Для этого вам необходим PRO-статус. Нажмите "📂 Мои расчеты" в этом боте, и под каждым вашим сохраненным расчетом появятся кнопки для скачивания готовой справки (на выплату или удержание).

*Остались вопросы? Нажмите кнопку «🎧 Поддержка» ниже!*
`;
    ctx.reply(faqText, { parse_mode: 'Markdown' });
});

// Кнопка поддержки
bot.hears('🎧 Поддержка', (ctx) => {
    ctx.reply("Напишите ваш вопрос прямо в этот чат, и наши специалисты ответят вам в ближайшее время! 👇");
});

// Шаблон рапорта
bot.hears('📄 Шаблон рапорта', async (ctx) => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fsin-calculator.ru';
    const fileUrl = `${baseUrl}/Рапорт_на_компенсацию.docx`;
    try {
        await ctx.replyWithDocument(
            { url: fileUrl, filename: 'Рапорт_на_компенсацию.docx' },
            { caption: 'Вот ваш шаблон рапорта на компенсацию!' }
        );
    } catch (e) {
        ctx.reply("❌ Не удалось отправить файл. Попробуйте скачать его на сайте.");
    }
});

// Рассылка (только для админа)
bot.command('broadcast', async (ctx) => {
    if (ctx.from.id.toString() !== '1654211029') return;
    
    // @ts-ignore
    const text = ctx.message.text.replace('/broadcast', '').trim();
    if (!text) return ctx.reply('Использование: /broadcast Ваш текст рассылки');
    
    const { data } = await supabase.from('subscriptions').select('telegram_id').not('telegram_id', 'is', null);
    if (!data || data.length === 0) return ctx.reply('Нет привязанных пользователей.');
    
    ctx.reply(`⏳ Начинаю рассылку для ${data.length} пользователей...`);
    let sent = 0;
    for (const row of data) {
        try {
            await ctx.telegram.sendMessage(row.telegram_id, `📢 **Новое уведомление**\n\n${text}`, { parse_mode: 'Markdown' });
            sent++;
        } catch(e) {}
    }
    ctx.reply(`✅ Рассылка завершена. Доставлено: ${sent} из ${data.length}`);
});

// Команда /calc
bot.command('calc', (ctx) => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fsin-calculator.ru';
    const webAppUrl = `${baseUrl}/calc`;
    const mainMenu = Markup.keyboard([
        [Markup.button.webApp('🧮 Открыть калькулятор', webAppUrl)],
        ['📂 Мои расчеты', '❓ Частые вопросы'],
        ['🎧 Поддержка', '📄 Шаблон рапорта']
    ]).resize();
    ctx.reply("Нажмите на кнопку ниже, чтобы открыть калькулятор:", mainMenu);
});

// Скачивание Excel из архива (Callback Query)
bot.action(/xls_(comp|ded|b2c-comp)_(.+)/, async (ctx) => {
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

        const htmlString = generateExcelHtml(type as 'comp'|'ded'|'b2c-comp', exportData);
        const buffer = Buffer.from(htmlString, 'utf-8');
        
        let filename = `Spravka_${record.employee_fio}.xls`;
        if (type === 'comp') filename = `Kompensaciya_${record.employee_fio}.xls`;
        else if (type === 'ded') filename = `Uderzhanie_${record.employee_fio}.xls`;
        else if (type === 'b2c-comp') filename = `Obosnovanie_${record.employee_fio}.xls`;
        
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
        
        ctx.reply("⏳ Принял расчет! Сохраняю в архив и генерирую Excel файлы...");

        const telegramId = ctx.from.id.toString();
        
        // Пытаемся найти пользователя и сохранить расчет в его облачный архив
        try {
            const { data: sub } = await supabase
                .from('subscriptions')
                .select('user_id')
                .eq('telegram_id', telegramId)
                .single();

            if (sub && sub.user_id) {
                await supabase.from('archives').insert({
                    user_id: sub.user_id,
                    employee_fio: payload.employeeFio || 'Сотрудник',
                    employee_rank: payload.employeeRank || '',
                    dismissal_group: payload.dismissalGroup || '1',
                    dism_date: payload.dismDate,
                    gender: payload.gender || 'male',
                    periods: payload.periods || [],
                    item_totals: payload.itemTotals || {},
                    custom_prices: payload.customPrices || {}
                });
            }
        } catch (e) {
            console.error("Ошибка при сохранении в архив:", e);
        }

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
        const htmlB2c = generateExcelHtml('b2c-comp', exportData);
        
        const bufComp = Buffer.from(htmlComp, 'utf-8');
        const bufDed = Buffer.from(htmlDed, 'utf-8');
        const bufB2c = Buffer.from(htmlB2c, 'utf-8');
        
        await ctx.replyWithDocument({ source: bufComp, filename: `Kompensaciya_${exportData.employeeFio}.xls` });
        await ctx.replyWithDocument({ source: bufDed, filename: `Uderzhanie_${exportData.employeeFio}.xls` });
        await ctx.replyWithDocument({ source: bufB2c, filename: `Obosnovanie_${exportData.employeeFio}.xls` });

    } catch (e) {
        console.error(e);
        ctx.reply("❌ Произошла ошибка при генерации файлов. Убедитесь, что все поля заполнены.");
    }
});

// Перехват сообщений (Поддержка)
bot.on('message', async (ctx) => {
    const supportChatId = '-4857440327';

    // 1. Если сообщение пришло из группы поддержки
    if (ctx.chat && ctx.chat.id.toString() === supportChatId) {
        // @ts-ignore
        const replyMsg = ctx.message.reply_to_message;
        if (replyMsg) {
            const textOrCaption = ('text' in replyMsg ? replyMsg.text : ('caption' in replyMsg ? replyMsg.caption : '')) || '';
            
            // 1.1 Если ответ на обращение с сайта (#chat_UUID)
            const chatMatch = textOrCaption.match(/#chat_([a-f0-9\-]+)/);
            if (chatMatch) {
                const targetChatId = chatMatch[1];
                try {
                    // @ts-ignore
                    const adminText = 'text' in ctx.message ? ctx.message.text : '';
                    if (!adminText) {
                        return ctx.reply('❌ Ответ на сайт пока поддерживает только текстовые сообщения.');
                    }
                    
                    const { error } = await supabase
                        .from('support_messages')
                        .insert({
                            chat_id: targetChatId,
                            sender: 'admin',
                            text: adminText
                        });
                        
                    if (error) {
                        console.error('Error saving admin reply to Supabase:', error);
                        ctx.reply('❌ Ошибка записи ответа в базу данных.');
                    }
                } catch (e) {
                    console.error('Error handling website support reply:', e);
                    ctx.reply('❌ Не удалось доставить ответ на сайт.');
                }
                return;
            }

            const match = textOrCaption.match(/#user(\d+)/);
            if (match) {
                const targetUserId = match[1];
                try {
                    // @ts-ignore
                    if ('text' in ctx.message) {
                        // @ts-ignore
                        await ctx.telegram.sendMessage(targetUserId, `🎧 **Ответ службы поддержки:**\n\n${ctx.message.text}`, { parse_mode: 'Markdown' });
                    } else {
                        await ctx.telegram.sendMessage(targetUserId, `🎧 **Ответ службы поддержки:**`, { parse_mode: 'Markdown' });
                        await ctx.copyMessage(targetUserId);
                    }
                } catch(e) {
                    ctx.reply('❌ Ошибка: не удалось отправить сообщение пользователю (возможно, он заблокировал бота).');
                }
            }
        }
        return; // Больше в группе ничего не обрабатываем
    }

    // 2. Если сообщение пришло в личку боту (вопрос в поддержку)
    if (ctx.chat && ctx.chat.type === 'private') {
        // @ts-ignore
        if ('text' in ctx.message && ctx.message.text.startsWith('/')) return; // игнорируем команды

        const userInfo = `#user${ctx.from.id}\n👤 ${ctx.from.first_name || 'Пользователь'} (@${ctx.from.username || 'нет_юзернейма'})`;
        
        try {
            // @ts-ignore
            if ('text' in ctx.message) {
                // @ts-ignore
                await ctx.telegram.sendMessage(supportChatId, `${userInfo}\n\n💬 ${ctx.message.text}`);
            // @ts-ignore
            } else if ('photo' in ctx.message || 'document' in ctx.message) {
                // @ts-ignore
                const caption = ctx.message.caption ? `\n\n💬 ${ctx.message.caption}` : '';
                await ctx.telegram.sendMessage(supportChatId, `${userInfo}${caption}`);
                await ctx.copyMessage(supportChatId);
            }
            
            ctx.reply("✅ Ваше сообщение отправлено в службу поддержки! Мы ответим вам в этом чате.");
        } catch (e) {
            console.error(e);
            ctx.reply("❌ Произошла ошибка при отправке сообщения в поддержку.");
        }
    }
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
