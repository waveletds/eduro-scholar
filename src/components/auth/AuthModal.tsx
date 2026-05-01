import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { authService } from '../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await authService.signInWithEmail(email, password);
      } else {
        await authService.signUpWithEmail(email, password);
        alert('Verification email sent! Please check your inbox.');
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-md rounded-3xl md:rounded-[40px] shadow-2xl overflow-hidden border border-slate-100"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 md:top-6 right-4 md:right-6 p-2 rounded-full hover:bg-slate-50 transition-colors z-10"
        >
          <X size={18} className="text-slate-400 md:w-5 md:h-5" />
        </button>

        <div className="p-6 md:p-10 space-y-6 md:space-y-8">
          <div className="space-y-1.5 md:space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
              {isLogin ? 'Access Core' : 'Initialize Node'}
            </h2>
            <p className="text-slate-400 font-bold uppercase text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em]">
              {isLogin ? 'Enter your credentials' : 'Create your scholar profile'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 md:p-4 bg-rose-50 text-rose-600 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest border border-rose-100">
                {error}
              </div>
            )}

            <div className="space-y-3 md:space-y-4">
              <div className="relative group">
                <div className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Mail size={16} className="md:w-[18px] md:h-[18px]" />
                </div>
                <input 
                  type="email"
                  placeholder="ACADEMIC EMAIL"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 md:h-16 bg-slate-50 rounded-2xl md:rounded-[28px] border-2 border-slate-100 pl-14 md:pl-16 pr-4 md:pr-6 font-black text-[9px] md:text-[10px] uppercase tracking-widest text-slate-900 focus:border-primary focus:outline-none transition-all"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Lock size={16} className="md:w-[18px] md:h-[18px]" />
                </div>
                <input 
                  type="password"
                  placeholder="SECURITY KEY"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 md:h-16 bg-slate-50 rounded-2xl md:rounded-[28px] border-2 border-slate-100 pl-14 md:pl-16 pr-4 md:pr-6 font-black text-[9px] md:text-[10px] uppercase tracking-widest text-slate-900 focus:border-primary focus:outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-accent py-5 md:py-6 rounded-2xl md:rounded-[28px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm neo-3d-accent transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isLogin ? 'Synchronize' : 'Authorize'}
                  <ArrowRight size={18} className="md:w-5 md:h-5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 md:pt-4">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-slate-400 hover:text-primary transition-colors"
            >
              {isLogin ? "No account? Initialize Node" : "Existing Master? Access Portal"}
            </button>
          </div>
        </div>

        <div className="bg-slate-50 p-4 md:p-6 text-center border-t border-slate-100">
           <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">
             By accessing the portal, you agree to our <span className="text-slate-900 underline underline-offset-4 cursor-pointer">Neural Protocols</span>
           </p>
        </div>
      </motion.div>
    </div>
  );
};
