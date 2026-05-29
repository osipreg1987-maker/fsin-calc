import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
const supabase = createClient(supabaseUrl, supabaseKey);

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const supportChatId = '-4857440327';

export async function POST(req: Request) {
    try {
        if (!botToken) {
            return NextResponse.json({ ok: false, error: 'Telegram Bot Token is not configured' }, { status: 500 });
        }

        const { name, contact, message, sessionId } = await req.json();

        if (!name || !contact || !message || !sessionId) {
            return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Ищем или создаем чат поддержки для этой сессии
        let { data: chat, error: chatError } = await supabase
            .from('support_chats')
            .select('*')
            .eq('session_id', sessionId)
            .maybeSingle();

        if (chatError) {
            console.error('Error fetching support chat:', chatError);
        }

        if (!chat) {
            // Создаем новый чат
            const { data: newChat, error: createChatError } = await supabase
                .from('support_chats')
                .insert({
                    session_id: sessionId,
                    user_name: name,
                    user_contact: contact
                })
                .select()
                .single();

            if (createChatError || !newChat) {
                console.error('Error creating support chat:', createChatError);
                return NextResponse.json({ ok: false, error: 'Failed to initialize chat session' }, { status: 500 });
            }
            chat = newChat;
        } else {
            // Чат существует, обновляем имя, контакт и время последнего сообщения
            await supabase
                .from('support_chats')
                .update({
                    user_name: name,
                    user_contact: contact,
                    last_message_at: new Date().toISOString()
                })
                .eq('id', chat.id);
        }

        // 2. Сохраняем сообщение пользователя в базе данных
        const { data: newMsg, error: msgError } = await supabase
            .from('support_messages')
            .insert({
                chat_id: chat.id,
                sender: 'user',
                text: message
            })
            .select()
            .single();

        if (msgError) {
            console.error('Error saving support message:', msgError);
            return NextResponse.json({ ok: false, error: 'Failed to save message' }, { status: 500 });
        }

        // 3. Отправляем сообщение в Telegram админ-группу через простой fetch
        const safeName = String(name).replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const safeContact = String(contact).replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const safeMessage = String(message).replace(/</g, '&lt;').replace(/>/g, '&gt;');

        const tgText = `🌐 <b>Обращение с сайта</b> #chat_${chat.id}\n\n` +
                       `👤 <b>Имя:</b> ${safeName}\n` +
                       `✉️ <b>Связь:</b> ${safeContact}\n` +
                       `💬 <b>Вопрос:</b> ${safeMessage}`;

        const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: supportChatId,
                text: tgText,
                parse_mode: 'HTML'
            })
        });

        if (!tgRes.ok) {
            const errBody = await tgRes.text();
            console.error('Failed to send telegram notification:', errBody);
        }

        return NextResponse.json({ ok: true, message: newMsg });
    } catch (e) {
        console.error('API support error:', e);
        return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
    }
}
