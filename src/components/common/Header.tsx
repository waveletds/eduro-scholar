import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, User, Wallet, BookOpen, PenTool, LayoutDashboard, ShieldCheck, Zap, Trophy, Smartphone, Globe } from 'lucide-react';
import { authService } from '../../services/authService';

interface HeaderProps {
  profile: any;
  currentView: string;
  setView: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ profile, currentView, setView }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'PORTAL', icon: LayoutDashboard, color: 'bg-primary' },
    ...(profile?.role === 'student' ? [
      { id: 'community', label: 'COMMONS', icon: Globe, color: 'bg-indigo-600' },
      { id: 'profile', label: 'SCHOLAR', icon: User, color: 'bg-slate-900' },
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
    <header className="fixed top-2 md:top-6 left-1/2 -translate-x-1/2 z-[100] w-[98%] md:w-[95%] max-w-7xl glass rounded-2xl md:rounded-3xl px-4 md:px-8 py-3 md:py-4 shadow-xl border border-white/40 flex items-center justify-between">
      <div className="flex items-center gap-2 md:gap-4 cursor-pointer group" onClick={() => setView('dashboard')}>
        <div className="bg-slate-900 text-accent p-2 md:p-2.5 rounded-xl border border-white/10 group-hover:scale-105 transition-transform shadow-lg">
          <BookOpen size={18} className="md:w-[22px] md:h-[22px]" />
        </div>
        <div className="hidden sm:block">
           <h1 className="text-sm md:text-xl font-bold text-slate-900 uppercase tracking-tight leading-none">
             Eduro Scholar
           </h1>
           <p className="text-[6px] md:text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 md:mt-1 leading-none">Learning Network</p>
        </div>
      </div>

      {profile && (
        <div className="flex items-center gap-2 md:gap-6">
          <nav className="hidden xl:flex items-center gap-4 p-2 bg-slate-50/50 rounded-3xl border border-slate-100">
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
                {/* ... icon logic ... */}
                {typeof item.icon === 'string' ? <Zap size={18} /> : <item.icon size={18} className="shrink-0" />}
                <span>{item.label}</span>
              </motion.button>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-6">
            <motion.button 
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setView('wallet')}
              className={`flex items-center gap-2 md:gap-4 px-3 md:px-5 h-10 md:h-12 rounded-xl md:rounded-2xl transition-all border ${
                currentView === 'wallet' 
                  ? 'bg-slate-900 border-slate-800 text-white shadow-lg' 
                  : 'bg-white border-slate-100 text-slate-900 shadow-sm'
              }`}
            >
              <div className={`p-1 md:p-1.5 rounded-lg border ${currentView === 'wallet' ? 'bg-slate-800 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                <Wallet size={14} className={currentView === 'wallet' ? 'text-accent' : 'text-primary md:w-4 md:h-4'} />
              </div>
              <span className="text-xs md:text-sm font-bold uppercase tracking-tight">₦{profile?.walletBalance?.toLocaleString() || 0}</span>
            </motion.button>
            
            <div className="flex items-center gap-2 md:gap-4 md:pl-6 md:border-l-2 md:border-slate-100">
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="relative cursor-pointer"
                onClick={handleLogout}
              >
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="User" className="w-10 h-10 md:w-11 md:h-11 rounded-xl border-2 border-white shadow-md hover:border-danger transition-colors object-cover" />
                ) : (
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center border border-white/20 hover:border-danger transition-colors">
                    <User size={18} className="md:w-5 md:h-5" />
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-[3px] border-white rounded-full"></div>
              </motion.div>
            </div>

            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden p-2.5 md:p-3 bg-white rounded-xl md:rounded-2xl border-2 border-slate-100 shadow-sm"
            >
               <div className="space-y-1 w-5 md:w-6">
                  <div className={`h-0.5 md:h-1 w-full bg-slate-900 rounded-full transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                  <div className={`h-0.5 md:h-1 w-full bg-slate-900 rounded-full transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                  <div className={`h-0.5 md:h-1 w-full bg-slate-900 rounded-full transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
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
            className="absolute top-20 md:top-24 left-0 right-0 bg-white rounded-3xl border border-slate-100 shadow-2xl p-4 md:p-6 xl:hidden space-y-2 md:space-y-3"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setView(item.id); setIsMenuOpen(false); }}
                className={`w-full flex items-center justify-between p-4 md:p-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
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
