import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  History,
  Info,
  CreditCard,
  Building,
  Copy,
  Check,
  Send,
  ArrowRight,
  Smartphone,
  BookOpen,
  Wifi,
  ShieldCheck,
  ChevronRight,
  X,
  Zap
} from 'lucide-react';
import { TransactionHistory } from './TransactionHistory';
import { dbService } from '../../services/dbService';

interface WalletPageProps {
  profile: any;
}

export const WalletPage: React.FC<WalletPageProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [monnifyAccount, setMonnifyAccount] = useState<any>(
    profile.monnifyAccountNumber ? {
      monnifyAccountNumber: profile.monnifyAccountNumber,
      monnifyBankName: profile.monnifyBankName
    } : null
  );
  const [activeModal, setActiveModal] = useState<'transfer' | 'withdraw' | 'airtime' | 'data' | 'course' | null>(null);
  
  // State for forms
  const [formData, setFormData] = useState({
    targetId: '',
    amount: '',
    accountNumber: '',
    bankCode: '035', // Wema Bank default for mock
    accountName: '',
    phone: '',
    network: 'MTN',
    package: '',
    courseId: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!monnifyAccount) {
      loadVirtualAccount();
    }
  }, [profile.uid]);

  const loadVirtualAccount = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await dbService.getVirtualAccount(profile.uid, profile.displayName, profile.email);
      if (data && !data.error) {
        setMonnifyAccount(data);
      } else if (data && data.error) {
        setError(data.error);
      }
    } catch (err: any) {
      setError('Connection to banking node interrupted.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const amount = Number(formData.amount);
      if (isNaN(amount) || amount <= 0) throw new Error('Invalid amount');

      switch (activeModal) {
        case 'transfer':
          await dbService.transferWallet(profile.uid, formData.targetId, amount);
          setSuccess('Neural link successful! Funds synchronized.');
          break;
        case 'withdraw':
          await dbService.withdrawToBank(profile.uid, {
            amount,
            bankCode: formData.bankCode,
            accountNumber: formData.accountNumber,
            accountName: formData.accountName || 'Bank Account'
          });
          setSuccess('Withdrawal sequence initiated. Awaiting node confirmation.');
          break;
        case 'airtime':
          await dbService.payUtility(profile.uid, {
            type: 'airtime',
            amount,
            detail: formData.phone,
            description: `Airtime Recharge for ${formData.phone}`
          });
          setSuccess('Signal boost successful! Airtime received.');
          break;
        case 'data':
          await dbService.payUtility(profile.uid, {
            type: 'data',
            amount,
            detail: `${formData.phone} (${formData.package})`,
            description: `Data Bundle (${formData.package}) for ${formData.phone}`
          });
          setSuccess('Bandwidth expanded! Data bundle active.');
          break;
        case 'course':
          await dbService.payUtility(profile.uid, {
            type: 'course_subscription',
            amount,
            detail: formData.courseId,
            description: `Subscribed to ${formData.courseId}`
          });
          setSuccess('Neural engram downloaded! Course access granted.');
          break;
      }
      
      setTimeout(() => {
        setActiveModal(null);
        setSuccess('');
        setFormData({
            targetId: '',
            amount: '',
            accountNumber: '',
            bankCode: '035',
            accountName: '',
            phone: '',
            network: 'MTN',
            package: '',
            courseId: ''
          });
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderModal = () => {
    if (!activeModal) return null;

    const modalConfig = {
      transfer: { title: 'Neural Transfer', icon: Send, sub: 'Sync funds with another scholar node' },
      withdraw: { title: 'Bank Settlement', icon: Building, sub: 'Extract funds to your local bank node' },
      airtime: { title: 'Signal Boost', icon: Smartphone, sub: 'Recharge airtime for any mobile device' },
      data: { title: 'Data Expansion', icon: Wifi, sub: 'Activate high-speed data bandwidth' },
      course: { title: 'Knowledge Intake', icon: BookOpen, sub: 'Unlock premium scholar courseware' }
    }[activeModal];

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveModal(null)}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white w-full max-w-md rounded-[40px] p-10 relative z-10 shadow-2xl space-y-8"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold uppercase tracking-tight text-slate-900 flex items-center gap-2">
                <modalConfig.icon className="text-primary" size={24} /> {modalConfig.title}
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{modalConfig.sub}</p>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
               <X size={20} />
            </button>
          </div>

          {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-rose-100">{error}</div>}
          {success && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-emerald-100">{success}</div>}

          <form onSubmit={handleAction} className="space-y-6">
            {activeModal === 'transfer' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Scholar ID</label>
                  <input 
                    value={formData.targetId}
                    onChange={e => setFormData({...formData, targetId: e.target.value})}
                    placeholder="e.g. joshua1234"
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none font-bold"
                  />
                </div>
              </div>
            )}

            {activeModal === 'withdraw' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank</label>
                    <select 
                      className="w-full h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none font-bold text-xs"
                      value={formData.bankCode}
                      onChange={e => setFormData({...formData, bankCode: e.target.value})}
                    >
                      <option value="035">Wema Bank</option>
                      <option value="058">GTBank</option>
                      <option value="011">First Bank</option>
                      <option value="044">Access Bank</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Details</label>
                    <input 
                      value={formData.accountNumber}
                      onChange={e => setFormData({...formData, accountNumber: e.target.value})}
                      placeholder="Account No"
                      className="w-full h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none font-bold text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Name</label>
                  <input 
                    value={formData.accountName}
                    onChange={e => setFormData({...formData, accountName: e.target.value})}
                    placeholder="Verify name on account"
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none font-bold text-xs uppercase"
                  />
                </div>
              </div>
            )}

            {(activeModal === 'airtime' || activeModal === 'data') && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Provider</label>
                    <select 
                      className="w-full h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none font-bold text-xs"
                      value={formData.network}
                      onChange={e => setFormData({...formData, network: e.target.value})}
                    >
                      <option value="MTN">MTN</option>
                      <option value="Airtel">Airtel</option>
                      <option value="Glo">Glo</option>
                      <option value="9mobile">9mobile</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mobile String</label>
                    <input 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="080XXXXXXXX"
                      className="w-full h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none font-bold text-xs"
                    />
                  </div>
                </div>
                {activeModal === 'data' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neural Packages</label>
                    <select 
                      className="w-full h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none font-bold text-xs"
                      value={formData.package}
                      onChange={e => setFormData({...formData, package: e.target.value})}
                    >
                      <option value="">Select Bandwidth...</option>
                      <option value="1GB/1day">1GB Daily - ₦300</option>
                      <option value="2.5GB/2days">2.5GB 2-Day - ₦500</option>
                      <option value="5GB/30days">5GB Monthly - ₦1,200</option>
                      <option value="10GB/30days">10GB Monthly - ₦2,500</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Liquidity Amount (₦)</label>
              <input 
                type="number"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                placeholder="0"
                className="w-full h-20 px-8 rounded-[32px] bg-slate-900 text-accent outline-none font-black text-3xl shadow-inner text-center"
              />
            </div>

            <motion.button 
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-6 bg-primary text-white rounded-[32px] font-black uppercase text-xs tracking-[0.4em] shadow-xl disabled:opacity-50"
            >
              {isLoading ? 'Authorizing...' : 'Sync Transaction'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AnimatePresence>{renderModal()}</AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-4">
        <div className="space-y-1">
          <div className="inline-block px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold uppercase tracking-widest mb-1">Asset Control</div>
          <h1 className="text-4xl font-black uppercase tracking-tight">Financial <span className="text-primary italic">Forge</span></h1>
          <p className="text-slate-500 font-medium text-sm">Synchronize your scholarship yields and network assets.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Balance Card */}
        <div className="lg:col-span-1 space-y-4 md:space-y-8">
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-slate-900 text-white p-6 md:p-12 rounded-[32px] md:rounded-[56px] shadow-2xl relative overflow-hidden group min-h-[300px] md:min-h-[420px] flex flex-col justify-between"
          >
            <div className="relative z-10 space-y-8 md:space-y-12">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-md rounded-2xl md:rounded-[28px] border border-white/20 flex items-center justify-center text-accent shadow-inner">
                  <Wallet size={24} className="md:w-8 md:h-8" />
                </div>
                <div className="text-right">
                    <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-white/30">Scholar Wallet</p>
                    <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-accent mt-1 md:mt-2">LINK: {profile.walletId || 'INITIATING...'}</p>
                </div>
              </div>
              
              <div className="space-y-2 md:space-y-3">
                <p className="text-[9px] md:text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">Available Liquidity</p>
                <div className="flex items-baseline gap-2">
                   <span className="text-4xl md:text-6xl font-black tracking-tighter">₦{profile.walletBalance?.toLocaleString() || 0}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                 <motion.button 
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => setActiveTab('overview')}
                   className="bg-white text-primary py-4 md:py-5 rounded-xl md:rounded-[24px] font-black uppercase text-[9px] md:text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg"
                 >
                    <ArrowDownLeft size={14} className="md:w-4 md:h-4" /> Fund
                 </motion.button>
                 <motion.button 
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => setActiveModal('withdraw')}
                   className="bg-white/10 text-white backdrop-blur-md py-4 md:py-5 rounded-xl md:rounded-[24px] font-black uppercase text-[9px] md:text-[10px] tracking-widest flex items-center justify-center gap-2 border border-white/10 hover:bg-white/20 transition-all"
                 >
                    <ArrowUpRight size={14} className="md:w-4 md:h-4" /> Withdraw
                 </motion.button>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-[120px] -mr-32 -mt-32 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -ml-24 -mb-24"></div>
          </motion.div>

          {/* Monnify Dedicated Account Card */}
          <div className="bg-emerald-50 rounded-[32px] md:rounded-[48px] p-6 md:p-10 border border-emerald-100 shadow-sm space-y-6 relative overflow-hidden group">
             <div className="flex items-center justify-between relative z-10">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-[24px] bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                   <Building size={24} className="md:w-7 md:h-7" />
                </div>
                <div className="text-[8px] md:text-[10px] font-black uppercase text-emerald-600 tracking-widest flex items-center gap-2 px-3 md:px-4 py-1.5 bg-white/50 rounded-full border border-emerald-200">
                   Secured Node <ShieldCheck size={12} className="md:w-[14px] md:h-[14px]" />
                </div>
             </div>
             
             <div className="space-y-4 md:space-y-6 relative z-10">
                <p className="text-[8px] md:text-[10px] font-black text-emerald-800/60 uppercase tracking-[0.2em]">Dedicated Funding Portal</p>
                {monnifyAccount ? (
                  <div className="space-y-4 md:space-y-6">
                    <div className="space-y-1 md:space-y-2">
                       <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{monnifyAccount.monnifyAccountNumber}</p>
                       <p className="text-xs md:text-sm font-black text-emerald-700 tracking-wide">{monnifyAccount.monnifyBankName}</p>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(monnifyAccount.monnifyAccountNumber)}
                      className="w-full h-14 bg-white/60 border border-emerald-200 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:bg-white transition-all shadow-sm"
                    >
                       {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />} {copied ? 'Copied to Buffer' : 'Copy Node Address'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                     {isLoading ? (
                       <div className="animate-pulse space-y-4">
                          <div className="h-10 w-full bg-emerald-200/50 rounded-2xl"></div>
                          <div className="h-6 w-1/2 bg-emerald-200/50 rounded-xl"></div>
                       </div>
                     ) : (
                       <div className="space-y-4">
                          <p className="text-[10px] text-emerald-600 font-bold uppercase leading-relaxed">No active funding node detected.</p>
                          <button 
                            onClick={loadVirtualAccount}
                            className="w-full h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg"
                          >
                             Generate Node Address
                          </button>
                       </div>
                     )}
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Action Grid & History */}
        <div className="lg:col-span-2 space-y-6 md:space-y-10">
           <div className="bg-white rounded-[32px] md:rounded-[56px] p-6 md:p-10 border border-slate-100 shadow-sm space-y-6 md:space-y-10">
              <div className="flex items-center justify-between">
                 <h3 className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Utility Protocols</h3>
                 <div className="h-px flex-1 bg-slate-50 mx-4 md:mx-6"></div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
                 {[
                   { id: 'airtime', icon: Smartphone, label: 'Airtime', color: 'text-orange-500', bg: 'bg-orange-50', sub: 'Signal' },
                   { id: 'data', icon: Wifi, label: 'Data', color: 'text-blue-500', bg: 'bg-blue-50', sub: 'Bandwidth' },
                   { id: 'course', icon: BookOpen, label: 'Courses', color: 'text-indigo-500', bg: 'bg-indigo-50', sub: 'Knowledge' },
                   { id: 'transfer', icon: Zap, label: 'Transfer', color: 'text-primary', bg: 'bg-emerald-50', sub: 'Neural' }
                 ].map(item => (
                   <button 
                     key={item.id}
                     onClick={() => setActiveModal(item.id as any)}
                     className={`${item.bg} p-6 md:p-8 rounded-3xl md:rounded-[40px] flex flex-col items-center justify-center gap-3 md:gap-4 transition-all hover:scale-[1.05] hover:shadow-lg border border-transparent hover:border-white shadow-sm group`}
                   >
                     <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-xl md:rounded-[20px] flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform">
                        <item.icon className={`${item.color} md:w-7 md:h-7`} size={20} />
                     </div>
                     <div className="text-center">
                        <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] ${item.color}`}>{item.label}</p>
                        <p className="text-[7px] md:text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-50">{item.sub}</p>
                     </div>
                   </button>
                 ))}
              </div>
           </div>

           <div className="space-y-4 md:space-y-6">
              {/* ... tabs ... */}
              <div className="flex items-center gap-4 md:gap-8 border-b border-slate-100 px-2 md:px-0">
                 <button 
                    onClick={() => setActiveTab('overview')}
                    className={`pb-3 md:pb-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'overview' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    Asset Flow
                    {activeTab === 'overview' && <motion.div layoutId="wallet-tab" className="absolute bottom-[-1px] left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_0_15px_rgba(20,184,166,0.5)]" />}
                 </button>
                 <button 
                    onClick={() => setActiveTab('history')}
                    className={`pb-3 md:pb-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'history' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    Revenue Audit
                    {activeTab === 'history' && <motion.div layoutId="wallet-tab" className="absolute bottom-[-1px] left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_0_15px_rgba(20,184,166,0.5)]" />}
                 </button>
              </div>

              <div className="bg-white rounded-[40px] md:rounded-[48px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                 {activeTab === 'overview' ? (
                   <div className="p-6 md:p-10 space-y-8 md:space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                         <div className="p-6 md:p-8 bg-slate-50 rounded-[32px] md:rounded-[40px] border border-white shadow-sm space-y-4 md:space-y-6">
                            <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Yield Projections</h4>
                            <div className="space-y-2 md:space-y-4">
                               <div className="flex items-baseline gap-2">
                                  <span className="text-3xl md:text-4xl font-black text-slate-900">₦{profile.stats?.monthlyEarnings?.toLocaleString() || 0}</span>
                                  <span className="text-[9px] md:text-[10px] font-bold text-emerald-500">+12%</span>
                               </div>
                               <p className="text-[9px] md:text-[10px] text-slate-400 font-medium uppercase leading-tight">Neural algorithmic projections suggest a 15% increase in next cycle rewards.</p>
                            </div>
                         </div>
                         <div className="p-6 md:p-8 bg-primary rounded-[32px] md:rounded-[40px] text-white shadow-lg space-y-4 md:space-y-6 relative overflow-hidden">
                            <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-accent z-10 relative">Scholar Rank Bonus</h4>
                            <div className="z-10 relative space-y-1 md:space-y-2">
                               <p className="text-xl md:text-2xl font-black">Tier 1 Scholar</p>
                               <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest opacity-60">Unlock Tier 2 at ₦50k Total Revenue</p>
                            </div>
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                         </div>
                      </div>
                      <div className="pt-8 md:pt-10 border-t border-slate-50">
                         <div className="flex items-center justify-between mb-6 md:mb-8">
                            <h4 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Live Network Sync</h4>
                            <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                               <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-emerald-500">Real-time Data</span>
                            </div>
                         </div>
                         <TransactionHistory />
                      </div>
                   </div>
                 ) : (
                    <TransactionHistory />
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
