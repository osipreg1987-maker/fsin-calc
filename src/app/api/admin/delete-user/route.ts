import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_EMAILS = ['osipreg.1987@gmail.com'];

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        
        if (authError || !user || !ADMIN_EMAILS.includes(user.email || '')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const { targetUserId } = body;

        if (!targetUserId) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        // 1. Удаляем архивы пользователя
        const { error: arcErr } = await supabase
            .from('archives')
            .delete()
            .eq('user_id', targetUserId);
            
        if (arcErr) console.error("Error deleting archives:", arcErr);

        // 2. Удаляем подписку
        const { error: subErr } = await supabase
            .from('subscriptions')
            .delete()
            .eq('user_id', targetUserId);
            
        if (subErr) console.error("Error deleting subscription:", subErr);

        // 3. Удаляем пользователя из auth.users
        const { error: deleteErr } = await supabase.auth.admin.deleteUser(targetUserId);
        
        if (deleteErr) {
            throw deleteErr;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Admin Delete User Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
