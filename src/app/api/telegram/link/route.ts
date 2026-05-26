import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Необходим userId" }, { status: 400 });
        }

        // Генерируем случайный короткий токен (Deep-link)
        const token = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);

        // Сохраняем токен в базу данных для этого пользователя
        const { error } = await supabase
            .from('subscriptions')
            .update({ telegram_link_token: token })
            .eq('user_id', userId);

        if (error) {
            console.error("Ошибка обновления токена:", error);
            return NextResponse.json({ error: "Ошибка базы данных" }, { status: 500 });
        }

        return NextResponse.json({ token });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
    }
}
