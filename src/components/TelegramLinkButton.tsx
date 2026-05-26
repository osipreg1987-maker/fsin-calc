"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Loader2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function TelegramLinkButton() {
    const { user, subscription } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    
    // Если Telegram уже привязан, показываем галочку
    const isLinked = subscription?.telegram_id ? true : false;

    const handleLink = async () => {
        if (!user) return;
        setIsLoading(true);
        
        try {
            // Запрашиваем генерацию токена
            const res = await fetch('/api/telegram/link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });
            
            const data = await res.json();
            
            if (data.token) {
                // Перенаправляем пользователя в телеграм с токеном
                // Для теста используем нашего локального бота
                window.open(`https://t.me/fsin_calc_bot?start=${data.token}`, '_blank');
            } else {
                alert("Ошибка генерации ссылки");
            }
        } catch (e) {
            console.error(e);
            alert("Произошла ошибка");
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    if (isLinked) {
        return (
            <div className="bg-sky-500/10 border border-sky-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sky-400 text-xs font-medium">
                <Check size={14} /> Telegram привязан
            </div>
        );
    }

    return (
        <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={handleLink}
            disabled={isLoading}
            className="flex items-center gap-2 bg-[#0088cc] hover:bg-[#0077b3] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-lg disabled:opacity-50"
        >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <MessageCircle size={14} />}
            Привязать Telegram
        </motion.button>
    );
}
