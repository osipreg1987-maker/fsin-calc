import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function ProModal({ isOpen, onClose, title = "Функция доступна в PRO-версии" }: ProModalProps) {
  const router = useRouter();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-4 right-4">
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(245,158,11,0.3)] rotate-3">
                <Crown size={32} className="text-slate-900" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
              <p className="text-slate-400 mb-8">
                Перейдите на PRO-подписку, чтобы разблокировать все возможности профессионального калькулятора.
              </p>
              
              <div className="space-y-3 text-left mb-8">
                {[
                  'Безлимитный облачный архив',
                  'Экспорт официальных справок в Excel',
                  'Сложные составные периоды',
                  'Приоритетная поддержка'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check size={12} />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => router.push('/pro')}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              >
                Узнать подробности <ArrowRight size={18} />
              </button>
              
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
