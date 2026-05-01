import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Users,
  ChevronRight,
  Filter
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { TransactionHistory } from '../wallet/TransactionHistory';

interface TeacherDashboardProps {
  profile: any;
  onAddQuestion: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ profile, onAddQuestion }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'questions' | 'wallet'>('questions');

  useEffect(() => {
    const fetchTeacherQuestions = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('creator_id', session.user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setQuestions(data || []);
      } catch (error) {
        console.error("Failed to fetch teacher questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherQuestions();
  }, []);

  const stats = [
    { label: 'Earning This Month', value: `₦${profile.stats?.monthlyEarnings?.toLocaleString() || 0}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Contributions', value: questions.length, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Students Reached', value: profile.stats?.studentsReached?.toLocaleString() || 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Approval Rate', value: `${profile.stats?.approvalRate || 100}%`, icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'rejected': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-12 pb-32">
      {/* Header with quick action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-bold uppercase tracking-widest mb-2 shadow-sm">Faculty Operations</div>
          <h1 className="text-4xl font-bold tracking-tight">Teacher <span className="text-primary italic">Dashboard</span></h1>
          <p className="text-slate-400 font-medium tracking-tight text-sm">Track your impact and earnings as a verified educator.</p>
        </div>
        <motion.button 
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddQuestion}
          className="flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-lg border border-white/10"
        >
          <Plus size={20} /> Add New Content
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx} 
            whileHover={{ y: -2 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center shadow-inner`}>
              <stat.icon size={22} />
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Tab System Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-8 border-b-4 border-slate-50">
             <button 
                onClick={() => setActiveTab('questions')}
                className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'questions' ? 'text-primary' : 'text-slate-300 hover:text-slate-500'}`}
             >
                NODE_CONTRIBUTIONS
                {activeTab === 'questions' && <motion.div layoutId="tab" className="absolute bottom-[-4px] left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_0_10px_rgba(30,64,175,0.5)]" />}
             </button>
             <button 
                onClick={() => setActiveTab('wallet')}
                className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'wallet' ? 'text-primary' : 'text-slate-300 hover:text-slate-500'}`}
             >
                FINANCIAL_LOG
                {activeTab === 'wallet' && <motion.div layoutId="tab" className="absolute bottom-[-4px] left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_0_10px_rgba(30,64,175,0.5)]" />}
             </button>
          </div>          <div className="min-h-[400px]">
            {activeTab === 'questions' ? (
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                   <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Content Pool</h2>
                   <button className="text-slate-400 w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition-all border border-transparent hover:border-slate-100"><Filter size={16} /></button>
                </div>
                {loading ? (
                  <div className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs animate-pulse">Checking records...</div>
                ) : questions.length === 0 ? (
                  <div className="p-20 text-center space-y-6">
                    <div className="mx-auto w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-200">
                      <CheckCircle2 size={40} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900 uppercase tracking-widest text-sm">No Content Found</p>
                      <p className="text-xs text-slate-400 font-medium tracking-tight">Start contributing to earn rewards.</p>
                    </div>
                    <button onClick={onAddQuestion} className="bg-primary text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg">Start Uploading</button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {questions.map((q) => (
                      <motion.div 
                        key={q.id} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-6 hover:bg-slate-50 transition-all group cursor-pointer relative"
                      >
                        <div className="flex items-start justify-between gap-6 relative z-10">
                          <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex items-center gap-3">
                              <span className={`text-[9px] uppercase font-bold px-2.5 py-1 rounded-md border border-white/20 shadow-sm ${getStatusColor(q.status)}`}>
                                {q.status}
                              </span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{q.subject} | {q.examType}</span>
                            </div>
                            <p className="text-lg font-bold text-slate-800 line-clamp-2 italic leading-tight tracking-tight">{q.text}</p>
                            <div className="flex items-center gap-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              <span className="flex items-center gap-2 px-2.5 py-1 bg-white rounded-lg shadow-inner border border-slate-100"><Users size={12} /> {q.usageCount} Sessions</span>
                              <span className="flex items-center gap-2 px-2.5 py-1 bg-white rounded-lg shadow-inner border border-slate-100"><Clock size={12} /> {new Date(q.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                            <ChevronRight size={20} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6">
                    <TransactionHistory />
                </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-10">
          <div className="bg-slate-900 text-white p-10 rounded-[40px] overflow-hidden relative shadow-xl border border-slate-800">
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-primary shadow-lg">
                <Wallet size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-xl leading-none uppercase tracking-tight text-accent">Payment Status</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Minimum payout: ₦5,000 via local bank transfer.</p>
              </div>
              <button className="w-full bg-white text-primary py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all hover:bg-accent shadow-lg">
                Configure Payout
              </button>
            </div>
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-accent/5 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-3 text-slate-900">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-inner">
                <AlertCircle size={18} /> 
              </div>
              Submission Tips
            </h3>
            <ul className="space-y-4">
              {[
                'Include clear step-by-step logic.',
                'Use diagrams where helpful.',
                'Ensure questions are unique.',
                'Categorize correctly by exam type.'
              ].map((tip, i) => (
                <li key={i} className="text-[11px] text-slate-500 leading-relaxed flex gap-3 font-medium tracking-tight hover:text-primary transition-colors">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0 shadow-sm shadow-primary/50"></div>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
