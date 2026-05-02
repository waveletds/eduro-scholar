import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Trophy, Clock, Star, ArrowRight, Play, Zap } from 'lucide-react';

interface StudentDashboardProps {
  profile: any;
  onStartPractice: (subject: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ profile, onStartPractice }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const subjects = [
    { title: 'JAMB English', color: 'bg-blue-500' },
    { title: 'JAMB Mathematics', color: 'bg-emerald-500' },
    { title: 'JAMB physics', color: 'bg-amber-500' },
    { title: 'JAMB Economics', color: 'bg-rose-500' },
    { title: 'WAEC Literature', color: 'bg-indigo-500' },
    { title: 'General Current Affairs', color: 'bg-purple-500' },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-32"
    >
      {/* Daily Challenge Card */}
      <motion.div 
        variants={itemVariants}
        className="bg-slate-900 rounded-[32px] md:rounded-[48px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border-b-8 border-accent"
      >
        <div className="relative z-10 space-y-6 md:space-y-8 flex-1 text-center md:text-left">
           <div className="space-y-2">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                <Zap size={14} className="fill-current" /> Daily Surge Active
             </div>
             <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none italic">
               The Literature <br/><span className="text-accent underline decoration-white/20">Gauntlet</span>
             </h2>
             <p className="text-sm text-slate-400 font-medium max-w-md mx-auto md:mx-0">Complete 20 Literature questions with 90% accuracy to unlock the <span className="text-white font-bold">Bard Engram</span> badge and ₦500 bonus.</p>
           </div>
           
           <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={() => onStartPractice('WAEC Literature')}
                className="w-full sm:w-auto bg-white text-primary px-10 h-14 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl hover:bg-accent transition-all"
              >
                Enter Gauntlet
              </button>
              <div className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">4,203 Scholars In-Gate</span>
              </div>
           </div>
        </div>
        
        <div className="relative w-40 h-40 md:w-64 md:h-64 flex items-center justify-center">
           <div className="absolute inset-0 bg-accent opacity-10 rounded-full blur-3xl animate-pulse"></div>
           <div className="relative z-10 w-32 h-32 md:w-56 md:h-56 bg-white/5 border border-white/10 rounded-[40px] md:rounded-[64px] flex items-center justify-center backdrop-blur-xl rotate-12 shadow-2xl overflow-hidden group">
              <BookOpen size={80} className="text-accent opacity-20 group-hover:scale-110 transition-transform md:w-32 md:h-32" />
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent"></div>
           </div>
        </div>
      </motion.div>

      {/* Rewards Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: 'Battle Reward', value: '₦2,500', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Weekly Best', value: '₦5,000', icon: Star, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Monthly Best', value: '₦20,000', icon: Trophy, color: 'text-primary', bg: 'bg-blue-50' },
          { label: 'Total Rewards', value: '₦' + (profile.walletBalance || 0).toLocaleString(), icon: Clock, color: 'text-slate-900', bg: 'bg-slate-50' }
        ].map((reward, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            className={`${reward.bg} p-4 md:p-6 rounded-2xl border border-white shadow-sm flex flex-col items-center justify-center text-center space-y-2`}
          >
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white shadow-sm flex items-center justify-center ${reward.color}`}>
              <reward.icon size={16} className="md:w-5 md:h-5" />
            </div>
            <div>
              <p className="text-[7px] md:text-[8px] font-bold text-slate-400 uppercase tracking-widest">{reward.label}</p>
              <p className={`text-base md:text-xl font-bold tracking-tight ${reward.color}`}>{reward.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Welcome Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
        <motion.div 
          variants={itemVariants} 
          whileHover={{ y: -4 }}
          className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 md:gap-6 transition-all group"
        >
          <div className="p-3 md:p-4 bg-blue-50 text-blue-600 rounded-2xl border border-white group-hover:bg-blue-100 transition-colors">
            <BookOpen size={24} className="md:w-7 md:h-7" />
          </div>
          <div>
            <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-0.5 md:mb-1">Modules Cleared</p>
            <p className="text-2xl md:text-3xl font-bold text-slate-900 leading-none tracking-tighter">{profile.stats?.totalQuizzes || 0}</p>
          </div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants} 
          whileHover={{ y: -4 }}
          className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 md:gap-6 transition-all group"
        >
          <div className="p-3 md:p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-white group-hover:bg-emerald-100 transition-colors">
            <Star size={24} className="md:w-7 md:h-7" />
          </div>
          <div>
            <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-0.5 md:mb-1">Precision Rate</p>
            <p className="text-2xl md:text-3xl font-bold text-emerald-600 leading-none tracking-tighter">{profile.stats?.averageScore || 0}%</p>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          whileHover={{ y: -4 }}
          className="bg-slate-900 p-6 md:p-8 rounded-3xl flex items-center gap-4 md:gap-6 transition-all group"
        >
          <div className="p-3 md:p-4 bg-accent text-primary rounded-2xl border border-white/20 group-hover:scale-105 transition-transform">
            <Trophy size={24} className="md:w-7 md:h-7" />
          </div>
          <div>
            <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-0.5 md:mb-1">Global Standing</p>
            <p className="text-2xl md:text-3xl font-bold text-accent leading-none tracking-tighter">#1,204</p>
          </div>
        </motion.div>
      </div>

      {/* Recommended Practice */}
      <motion.section variants={itemVariants} className="space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-lg text-[7px] md:text-[8px] font-bold uppercase tracking-[0.1em] mb-1">Available Missions</div>
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">QUIZ <span className="text-primary">BATTLEGROUNDS</span></h2>
          </div>
          <button className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white h-10 md:h-12 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all w-full md:w-auto">
            View All Map <ArrowRight size={14} className="inline ml-2" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {subjects.map((subject, idx) => (
            <motion.button
              key={idx}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onStartPractice(subject.title)}
              className="group relative overflow-hidden bg-white p-6 md:p-8 rounded-3xl border border-slate-100 text-left shadow-sm hover:shadow-md transition-all"
            >
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${subject.color} flex items-center justify-center text-white mb-4 md:mb-6 shadow-sm relative z-10`}>
                <Play size={20} className="md:w-6 md:h-6" fill="currentColor" />
              </div>
              <div className="relative z-10 space-y-1">
                <h3 className="font-bold text-lg md:text-xl uppercase tracking-tight leading-none">{subject.title}</h3>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">40 Questions • 60M Limit</p>
              </div>
              
              <div className="flex items-center justify-between mt-6 md:mt-8 relative z-10">
                <div className="flex -space-x-2 md:-space-x-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-7 h-7 md:w-8 md:h-8 rounded-xl border-2 border-white bg-slate-50 flex items-center justify-center overflow-hidden shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Quizz${subject.title}${i}`} alt="user" className="w-full h-full" />
                     </div>
                   ))}
                   <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl border-2 border-white bg-slate-100 flex items-center justify-center text-[7px] md:text-[8px] font-bold text-slate-400 shadow-sm">+12k</div>
                </div>
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-900 text-accent flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-all shadow-md">
                   <ArrowRight size={18} className="md:w-5 md:h-5" />
                </div>
              </div>

              {/* Back Decor */}
              <div className={`absolute -bottom-10 -right-10 w-48 h-48 ${subject.color} opacity-[0.03] rounded-full blur-3xl group-hover:opacity-10 transition-opacity`}></div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Neural Logic Stream & Community Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <motion.section variants={itemVariants} className="lg:col-span-2 space-y-6 md:space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight">Neural <span className="text-primary italic">Logic Stream</span></h2>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                 <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Live Propagation</span>
              </div>
            </div>

            <div className="space-y-4">
               {[
                 { scholar: 'Adeola', action: 'solved', subject: 'JAMB Physics', reward: '₦50', time: '2m ago' },
                 { scholar: 'Chinedu', action: 'perfected', subject: 'WAEC Literature', reward: '₦120', time: '5m ago' },
                 { scholar: 'Fatima', action: 'uploaded', subject: 'JAMB Economics', reward: '₦200', time: '12m ago' },
               ].map((item, i) => (
                 <div key={i} className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-primary/20 transition-all cursor-pointer group">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-900 overflow-hidden shadow-md">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.scholar}`} alt="scholar" />
                     </div>
                     <div>
                       <p className="text-sm md:text-base font-bold text-slate-900 leading-tight">
                         <span className="text-primary">{item.scholar}</span> {item.action} {item.subject}
                       </p>
                       <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{item.time}</p>
                     </div>
                   </div>
                   <div className="text-right">
                      <p className="text-xs md:text-sm font-black text-emerald-600">+{item.reward}</p>
                      <p className="text-[7px] md:text-[8px] font-bold text-slate-300 uppercase tracking-widest">Neural Yield</p>
                   </div>
                 </div>
               ))}
               <button className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-colors">
                  Load Older Data Blocks
               </button>
            </div>
        </motion.section>

        <motion.section variants={itemVariants} className="space-y-8">
           <div className="bg-slate-900 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 space-y-10">
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-accent uppercase tracking-[0.3em]">Neural Pulse</p>
                  <h3 className="text-2xl font-bold uppercase tracking-tighter leading-none">Global Network <br/>Efficiency</h3>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span>Computation Progress</span>
                        <span>82%</span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: '82%' }}
                           className="h-full bg-accent rounded-full shadow-[0_0_15px_rgba(251,210,10,0.5)]" 
                         />
                      </div>
                   </div>
                   
                   <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic opacity-80">
                     "The more logic you solve, the stronger the collective Nigerian scholar graph grows."
                   </p>

                   <button className="w-full h-14 bg-white text-primary rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-accent transition-all">
                      Sync Neural Data
                   </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
           </div>

           <div className="bg-emerald-50 rounded-[40px] p-8 border border-emerald-100 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                    <Star size={20} />
                 </div>
                 <div>
                    <h4 className="text-sm font-bold text-emerald-900 leading-none">Scholar Tip</h4>
                    <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest opacity-60">Neural Growth Protocol</p>
                 </div>
              </div>
              <p className="text-xs text-emerald-800/70 font-medium leading-relaxed">
                 Solving Literature questions before sleep improves memory retention of character arcs by 22%. Try a quick module tonight!
              </p>
           </div>
        </motion.section>
      </div>

      {/* Recent Activity */}
      <motion.section variants={itemVariants} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden relative">
        <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                <Clock size={16} className="md:w-5 md:h-5" />
            </div>
            <h2 className="font-bold uppercase tracking-[0.1em] text-[10px] md:text-xs">Recently Completed Quizzes</h2>
          </div>
          <div className="hidden sm:block px-3 py-1.5 bg-white rounded-lg border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-300">Live Sync</div>
        </div>
        <div className="divide-y divide-slate-50">
          {[1,2,3].map(i => (
            <motion.div 
              key={i} 
              whileHover={{ backgroundColor: "rgba(241, 245, 249, 0.5)" }}
              className="p-4 md:p-6 flex items-center justify-between transition-all cursor-pointer group relative"
            >
              <div className="flex items-center gap-3 md:gap-6 relative z-10 min-w-0">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-base md:text-xl shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  {i === 1 ? 'M' : i === 2 ? 'E' : 'P'}
                </div>
                <div className="space-y-0.5 md:space-y-1 min-w-0">
                  <p className="text-base md:text-xl font-bold uppercase tracking-tight leading-none truncate">{i === 1 ? 'Mathematics' : i === 2 ? 'English Language' : 'Physics'}</p>
                  <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">2 days ago • JAMB 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-8 relative z-10 shrink-0">
                <div className="text-right space-y-0.5 md:space-y-1">
                  <p className="text-xl md:text-3xl font-bold text-emerald-600 tracking-tighter leading-none">85%</p>
                  <p className="text-[7px] md:text-[9px] text-slate-300 font-bold uppercase tracking-widest">Accuracy</p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white border border-slate-200 text-slate-200 group-hover:border-primary group-hover:text-primary transition-all flex items-center justify-center group-hover:bg-primary group-hover:text-white">
                  <ArrowRight size={16} className="md:w-5 md:h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};
