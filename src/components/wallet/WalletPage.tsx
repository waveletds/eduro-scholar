import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Smartphone, 
  History,
  Info,
  CreditCard,
  Building
} from 'lucide-react';
import { TransactionHistory } from './TransactionHistory';

interface WalletPageProps {
  profile: any;
}

export const WalletPage: React.FC<WalletPageProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

  return (
    <div className="space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-1">
          <div className="inline-block px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold uppercase tracking-widest mb-1">Asset Management</div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">Financial <span className="text-primary">Overview</span></h1>
          <p className="text-slate-500 font-medium text-sm">Manage your earnings, bonuses, and scholarship rewards.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Balance Card */}
        <div className="lg:col-span-1 space-y-10">
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-slate-900 text-white p-10 rounded-[40px] shadow-xl relative overflow-hidden group"
          >
            <div className="relative z-10 space-y-12">
              <div className="flex items-center justify-between">
                <div className="p-4 bg-accent text-primary rounded-2xl border border-white/20 group-hover:rotate-6 transition-transform">
                  <Wallet size={28} />
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">Main Wallet</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mt-1">Active</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Available Balance</p>
                <div className="flex items-baseline gap-4">
                   <span className="text-5xl font-bold tracking-tighter">₦{profile.walletBalance?.toLocaleString() || 0}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <motion.button 
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className="bg-white text-primary py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-accent"
                 >
                    <ArrowDownLeft size={16} /> Recharge
                 </motion.button>
                 <motion.button 
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className="bg-white/10 text-white backdrop-blur-md py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 border border-white/10 hover:bg-white/20 transition-all"
                 >
                    <ArrowUpRight size={16} /> Withdraw
                 </motion.button>
              </div>
            </div>
            
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-[120px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -ml-24 -mb-24"></div>
          </motion.div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
             <h3 className="font-bold flex items-center gap-3 text-slate-400 text-[10px] uppercase tracking-widest">
                <Info size={16} /> Wallet Information
             </h3>
             <div className="space-y-6">
                <div className="flex items-start gap-5 group">
                   <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-white group-hover:bg-emerald-100 transition-colors">
                      <ShieldCheck size={24} className="text-emerald-500" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-900">Secure Payments</p>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase">
                        All withdrawals are verified before payout processing.
                      </p>
                   </div>
                </div>
                <div className="flex items-start gap-5 group">
                   <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-white group-hover:bg-blue-100 transition-colors">
                      <Smartphone size={24} className="text-blue-500" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-900">Instant Airtime</p>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase">
                        Purchase airtime and data instantly from your balance.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-8 border-b border-slate-100">
             <button 
                onClick={() => setActiveTab('overview')}
                className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'overview' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
             >
                Dashboard
                {activeTab === 'overview' && <motion.div layoutId="wallet-tab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-sm" />}
             </button>
             <button 
                onClick={() => setActiveTab('history')}
                className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'history' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
             >
                History
                {activeTab === 'history' && <motion.div layoutId="wallet-tab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-sm" />}
             </button>
          </div>

          <div className="min-h-[500px]">
             {activeTab === 'overview' ? (
                <div className="grid md:grid-cols-2 gap-6">
                    <motion.div 
                        whileHover={{ y: -4 }}
                        className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8"
                    >
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-white">
                            <ArrowDownLeft size={24} />
                         </div>
                         <h3 className="text-xs font-bold uppercase tracking-widest">Monthly Earnings</h3>
                       </div>
                       <div className="space-y-2">
                         <p className="text-3xl font-bold text-slate-900 leading-none tracking-tighter">₦{profile.stats?.monthlyEarnings?.toLocaleString() || 0}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 font-medium">Estimated return this month</p>
                       </div>
                       <div className="pt-6 border-t border-slate-50 flex items-center gap-3 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                          <div className="bg-emerald-50 p-1 rounded-md"><ArrowUpRight size={14} /></div> +14.2% Growth
                       </div>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -4 }}
                        className="bg-slate-50 p-8 rounded-3xl border border-white shadow-sm space-y-6 flex flex-col justify-between"
                    >
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                            <Building size={24} />
                         </div>
                         <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800">Bank Settlement</h3>
                       </div>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Connect your local bank account for fast earnings settlement.</p>
                       <button className="w-full py-4 bg-slate-900 text-accent rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-colors hover:bg-slate-800">
                          Account Settings
                       </button>
                    </motion.div>

                   <div className="md:col-span-2 mt-4">
                      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-100 bg-slate-50/10 flex items-center justify-between">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-800">Recent Activity</h3>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Live</span>
                            </div>
                        </div>
                        <TransactionHistory />
                      </div>
                   </div>
                </div>
             ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <TransactionHistory />
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TrendingUp = ({ size }: { size: number }) => <ArrowDownLeft size={size} />;
