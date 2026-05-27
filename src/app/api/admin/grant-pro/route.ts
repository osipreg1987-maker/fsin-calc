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
        const { targetUserId, action } = body;

        if (!targetUserId || !action) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        let updateData = {};
        if (action === 'grant') {
            // Выдаем PRO на 30 дней от текущего момента
            const until = new Date();
            until.setDate(until.getDate() + 30);
            updateData = { is_pro: true, pro_until: until.toISOString() };
        } else if (action === 'revoke') {
            updateData = { is_pro: false, pro_until: null };
        }

        const { data, error } = await supabase
            .from('subscriptions')
            .update(updateData)
            .eq('user_id', targetUserId)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, user: data });
    } catch (error: any) {
        console.error('Admin Grant Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
