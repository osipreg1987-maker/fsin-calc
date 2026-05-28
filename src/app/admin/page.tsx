"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';
import { Users, CreditCard, CheckCircle, XCircle, Clock, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
        return;
      }

      const res = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }

      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGrantPro = async (userId: string, action: 'grant' | 'revoke') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch('/api/admin/grant-pro', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ targetUserId: userId, action })
      });

      if (!res.ok) {
        const err = await res.json();
        alert('Ошибка: ' + err.error);
        return;
      }

      // Обновляем список локально
      setUsers(users.map(u => {
        if (u.id === userId) {
          return { ...u, is_pro: action === 'grant' };
        }
        return u;
      }));
    } catch (err: any) {
      alert('Ошибка: ' + err.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white bg-slate-950">Загрузка панели...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-slate-950 gap-4">
        <ShieldAlert size={64} className="text-rose-500" />
        <h1 className="text-2xl font-bold">Доступ запрещен</h1>
        <p className="text-slate-400">{error}</p>
        <button onClick={() => router.push('/calc')} className="px-4 py-2 bg-indigo-600 rounded-lg">Вернуться в калькулятор</button>
      </div>
    );
  }

  const proUsersCount = users.filter(u => u.is_pro).length;
  // Заглушка для статистики платежей
  const estimatedRevenue = proUsersCount * 299; // Условные 299 руб за PRO

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Панель Администратора</h1>
            <p className="text-slate-400">Управление пользователями и статистика</p>
          </div>
          <button onClick={() => router.push('/calc')} className="mt-4 md:mt-0 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors">
            Вернуться в калькулятор
          </button>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Всего пользователей</p>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Пользователей с PRO</p>
              <p className="text-2xl font-bold text-white">{proUsersCount}</p>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10"></div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 relative z-10">
              <CreditCard size={24} />
            </div>
            <div className="relative z-10">
              <p className="text-sm text-slate-400">Потенциальный доход/мес</p>
              <p className="text-2xl font-bold text-white">{estimatedRevenue.toLocaleString('ru-RU')} ₽</p>
              <p className="text-xs text-emerald-500 mt-1">Ожидает подключения кассы</p>
            </div>
          </div>
        </div>

        {/* Таблица пользователей */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">Список пользователей</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 text-slate-400">
                <tr>
                  <th className="py-4 px-6 font-medium">Email</th>
                  <th className="py-4 px-6 font-medium">Регистрация</th>
                  <th className="py-4 px-6 font-medium">Telegram</th>
                  <th className="py-4 px-6 font-medium">Статус</th>
                  <th className="py-4 px-6 font-medium text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-medium text-slate-200">{u.email}</span>
                      <div className="text-xs text-slate-500">ID: {u.id.split('-')[0]}...</div>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {new Date(u.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="py-4 px-6">
                      {u.telegram_id ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                          <CheckCircle size={12} /> Привязан
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {u.is_pro ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          PRO
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {u.is_pro ? (
                        <button 
                          onClick={() => handleGrantPro(u.id, 'revoke')}
                          className="text-xs px-3 py-1.5 rounded bg-slate-800 text-rose-400 hover:bg-slate-700 transition-colors"
                        >
                          Отозвать PRO
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleGrantPro(u.id, 'grant')}
                          className="text-xs px-3 py-1.5 rounded bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                        >
                          Выдать PRO
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
