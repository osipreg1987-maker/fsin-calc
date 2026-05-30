// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, X, Send, MessageSquare, Loader2, Mail, User, HelpCircle, CornerDownLeft } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function SupportWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [chat, setChat] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    
    // Onboarding Form States
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [firstMessage, setFirstMessage] = useState('');
    
    // Active Chat States
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    // 1. Инициализация сессии из localStorage
    useEffect(() => {
        const storedSession = localStorage.getItem('support_session_id');
        if (storedSession) {
            setSessionId(storedSession);
            loadChatAndMessages(storedSession);
        } else {
            // Создаем новый уникальный session_id, но пока не сохраняем в базу (до первой отправки)
            const newSession = 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            setSessionId(newSession);
        }
    }, []);

    // 2. Скролл к последнему сообщению
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // 3. Сброс индикатора непрочитанных сообщений при открытии
    useEffect(() => {
        if (isOpen) {
            setHasUnread(false);
        }
    }, [isOpen]);

    // 4. Загрузка чата и сообщений из базы данных
    const loadChatAndMessages = async (sessId: string) => {
        try {
            const { data: chatData, error: chatErr } = await supabase
                .from('support_chats')
                .select('*')
                .eq('session_id', sessId)
                .maybeSingle();

            if (chatErr) throw chatErr;

            if (chatData) {
                setChat(chatData);
                // Подтягиваем имя и контакты для формы, если сессия восстановилась
                setName(chatData.user_name);
                setContact(chatData.user_contact);

                const { data: msgs, error: msgsErr } = await supabase
                    .from('support_messages')
                    .select('*')
                    .eq('chat_id', chatData.id)
                    .order('created_at', { ascending: true });

                if (msgsErr) throw msgsErr;
                setMessages(msgs || []);
            }
        } catch (e) {
            console.error('Ошибка загрузки истории поддержки:', e);
        }
    };

    // 5. Подписка на Supabase Realtime для получения ответов админа
    useEffect(() => {
        if (!chat?.id) return;

        const channel = supabase
            .channel(`support_messages_chat_${chat.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'support_messages',
                filter: `chat_id=eq.${chat.id}`
            }, (payload) => {
                const newMsg = payload.new;
                setMessages((prev) => {
                    if (prev.some(m => m.id === newMsg.id)) return prev;
                    return [...prev, newMsg];
                });

                if (newMsg.sender === 'admin') {
                    // Звуковое оповещение о новом сообщении
                    try {
                        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2357/2357-84.wav');
                        audio.volume = 0.3;
                        audio.play();
                    } catch (e) {}

                    if (!isOpen) {
                        setHasUnread(true);
                    }
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [chat?.id, isOpen]);

    // 6. Первая отправка: создание сессии чата и отправка первого сообщения
    const handleFirstSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !contact.trim() || !firstMessage.trim() || !sessionId) return;

        setIsInitializing(true);
        try {
            const res = await fetch('/api/support/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    contact,
                    message: firstMessage,
                    sessionId
                })
            });

            const data = await res.json();
            if (data.ok) {
                // Сохраняем сессию в localStorage, так как чат успешно инициализирован
                localStorage.setItem('support_session_id', sessionId);
                await loadChatAndMessages(sessionId);
                setFirstMessage('');
            } else {
                alert('Не удалось отправить сообщение: ' + (data.error || 'ошибка сервера'));
            }
        } catch (e) {
            console.error(e);
            alert('Произошла ошибка при отправке обращения.');
        } finally {
            setIsInitializing(false);
        }
    };

    // 7. Обычная отправка сообщений в активном чате
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !chat || isSending) return;

        const textToSend = newMessage;
        setNewMessage('');
        setIsSending(true);

        // Оптимистичное обновление интерфейса
        const tempId = 'temp_' + Date.now();
        setMessages(prev => [...prev, {
            id: tempId,
            chat_id: chat.id,
            sender: 'user',
            text: textToSend,
            created_at: new Date().toISOString()
        }]);

        try {
            const res = await fetch('/api/support/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: chat.user_name,
                    contact: chat.user_contact,
                    message: textToSend,
                    sessionId: chat.session_id
                })
            });

            const data = await res.json();
            if (data.ok) {
                // Заменяем оптимистичное сообщение на реальное
                setMessages(prev => prev.map(m => m.id === tempId ? data.message : m));
            } else {
                // В случае ошибки удаляем временное
                setMessages(prev => prev.filter(m => m.id !== tempId));
                setNewMessage(textToSend); // возвращаем текст в инпут
                alert('Ошибка отправки сообщения');
            }
        } catch (e) {
            console.error(e);
            setMessages(prev => prev.filter(m => m.id !== tempId));
            setNewMessage(textToSend);
            alert('Сетевая ошибка при отправке сообщения');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans select-none">
            {/* Анимированный триггер чата (Увеличенная заметная кнопка-капсула) */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`relative flex items-center justify-center text-white cursor-pointer shadow-lg transition-all duration-300 ${
                    isOpen 
                        ? 'w-12 h-12 rounded-full bg-rose-500 hover:bg-rose-600 shadow-rose-500/20' 
                        : 'h-12 px-5 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-[0_0_20px_rgba(79,70,229,0.35)] flex items-center gap-2 border border-indigo-500/20'
                }`}
            >
                {/* Эффект пульсирующего свечения вокруг кнопки */}
                {!isOpen && (
                    <span className="absolute -inset-1 rounded-full bg-blue-500/25 animate-pulse pointer-events-none" />
                )}

                {/* Непрочитанные сообщения */}
                {hasUnread && !isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border border-slate-900 text-[9px] font-bold items-center justify-center">1</span>
                    </span>
                )}

                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X size={20} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider"
                        >
                            <Headphones size={16} />
                            <span>Поддержка</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Окно чата */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute bottom-20 right-0 w-[350px] sm:w-[380px] h-[520px] bg-slate-950/85 backdrop-blur-2xl border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                    >
                        {/* Шапка чата */}
                        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 pb-6 flex items-center justify-between relative">
                            {/* Фоновый шум/эффект */}
                            <div className="absolute inset-0 bg-white/5 pointer-events-none" />
                            
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                                        <Headphones size={20} className="text-white" />
                                    </div>
                                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-400 border border-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">Служба поддержки</h3>
                                    <p className="text-xs text-blue-200">Отвечаем прямо здесь в реальном времени</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-xl transition-all relative z-10 cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Тело чата */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 flex flex-col justify-between select-text scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                            {!chat ? (
                                /* ОНБОРДИНГ ФОРМА (ПЕРВЫЙ КОНТАКТ) */
                                <motion.form 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onSubmit={handleFirstSubmit}
                                    className="space-y-4 my-auto"
                                >
                                    <div className="text-center space-y-2 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                                            <HelpCircle size={24} />
                                        </div>
                                        <h4 className="font-bold text-slate-100 text-base">Как мы можем помочь?</h4>
                                        <p className="text-xs text-slate-400 max-w-[80%] mx-auto">
                                            Напишите ваш вопрос и контактные данные. Мы ответим вам прямо в этом чате.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        {/* Имя */}
                                        <div className="relative">
                                            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input 
                                                type="text" 
                                                required
                                                placeholder="Ваше имя" 
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                            />
                                        </div>

                                        {/* Контакты */}
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input 
                                                type="text" 
                                                required
                                                placeholder="Email или Telegram (@username)" 
                                                value={contact}
                                                onChange={(e) => setContact(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                            />
                                        </div>

                                        {/* Сообщение */}
                                        <div className="relative">
                                            <textarea 
                                                required
                                                rows={3}
                                                placeholder="Ваш вопрос..." 
                                                value={firstMessage}
                                                onChange={(e) => setFirstMessage(e.target.value)}
                                                className="w-full p-3 bg-slate-900/50 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 resize-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isInitializing}
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                    >
                                        {isInitializing ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                Отправка обращения...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={16} />
                                                Начать диалог
                                            </>
                                        )}
                                    </motion.button>

                                    <div className="text-center pt-2 flex flex-col gap-2 justify-center border-t border-slate-900/60 mt-3 pt-3">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Альтернативные каналы связи</p>
                                        <div className="flex flex-col gap-2">
                                            <a 
                                                href="https://t.me/fsin_calc_bot" 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="w-full py-2 px-3 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 hover:border-sky-500/40 text-sky-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                            >
                                                <MessageSquare size={13} /> Написать в Telegram
                                            </a>
                                            <a 
                                                href="mailto:support@fsin-calc.pro" 
                                                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-slate-350 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                            >
                                                <Mail size={13} /> Написать на email: support@fsin-calc.pro
                                            </a>
                                        </div>
                                    </div>
                                </motion.form>
                            ) : (
                                /* АКТИВНЫЙ ЧАТ ЛОГ */
                                <div className="flex-1 flex flex-col justify-between h-full">
                                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                                        {messages.map((m) => {
                                            const isUser = m.sender === 'user';
                                            return (
                                                <motion.div
                                                    key={m.id}
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                                                >
                                                    <div 
                                                        className={`px-3.5 py-2 rounded-2xl text-sm max-w-[85%] leading-relaxed ${
                                                            isUser 
                                                                ? 'bg-blue-600/20 border border-blue-500/30 text-slate-100 rounded-tr-none shadow-lg shadow-blue-500/5' 
                                                                : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg shadow-black/30'
                                                        }`}
                                                    >
                                                        {m.text}
                                                    </div>
                                                    <span className="text-[10px] text-slate-500 mt-1 px-1">
                                                        {new Date(m.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </motion.div>
                                            );
                                        })}
                                        <div ref={chatEndRef} />
                                    </div>

                                    {/* Поле ввода сообщения в чате */}
                                    <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-slate-900 flex gap-2 items-center">
                                        <input 
                                            type="text" 
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Введите сообщение..."
                                            disabled={isSending}
                                            className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 transition-all focus:ring-1 focus:ring-blue-500/10"
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="submit"
                                            disabled={!newMessage.trim() || isSending}
                                            className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl shadow-md transition-all flex items-center justify-center cursor-pointer shrink-0"
                                        >
                                            {isSending ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <Send size={16} />
                                            )}
                                        </motion.button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
