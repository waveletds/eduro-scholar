import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Sword, 
  Users, 
  Timer, 
  TrendingUp, 
  Target,
  ArrowRight,
  ShieldAlert,
  Zap,
  Star
} from 'lucide-react';

interface ContestPageProps {
  profile: any;
  onStartPractice: (subject: string) => void;
}

export const ContestPage: React.FC<ContestPageProps> = ({ profile, onStartPractice }) => {
  const [betAmount, setBetAmount] = useState(0);

  const contests = [
    { 
        id: 1, 
        title: 'JAMB Elite Cup', 
        subject: 'General Studies', 
        players: 1420, 
        prize: 50000, 
        tag: 'Recommended',
        color: 'border-blue-500 bg-blue-50/30'
    },
    { 
        id: 2, 
        title: 'Weekly Science Showdown', 
        subject: 'Math & Physics', 
        players: 850, 
        prize: 25000, 
        tag: 'Hot',
        color: 'border-emerald-500 bg-emerald-50/30'
    },
    { 
        id: 3, 
        title: 'WAEC Literature Marathon', 
        subject: 'Literature', 
        players: 420, 
        prize: 15000, 
        tag: 'New',
        color: 'border-amber-500 bg-amber-50/30'
    },
  ];

  return (
    <div className="space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-block px-3 py-1 bg-amber-500/10 text-amber-600 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-1">Contest Arena</div>
          <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">Active <span className="text-primary">Contests</span></h1>
          <p className="text-slate-500 font-medium text-xs md:text-sm">Compete with thousands of students across the country.</p>
        </div>
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-100 flex items-center gap-4 md:gap-6 px-6 md:px-8 shadow-sm group"
        >
           <div className="text-right space-y-0.5 md:space-y-1">
              <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Global Rank</p>
              <p className="text-xl md:text-2xl font-bold text-slate-900 leading-none tracking-tighter">#1,204</p>
           </div>
           <div className="w-px h-8 md:h-10 bg-slate-100"></div>
           <div className="p-2.5 md:p-3 bg-amber-50 text-amber-500 rounded-lg md:rounded-xl group-hover:scale-110 transition-transform">
              <Star size={20} className="md:w-6 md:h-6" fill="currentColor" />
           </div>
        </motion.div>
      </div>

      {/* Featured Arena Banner */}
      <motion.div 
        whileHover={{ y: -4 }}
        className="bg-slate-900 p-8 md:p-12 rounded-3xl md:rounded-[40px] shadow-xl relative overflow-hidden text-center md:text-left"
      >
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex-1 space-y-6 md:space-y-8 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 bg-white/5 text-accent rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-bold uppercase tracking-widest border border-white/10 shadow-xl">
                      <ShieldAlert size={14} className="md:w-4 md:h-4" /> Mega Contest Live
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight uppercase">
                      Independence <br className="hidden md:block" />
                      <span className="text-accent ml-2 md:ml-0">Elite Quiz Arena</span>
                  </h2>
                  <p className="text-slate-300 text-[10px] md:text-sm font-medium leading-relaxed max-w-xl mx-auto md:mx-0">
                      Join the largest educational scholarship drive in West Africa. Top 10 scorers receive full high-school funding.
                  </p>
                  <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start pt-2">
                     <motion.button 
                       whileHover={{ scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                       className="bg-accent text-primary px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold uppercase tracking-widest text-[10px] md:text-xs shadow-lg border border-white/20"
                     >
                        Join Contest
                     </motion.button>
                     <div className="flex items-center gap-3 md:gap-4 text-white/60 font-medium uppercase text-[8px] md:text-[10px] tracking-widest">
                        <div className="flex -space-x-2 md:-space-x-3">
                            {[1,2,3].map(i => (
                                <div key={i} className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl border border-slate-700 overflow-hidden bg-slate-800">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Combat${i}`} alt="user" />
                                </div>
                            ))}
                        </div>
                        4.8k Enrolled
                     </div>
                  </div>
              </div>
              <div className="hidden lg:block relative">
                  <div className="w-80 h-80 bg-accent/10 rounded-full blur-[100px] absolute"></div>
                  <Trophy size={180} className="text-accent rotate-6 relative z-10 filter drop-shadow-2xl md:w-[200px] md:h-[200px]" />
              </div>
          </div>
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* Active Contests */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight">Active Contests</h3>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Real-time deployments</p>
                </div>
                <div className="flex p-1 bg-slate-100 rounded-lg md:rounded-xl">
                    <button className="flex-1 sm:flex-none px-4 md:px-5 py-2 bg-white rounded-md md:rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-widest shadow-sm">Today</button>
                    <button className="flex-1 sm:flex-none px-4 md:px-5 py-2 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">Upcoming</button>
                </div>
            </div>

            <div className="grid gap-3 md:gap-4">
                {contests.map(contest => (
                    <motion.div 
                        key={contest.id} 
                        whileHover={{ y: -4 }}
                        className={`group bg-white p-1 rounded-2xl md:rounded-3xl border transition-all shadow-sm hover:shadow-md cursor-pointer ${contest.color.split(' ')[0]}`}
                    >
                        <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6 border border-slate-50 overflow-hidden relative">
                            <div className="flex items-center gap-4 md:gap-6 relative z-10">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-900 text-accent rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-105 transition-transform">
                                    <Target size={22} className="md:w-7 md:h-7" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                        <p className="font-bold text-lg md:text-xl text-slate-900 group-hover:text-primary transition-colors tracking-tight uppercase">{contest.title}</p>
                                        <span className="text-[8px] md:text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md md:rounded-lg uppercase tracking-wider">{contest.tag}</span>
                                    </div>
                                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{contest.subject} • {contest.players?.toLocaleString()} Players</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 md:gap-8 justify-between sm:justify-end relative z-10">
                                <div className="text-right space-y-0.5 md:space-y-1">
                                    <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Payout Pool</p>
                                    <p className="text-2xl md:text-3xl font-bold text-emerald-600 tracking-tighter leading-none">₦{contest.prize.toLocaleString()}</p>
                                </div>
                                <motion.button 
                                  whileHover={{ scale: 1.05 }}
                                  className="bg-slate-900 text-white p-3 md:p-4 rounded-lg md:rounded-xl group-hover:bg-primary transition-all border border-white/10"
                                >
                                    <ArrowRight size={20} className="md:w-6 md:h-6" />
                                </motion.button>
                            </div>
                            
                            {/* Decorative element */}
                            <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.03] group-hover:opacity-10 transition-opacity rounded-full blur-3xl ${contest.color.split(' ')[0].replace('border-', 'bg-')}`}></div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        <div className="space-y-6 md:space-y-8">
            <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight">Stake & Win</h3>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">High stakes practice engagement</p>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 md:space-y-8 overflow-hidden relative">
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="p-2.5 md:p-3 bg-rose-50 text-rose-600 rounded-xl">
                            <Sword size={20} className="md:w-6 md:h-6" />
                        </div>
                        <h4 className="font-bold uppercase tracking-widest text-[10px] md:text-xs">P2P Battle</h4>
                    </div>
                    
                    <p className="text-[9px] md:text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-[0.05em]">
                        Stake an amount and face an opponent. Winner takes the total pool 
                        <span className="text-rose-500 font-bold italic ml-1">(-10% fee)</span>.
                    </p>

                    <div className="space-y-3 md:space-y-4 pt-2">
                        <label className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stake Amount</label>
                        <div className="grid grid-cols-3 gap-2 md:gap-3">
                           {[100, 200, 500].map(amt => (
                               <motion.button 
                                  key={amt}
                                  whileHover={{ y: -2 }}
                                  onClick={() => setBetAmount(amt)}
                                  className={`py-2.5 md:py-3 rounded-xl border font-bold text-[9px] md:text-[11px] tracking-widest transition-all ${betAmount === amt ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                               >
                                  ₦{amt}
                               </motion.button>
                           ))}
                        </div>
                    </div>

                    <div className="p-5 md:p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between shadow-inner">
                        <div>
                            <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Potential Win</p>
                            <p className="text-2xl md:text-3xl font-bold text-emerald-600 tracking-tighter mt-1 leading-none">₦{(betAmount * 1.9).toLocaleString()}</p>
                        </div>
                        <TrendingUp size={24} className="text-slate-200 shrink-0 md:w-8 md:h-8" />
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onStartPractice('JAMB English')}
                        disabled={betAmount === 0}
                        className="w-full bg-slate-900 text-accent py-4 md:py-5 rounded-xl md:rounded-2xl font-bold uppercase tracking-widest text-[10px] md:text-[11px] shadow-lg disabled:opacity-30 border border-white/10"
                    >
                        Search Opponent
                    </motion.button>
                </div>
            </div>

            <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 space-y-4 md:space-y-6">
               <h4 className="font-bold text-[9px] md:text-[10px] uppercase tracking-widest flex items-center gap-3">
                  <TrendingUp size={14} className="text-primary md:w-4 md:h-4" /> Recent Winners
               </h4>
               <div className="space-y-4 md:space-y-5">
                  {[
                      { name: 'Chuks Dev', score: '98%', gift: '₦12,500' },
                      { name: 'Adaobi P.', score: '95%', gift: '₦10,000' },
                      { name: 'OluwaTobi', score: '94%', gift: '₦8,000' }
                  ].map((winner, idx) => (
                      <div key={idx} className="flex items-center justify-between group cursor-pointer">
                          <div className="flex items-center gap-2 md:gap-3">
                             <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center font-bold text-[8px] md:text-[10px] text-slate-400 group-hover:text-primary transition-colors">
                                #{idx+1}
                             </div>
                             <p className="text-[10px] md:text-xs font-bold text-slate-800 uppercase tracking-tight">{winner.name}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-xs md:text-sm font-bold text-primary leading-none">{winner.gift}</p>
                             <p className="text-[7px] md:text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{winner.score} Acc</p>
                          </div>
                      </div>
                  ))}
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const Trefle = Sword; // Reusing icon for visual variety
