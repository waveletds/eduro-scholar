import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, User, Wallet, BookOpen, PenTool, LayoutDashboard, ShieldCheck, Zap, Trophy, Smartphone } from 'lucide-react';
import { auth, logout } from '../../services/firebase';

interface HeaderProps {
  profile: any;
  currentView: string;
  setView: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ profile, currentView, setView }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'PORTAL', icon: LayoutDashboard, color: 'bg-primary' },
    ...(profile?.role === 'student' ? [
      { id: 'contest', label: 'ARENA', icon: Trophy, color: 'bg-amber-500' },
      { id: 'vtu', label: 'FORGE', icon: 'zap', color: 'bg-indigo-600' }
    ] : []),
    ...(profile?.role === 'teacher' ? [
      { id: 'contribute', label: 'CURATE', icon: PenTool, color: 'bg-emerald-600' }
    ] : []),
    ...(profile?.role === 'admin' ? [
      { id: 'moderation', label: 'WATCH', icon: ShieldCheck, color: 'bg-rose-600' }
    ] : [])
  ];

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl glass rounded-3xl px-8 py-4 shadow-xl border border-white/40 flex items-center justify-between">
      <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setView('dashboard')}>
        <div className="bg-slate-900 text-accent p-2.5 rounded-xl border border-white/10 group-hover:scale-105 transition-transform shadow-lg">
          <BookOpen size={22} />
        </div>
        <div className="hidden md:block">
           <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight leading-none">
             Eduro Scholar
           </h1>
           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 leading-none">Learning Network</p>
        </div>
      </div>

      {profile && (
        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-4 p-2 bg-slate-50/50 rounded-3xl border border-slate-100">
            {navItems.map((item) => (
              <motion.button 
                key={item.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView(item.id)}
                className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                  currentView === item.id 
                    ? `${item.color} text-white shadow-lg` 
                    : 'text-slate-400 hover:bg-white hover:text-slate-600'
                }`}
              >
                {typeof item.icon === 'string' ? <Zap size={18} /> : <item.icon size={18} className="shrink-0" />}
                <span>{item.label}</span>
              </motion.button>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <motion.button 
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setView('wallet')}
              className={`flex items-center gap-4 px-5 h-12 rounded-2xl transition-all border ${
                currentView === 'wallet' 
                  ? 'bg-slate-900 border-slate-800 text-white shadow-lg' 
                  : 'bg-white border-slate-100 text-slate-900 shadow-sm'
              }`}
            >
              <div className={`p-1.5 rounded-lg border ${currentView === 'wallet' ? 'bg-slate-800 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                <Wallet size={16} className={currentView === 'wallet' ? 'text-accent' : 'text-primary'} />
              </div>
              <span className="text-sm font-bold uppercase tracking-tight">₦{profile.walletBalance?.toLocaleString() || 0}</span>
            </motion.button>
            
            <div className="flex items-center gap-4 pl-6 border-l-2 border-slate-100">
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="relative cursor-pointer"
                onClick={() => logout()}
              >
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="User" className="w-11 h-11 rounded-xl border-2 border-white shadow-md hover:border-danger transition-colors object-cover" />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center border border-white/20 hover:border-danger transition-colors">
                    <User size={20} />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
              </motion.div>
            </div>

            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 bg-white rounded-2xl border-2 border-slate-100 shadow-sm"
            >
               <div className="space-y-1.5 w-6">
                  <div className={`h-1 w-full bg-slate-900 rounded-full transition-all ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></div>
                  <div className={`h-1 w-full bg-slate-900 rounded-full transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                  <div className={`h-1 w-full bg-slate-900 rounded-full transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></div>
               </div>
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="absolute top-24 left-0 right-0 bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 lg:hidden space-y-3"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setView(item.id); setIsMenuOpen(false); }}
                className={`w-full flex items-center justify-between p-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                  currentView === item.id ? 'bg-primary text-white shadow-lg' : 'bg-slate-50 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-4">
                   {typeof item.icon === 'string' ? <Zap size={18} /> : <item.icon size={18} />}
                   <span>{item.label}</span>
                </div>
                <Smartphone size={18} className="opacity-20" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
