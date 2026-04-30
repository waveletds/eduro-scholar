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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-block px-3 py-1 bg-amber-500/10 text-amber-600 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-1">Contest Arena</div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">Active <span className="text-primary">Contests</span></h1>
          <p className="text-slate-500 font-medium text-sm">Compete with thousands of students across the country.</p>
        </div>
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center gap-6 px-8 shadow-sm group"
        >
           <div className="text-right space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Global Rank</p>
              <p className="text-2xl font-bold text-slate-900 leading-none tracking-tighter">#1,204</p>
           </div>
           <div className="w-px h-10 bg-slate-100"></div>
           <div className="p-3 bg-amber-50 text-amber-500 rounded-xl group-hover:scale-110 transition-transform">
              <Star size={24} fill="currentColor" />
           </div>
        </motion.div>
      </div>

      {/* Featured Arena Banner */}
      <motion.div 
        whileHover={{ y: -4 }}
        className="bg-slate-900 p-12 rounded-[40px] shadow-xl relative overflow-hidden text-center md:text-left"
      >
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-8">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 text-accent rounded-xl text-[10px] font-bold uppercase tracking-widest border border-white/10 shadow-xl">
                      <ShieldAlert size={16} /> Mega Contest Live
                  </div>
                  <h2 className="text-5xl font-bold text-white tracking-tight leading-tight uppercase">
                      Independence <br />
                      <span className="text-accent">Elite Quiz Arena</span>
                  </h2>
                  <p className="text-slate-300 text-sm font-medium leading-relaxed max-w-xl">
                      Join the largest educational scholarship drive in West Africa. Top 10 scorers receive full high-school funding.
                  </p>
                  <div className="flex flex-wrap gap-6 justify-center md:justify-start pt-2">
                     <motion.button 
                       whileHover={{ scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                       className="bg-accent text-primary px-10 py-5 rounded-2xl font-bold uppercase tracking-widest shadow-lg border border-white/20"
                     >
                        Join Contest
                     </motion.button>
                     <div className="flex items-center gap-4 text-white/60 font-medium uppercase text-[10px] tracking-widest">
                        <div className="flex -space-x-3">
                            {[1,2,3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-xl border border-slate-700 overflow-hidden bg-slate-800">
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
                  <Trophy size={200} className="text-accent rotate-6 relative z-10 filter drop-shadow-2xl" />
              </div>
          </div>
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Active Contests */}
        <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold uppercase tracking-tight">Active Contests</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Real-time deployments</p>
                </div>
                <div className="flex p-1 bg-slate-100 rounded-xl">
                    <button className="px-5 py-2 bg-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm">Today</button>
                    <button className="px-5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">Upcoming</button>
                </div>
            </div>

            <div className="grid gap-4">
                {contests.map(contest => (
                    <motion.div 
                        key={contest.id} 
                        whileHover={{ y: -4 }}
                        className={`group bg-white p-1 rounded-3xl border transition-all shadow-sm hover:shadow-md cursor-pointer ${contest.color.split(' ')[0]}`}
                    >
                        <div className="bg-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-slate-50 overflow-hidden relative">
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-16 h-16 bg-slate-900 text-accent rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-105 transition-transform">
                                    <Target size={28} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <p className="font-bold text-xl text-slate-900 group-hover:text-primary transition-colors tracking-tight uppercase">{contest.title}</p>
                                        <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg uppercase tracking-wider">{contest.tag}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{contest.subject} • {contest.players?.toLocaleString()} Players Enrolled</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 justify-between sm:justify-end relative z-10">
                                <div className="text-right space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Payout Pool</p>
                                    <p className="text-3xl font-bold text-emerald-600 tracking-tighter leading-none">₦{contest.prize.toLocaleString()}</p>
                                </div>
                                <motion.button 
                                  whileHover={{ scale: 1.05 }}
                                  className="bg-slate-900 text-white p-4 rounded-xl group-hover:bg-primary transition-all border border-white/10"
                                >
                                    <ArrowRight size={24} />
                                </motion.button>
                            </div>
                            
                            {/* Decorative element */}
                            <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.03] group-hover:opacity-10 transition-opacity rounded-full blur-3xl ${contest.color.split(' ')[0].replace('border-', 'bg-')}`}></div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        <div className="space-y-8">
            <div className="space-y-1">
                <h3 className="text-2xl font-bold uppercase tracking-tight">Stake & Win</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">High stakes practice engagement</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8 overflow-hidden relative">
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                            <Sword size={24} />
                        </div>
                        <h4 className="font-bold uppercase tracking-widest text-xs">P2P Battle</h4>
                    </div>
                    
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-[0.05em]">
                        Stake an amount and face an opponent. Winner takes the total pool 
                        <span className="text-rose-500 font-bold italic ml-1">(-10% platform fee)</span>.
                    </p>

                    <div className="space-y-4 pt-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stake Amount</label>
                        <div className="grid grid-cols-3 gap-3">
                           {[100, 200, 500].map(amt => (
                               <motion.button 
                                  key={amt}
                                  whileHover={{ y: -2 }}
                                  onClick={() => setBetAmount(amt)}
                                  className={`py-3 rounded-xl border font-bold text-[11px] tracking-widest transition-all ${betAmount === amt ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                               >
                                  ₦{amt}
                               </motion.button>
                           ))}
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between shadow-inner">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Potential Win</p>
                            <p className="text-3xl font-bold text-emerald-600 tracking-tighter mt-1 leading-none">₦{(betAmount * 1.9).toLocaleString()}</p>
                        </div>
                        <TrendingUp size={32} className="text-slate-200 shrink-0" />
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onStartPractice('JAMB English')}
                        disabled={betAmount === 0}
                        className="w-full bg-slate-900 text-accent py-5 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-lg disabled:opacity-30 border border-white/10"
                    >
                        Search Opponent
                    </motion.button>
                </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-6">
               <h4 className="font-bold text-[10px] uppercase tracking-widest flex items-center gap-3">
                  <TrendingUp size={16} className="text-primary" /> Recent Winners
               </h4>
               <div className="space-y-5">
                  {[
                      { name: 'Chuks Dev', score: '98%', gift: '₦12,500' },
                      { name: 'Adaobi P.', score: '95%', gift: '₦10,000' },
                      { name: 'OluwaTobi', score: '94%', gift: '₦8,000' }
                  ].map((winner, idx) => (
                      <div key={idx} className="flex items-center justify-between group cursor-pointer">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-400 group-hover:text-primary transition-colors">
                                #{idx+1}
                             </div>
                             <p className="text-xs font-bold text-slate-800 uppercase tracking-tight">{winner.name}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-bold text-primary leading-none">{winner.gift}</p>
                             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{winner.score} Accuracy</p>
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
