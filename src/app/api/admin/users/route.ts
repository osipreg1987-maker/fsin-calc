import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// ИСПОЛЬЗУЕМ SERVICE_ROLE КЛЮЧ ДЛЯ АДМИНСКИХ ПРАВ!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Захардкоженный список админов (потом можно вынести в .env)
const ADMIN_EMAILS = ['osipreg.1987@gmail.com'];

export async function GET(req: Request) {
    try {
        // Проверка авторизации: получаем токен пользователя, делающего запрос
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Проверяем, является ли пользователь админом
        if (!ADMIN_EMAILS.includes(user.email || '')) {
            return NextResponse.json({ error: 'Forbidden. You are not an admin.' }, { status: 403 });
        }

        // 1. Получаем список всех аккаунтов (из auth.users)
        // Внимание: метод listUsers() работает только с SERVICE_ROLE ключом
        const { data: authData, error: listError } = await supabase.auth.admin.listUsers();
        
        if (listError) {
            throw listError;
        }

        // 2. Получаем данные из таблицы subscriptions
        const { data: subsData, error: subsError } = await supabase
            .from('subscriptions')
            .select('*');

        if (subsError) {
            throw subsError;
        }

        // 3. Объединяем данные
        const combinedUsers = authData.users.map(u => {
            const sub = subsData.find(s => s.user_id === u.id);
            return {
                id: u.id,
                email: u.email,
                created_at: u.created_at,
                last_sign_in_at: u.last_sign_in_at,
                is_pro: sub ? sub.is_pro : false,
                pro_until: sub ? sub.pro_until : null,
                telegram_id: sub ? sub.telegram_id : null,
                pro_calculations_made: sub ? sub.pro_calculations_made : 0,
                guaranteed_calculations: sub ? sub.guaranteed_calculations : 0,
            };
        });

        // 4. Сортируем по дате регистрации (сначала новые)
        combinedUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return NextResponse.json({ users: combinedUsers });
    } catch (error: any) {
        console.error('Admin API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
