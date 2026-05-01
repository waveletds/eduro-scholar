import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Clock, 
  Wallet,
  TrendingUp,
  Download,
  Smartphone,
  Wifi,
  BookOpen
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (error) throw error;
        setTransactions(data || []);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'usage_royalty': return <TrendingUp size={18} className="text-emerald-500" />;
      case 'reward': return <ArrowDownCircle size={18} className="text-blue-500" />;
      case 'withdrawal': return <ArrowUpCircle size={18} className="text-rose-500" />;
      case 'deposit': return <ArrowDownCircle size={18} className="text-emerald-500" />;
      case 'airtime': return <Smartphone size={18} className="text-orange-500" />;
      case 'data': return <Wifi size={18} className="text-blue-500" />;
      case 'course_subscription': return <BookOpen size={18} className="text-indigo-500" />;
      default: return <Wallet size={18} className="text-slate-400" />;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
        case 'usage_royalty': return 'Usage Royalty';
        case 'reward': return 'Quiz Reward';
        case 'contribution_payout': return 'Contribution Bonus';
        case 'withdrawal': return 'Withdrawal';
        case 'deposit': return 'Internal Deposit';
        case 'airtime': return 'Airtime Signal';
        case 'data': return 'Data Bandwidth';
        case 'course_subscription': return 'Course Intake';
        default: return type.replace('_', ' ');
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-bold uppercase tracking-tight">Recent Activity</h2>
        <motion.button 
          whileHover={{ y: -2 }}
          className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-primary transition-all uppercase tracking-widest bg-white h-10 px-6 rounded-xl border border-slate-100 shadow-sm"
        >
          <Download size={14} /> Export CSV
        </motion.button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-24 text-center text-slate-300 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing records...</div>
        ) : transactions.length === 0 ? (
          <div className="p-24 text-center space-y-6">
             <div className="mx-auto w-20 h-20 bg-slate-50 text-slate-200 rounded-2xl flex items-center justify-center border border-slate-100">
                <Clock size={40} />
             </div>
             <div className="space-y-1">
                <p className="font-bold text-slate-600 uppercase tracking-widest text-lg">No Transactions</p>
                <p className="text-[10px] text-slate-400 font-medium tracking-tight">No activity found in your account.</p>
             </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {transactions.map((tx, idx) => (
              <motion.div 
                key={tx.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    {getIcon(tx.type)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors tracking-tight">{getLabel(tx.type)}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest flex items-center gap-2">
                       {new Date(tx.created_at).toLocaleDateString()} | ID: {tx.id.toString().substring(0, 8)}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className={`text-2xl font-bold tracking-tight ${['withdrawal', 'airtime', 'data', 'course_subscription'].includes(tx.type) ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {['withdrawal', 'airtime', 'data', 'course_subscription'].includes(tx.type) ? '-' : '+'}₦{tx.amount.toLocaleString()}
                  </p>
                  <span className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-md border border-white/20 shadow-sm ${tx.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {tx.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
