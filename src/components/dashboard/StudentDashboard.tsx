import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Trophy, Clock, Star, ArrowRight, Play } from 'lucide-react';

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
      {/* Rewards Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Battle Reward', value: '₦2,500', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Weekly Best', value: '₦5,000', icon: Star, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Monthly Best', value: '₦20,000', icon: Trophy, color: 'text-primary', bg: 'bg-blue-50' },
          { label: 'Total Rewards', value: '₦' + (profile.walletBalance || 0).toLocaleString(), icon: Clock, color: 'text-slate-900', bg: 'bg-slate-50' }
        ].map((reward, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            className={`${reward.bg} p-6 rounded-2xl border border-white shadow-sm flex flex-col items-center justify-center text-center space-y-2`}
          >
            <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center ${reward.color}`}>
              <reward.icon size={20} />
            </div>
            <div>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{reward.label}</p>
              <p className={`text-xl font-bold tracking-tight ${reward.color}`}>{reward.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Welcome Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          variants={itemVariants} 
          whileHover={{ y: -4 }}
          className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 transition-all group"
        >
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl border border-white group-hover:bg-blue-100 transition-colors">
            <BookOpen size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Modules Cleared</p>
            <p className="text-3xl font-bold text-slate-900 leading-none tracking-tighter">{profile.stats?.totalQuizzes || 0}</p>
          </div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants} 
          whileHover={{ y: -4 }}
          className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 transition-all group"
        >
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-white group-hover:bg-emerald-100 transition-colors">
            <Star size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Precision Rate</p>
            <p className="text-3xl font-bold text-emerald-600 leading-none tracking-tighter">{profile.stats?.averageScore || 0}%</p>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          whileHover={{ y: -4 }}
          className="bg-slate-900 p-8 rounded-3xl flex items-center gap-6 transition-all group"
        >
          <div className="p-4 bg-accent text-primary rounded-2xl border border-white/20 group-hover:scale-105 transition-transform">
            <Trophy size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Global Standing</p>
            <p className="text-3xl font-bold text-accent leading-none tracking-tighter">#1,204</p>
          </div>
        </motion.div>
      </div>

      {/* Recommended Practice */}
      <motion.section variants={itemVariants} className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-lg text-[8px] font-bold uppercase tracking-[0.1em] mb-1">Available Missions</div>
            <h2 className="text-3xl font-bold uppercase tracking-tight">QUIZ <span className="text-primary">BATTLEGROUNDS</span></h2>
          </div>
          <button className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white h-10 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
            View All Map <ArrowRight size={14} className="inline ml-2" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, idx) => (
            <motion.button
              key={idx}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onStartPractice(subject.title)}
              className="group relative overflow-hidden bg-white p-8 rounded-3xl border border-slate-100 text-left shadow-sm hover:shadow-md transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl ${subject.color} flex items-center justify-center text-white mb-6 shadow-sm relative z-10`}>
                <Play size={24} fill="currentColor" />
              </div>
              <div className="relative z-10 space-y-1">
                <h3 className="font-bold text-xl uppercase tracking-tight leading-none">{subject.title}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">40 Questions • 60M Limit</p>
              </div>
              
              <div className="flex items-center justify-between mt-8 relative z-10">
                <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-8 h-8 rounded-xl border-2 border-white bg-slate-50 flex items-center justify-center overflow-hidden shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Quizz${subject.title}${i}`} alt="user" className="w-full h-full" />
                     </div>
                   ))}
                   <div className="w-8 h-8 rounded-xl border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400 shadow-sm">+12k</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md">
                   <ArrowRight size={20} />
                </div>
              </div>

              {/* Back Decor */}
              <div className={`absolute -bottom-10 -right-10 w-48 h-48 ${subject.color} opacity-[0.03] rounded-full blur-3xl group-hover:opacity-10 transition-opacity`}></div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Recent Activity */}
      <motion.section variants={itemVariants} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden relative">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                <Clock size={20} />
            </div>
            <h2 className="font-bold uppercase tracking-[0.1em] text-xs">Recently Completed Quizzes</h2>
          </div>
          <div className="px-3 py-1.5 bg-white rounded-lg border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-300">Live Sync</div>
        </div>
        <div className="divide-y divide-slate-50">
          {[1,2,3].map(i => (
            <motion.div 
              key={i} 
              whileHover={{ backgroundColor: "rgba(241, 245, 249, 0.5)" }}
              className="p-6 flex items-center justify-between transition-all cursor-pointer group relative"
            >
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
                  {i === 1 ? 'M' : i === 2 ? 'E' : 'P'}
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold uppercase tracking-tight leading-none">{i === 1 ? 'Mathematics' : i === 2 ? 'English Language' : 'Physics'}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">2 days ago • JAMB 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-8 relative z-10">
                <div className="text-right space-y-1">
                  <p className="text-3xl font-bold text-emerald-600 tracking-tighter leading-none">85%</p>
                  <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">Score Accuracy</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-200 group-hover:border-primary group-hover:text-primary transition-all flex items-center justify-center group-hover:bg-primary group-hover:text-white">
                  <ArrowRight size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};
