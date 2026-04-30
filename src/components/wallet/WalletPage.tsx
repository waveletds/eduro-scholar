import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Smartphone, 
  History,
  Info,
  CreditCard,
  Building,
  Copy,
  Check,
  Send,
  ArrowRight
} from 'lucide-react';
import { TransactionHistory } from './TransactionHistory';
import { dbService } from '../../services/dbService';

interface WalletPageProps {
  profile: any;
}

export const WalletPage: React.FC<WalletPageProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [monnifyAccount, setMonnifyAccount] = useState<any>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferData, setTransferData] = useState({ targetId: '', amount: '' });
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferError, setTransferError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadVirtualAccount();
  }, [profile.uid]);

  const loadVirtualAccount = async () => {
    const data = await dbService.getVirtualAccount(profile.uid, profile.displayName, profile.email);
    if (data) setMonnifyAccount(data);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTransfer = async () => {
    if (!transferData.targetId || !transferData.amount) return;
    setIsTransferring(true);
    setTransferError('');
    try {
      await dbService.transferWallet(profile.uid, transferData.targetId, Number(transferData.amount));
      setShowTransferModal(false);
      setTransferData({ targetId: '', amount: '' });
      // In a real app we'd refresh profile balance via context or snapshot
    } catch (err: any) {
      setTransferError(err.message);
    } finally {
      setIsTransferring(false);
    }
  };

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
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">Scholar Wallet</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-accent mt-1">Ref: {profile.walletId || '---'}</p>
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
                   onClick={() => setActiveTab('overview')}
                   className="bg-white text-primary py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-accent"
                 >
                    <ArrowDownLeft size={16} /> Fund
                 </motion.button>
                 <motion.button 
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => setShowTransferModal(true)}
                   className="bg-white/10 text-white backdrop-blur-md py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 border border-white/10 hover:bg-white/20 transition-all"
                 >
                    <Send size={16} /> Send
                 </motion.button>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-[120px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -ml-24 -mb-24"></div>
          </motion.div>

          {/* Monnify Dedicated Account Card */}
          <div className="bg-emerald-50 rounded-[40px] p-8 border border-emerald-100 shadow-sm space-y-6 relative overflow-hidden group">
             <div className="flex items-center justify-between relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                   <Building size={24} />
                </div>
                <div className="text-[9px] font-black uppercase text-emerald-600 tracking-widest flex items-center gap-2 px-3 py-1 bg-white/50 rounded-full border border-emerald-200">
                   Monnify Secured <ShieldCheck size={12} />
                </div>
             </div>
             
             <div className="space-y-4 relative z-10">
                <p className="text-[10px] font-bold text-emerald-800/60 uppercase tracking-widest">Dedicated Funding Account</p>
                {monnifyAccount ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                       <p className="text-xl font-bold text-slate-900 tracking-tight">{monnifyAccount.monnifyAccountNumber}</p>
                       <p className="text-sm font-bold text-emerald-700">{monnifyAccount.monnifyBankName}</p>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(monnifyAccount.monnifyAccountNumber)}
                      className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-800 transition-colors"
                    >
                       {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />} {copied ? 'Copied to Buffer' : 'Copy Account Number'}
                    </button>
                  </div>
                ) : (
                  <div className="animate-pulse space-y-2">
                     <div className="h-6 w-3/4 bg-emerald-200/50 rounded-lg"></div>
                     <div className="h-4 w-1/2 bg-emerald-200/50 rounded-lg"></div>
                  </div>
                )}
             </div>
             
             <p className="text-[9px] text-emerald-800/40 leading-relaxed font-medium relative z-10 uppercase py-2 border-t border-emerald-200/50 mt-4">
               Transfers to this account will automatically reflect in your Eduro Scholar wallet within 5 minutes.
             </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-8 border-b border-slate-100">
             <button 
                onClick={() => setActiveTab('overview')}
                className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'overview' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
             >
                Portfolio
                {activeTab === 'overview' && <motion.div layoutId="wallet-tab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-sm" />}
             </button>
             <button 
                onClick={() => setActiveTab('history')}
                className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'history' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
             >
                Revenue Logs
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
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 font-medium">Estimated neural yield</p>
                       </div>
                       <div className="pt-6 border-t border-slate-50 flex items-center gap-3 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                          <div className="bg-emerald-50 p-1 rounded-md"><ArrowUpRight size={14} /></div> +14.2% Flux
                       </div>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -4 }}
                        className="bg-slate-50 p-8 rounded-3xl border border-white shadow-sm space-y-6 flex flex-col justify-between"
                    >
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                            <Send size={24} />
                         </div>
                         <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800">Internal Link</h3>
                       </div>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Instantly transfer scholarship funds to other scholars using their unique Wallet ID.</p>
                       <button 
                         onClick={() => setShowTransferModal(true)}
                         className="w-full py-4 bg-slate-900 text-accent rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-colors hover:bg-slate-800"
                       >
                          Initialize Transfer
                       </button>
                    </motion.div>

                   <div className="md:col-span-2 mt-4">
                      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-100 bg-slate-50/10 flex items-center justify-between">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-800">Network Activity</h3>
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

      {/* Transfer Modal */}
      <AnimatePresence>
        {showTransferModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowTransferModal(false)}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="bg-white w-full max-w-md rounded-[40px] p-10 relative z-10 shadow-2xl space-y-8"
             >
                <div className="space-y-2">
                   <h2 className="text-2xl font-bold uppercase tracking-tight text-slate-900">Transfer Signal</h2>
                   <p className="text-xs text-slate-400 font-medium tracking-tight">Synchronize funds with another scholar node.</p>
                </div>

                {transferError && (
                  <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-rose-100">
                    {transferError}
                  </div>
                )}

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Wallet ID</label>
                      <input 
                        value={transferData.targetId}
                        onChange={(e) => setTransferData({ ...transferData, targetId: e.target.value })}
                        placeholder="e.g. joshua1234"
                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none transition-all font-bold text-slate-900"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount (₦)</label>
                      <input 
                        type="number"
                        value={transferData.amount}
                        onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                        placeholder="0.00"
                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none transition-all font-bold text-slate-900"
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <button 
                     onClick={() => setShowTransferModal(false)}
                     className="py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest text-slate-400 hover:bg-slate-50 transition-colors"
                   >
                     Cancel
                   </button>
                   <motion.button 
                     whileTap={{ scale: 0.95 }}
                     onClick={handleTransfer}
                     disabled={isTransferring || !transferData.targetId || !transferData.amount}
                     className="bg-primary text-white py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                   >
                      {isTransferring ? 'Syncing...' : <>Authorize <ArrowRight size={14} /></>}
                   </motion.button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
