import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Smartphone, 
  Wifi, 
  Zap, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Star,
  TrendingUp
} from 'lucide-react';
import { dbService } from '../../services/dbService';

interface VTUPageProps {
  profile: any;
}

export const VTUPage: React.FC<VTUPageProps> = ({ profile }) => {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [type, setType] = useState<'airtime' | 'data'>('airtime');
  const [network, setNetwork] = useState<'mtn' | 'airtel' | 'glo' | '9mobile' | null>(null);

  const networks = [
    { id: 'mtn', name: 'MTN', color: 'bg-yellow-400', banner: 'bg-yellow-50 text-yellow-700' },
    { id: 'airtel', name: 'Airtel', color: 'bg-red-600', banner: 'bg-red-50 text-red-700' },
    { id: 'glo', name: 'GLO', color: 'bg-green-600', banner: 'bg-green-50 text-green-700' },
    { id: '9mobile', name: '9mobile', color: 'bg-emerald-800', banner: 'bg-emerald-50 text-emerald-700' }
  ];

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!network || !amount || !phone) return;
    
    // Basic validation
    if (phone.length < 10) return alert("Invalid phone number");
    if (parseInt(amount) < 100) return alert("Minimum purchase is ₦100");
    if (parseInt(amount) > (profile.walletBalance || 0)) return alert("Insufficient funds in your scholar node");

    setLoading(true);
    try {
      await dbService.payUtility(profile.uid, {
        type: type,
        amount: parseInt(amount),
        detail: `${network.toUpperCase()} ${phone}`,
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} sync for ${phone}`
      });
      setSuccess(true);
    } catch (err: any) {
      alert(err.message || "Financial link interrupted. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 md:p-20 space-y-4 md:space-y-6 text-center animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
             <CheckCircle2 size={32} className="md:w-12 md:h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black font-display uppercase">Success!</h2>
            <p className="text-slate-500 font-medium text-sm md:text-base">₦{amount} {type} sent to {phone}.</p>
          </div>
          <button 
            onClick={() => { setSuccess(false); setAmount(''); setPhone(''); }}
            className="bg-primary text-white px-8 md:px-10 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold hover:shadow-xl transition-all text-sm"
          >
            Buy More
          </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-1 text-center md:text-left">
        <div className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-600 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-2">Carrier Interface</div>
        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">Virtual <span className="text-primary">Bridge</span></h1>
        <p className="text-slate-500 font-medium text-xs md:text-sm">Convert your earnings to airtime or data instantly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
        {/* Network Selection */}
        <div className="md:col-span-2 space-y-6 md:space-y-10">
            <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm space-y-6 md:space-y-8">
               <h3 className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
                  <Zap size={14} className="text-accent md:w-4 md:h-4" /> Select Carrier
               </h3>
               <div className="grid grid-cols-4 md:grid-cols-2 gap-3 md:gap-4">
                  {networks.map(n => (
                     <motion.button
                         key={n.id}
                         whileHover={{ y: -2 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={() => setNetwork(n.id as any)}
                         className={`p-3 md:p-5 rounded-xl md:rounded-2xl border transition-all flex flex-col items-center gap-2 md:gap-3 ${network === n.id ? 'border-primary bg-slate-50 shadow-md' : 'border-slate-100 hover:border-slate-200'}`}
                     >
                         <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl ${n.color} shadow-sm border border-white/30`} />
                         <span className="text-[7px] md:text-[10px] font-bold text-slate-800 uppercase tracking-widest truncate w-full">{n.name}</span>
                     </motion.button>
                  ))}
               </div>
            </div>

            <motion.div 
               whileHover={{ y: -4 }}
               className="bg-slate-900 text-white p-8 md:p-10 rounded-3xl md:rounded-[40px] space-y-4 md:space-y-6 shadow-xl relative overflow-hidden group"
            >
                <div className="relative z-10 space-y-4 md:space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-accent text-primary flex items-center justify-center">
                        <Star size={16} className="md:w-5 md:h-5" />
                     </div>
                     <h3 className="font-bold uppercase tracking-widest text-xs md:text-sm leading-none text-accent">Reward Swap</h3>
                  </div>
                  <p className="text-[9px] md:text-[10px] font-medium text-white/60 leading-relaxed uppercase tracking-widest">
                     Convert your achievement units into mobile airtime and data across all networks.
                  </p>
                  <div className="pt-2">
                    <button className="bg-white text-primary px-6 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
                <div className="absolute -right-8 md:-right-12 -bottom-8 md:-bottom-12 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
                   <Smartphone size={120} className="md:w-[180px] md:h-[180px]" />
                </div>
            </motion.div>
         </div>

         {/* Form area */}
         <div className="md:col-span-3">
             <form onSubmit={handlePurchase} className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-sm space-y-8 md:space-y-10 relative overflow-hidden">
                 <div className="flex p-1 bg-slate-100 rounded-xl md:rounded-2xl border border-slate-50">
                     <button 
                         type="button"
                         onClick={() => setType('airtime')}
                         className={`flex-1 py-3 md:py-4 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 md:gap-3 ${type === 'airtime' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                     >
                         <Zap size={14} className="md:w-4 md:h-4" /> Airtime
                     </button>
                     <button 
                         type="button"
                         onClick={() => setType('data')}
                         className={`flex-1 py-3 md:py-4 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 md:gap-3 ${type === 'data' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                     >
                         <Wifi size={14} className="md:w-4 md:h-4" /> Data
                     </button>
                 </div>

                 <div className="space-y-6 md:space-y-8">
                     <div className="space-y-2 md:space-y-3">
                         <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
                             <Smartphone size={14} className="text-primary md:w-4 md:h-4" /> Recipient Number
                         </label>
                         <div className="relative group">
                             <input 
                                 type="tel"
                                 required
                                 placeholder="080 0000 0000"
                                 className="w-full bg-slate-50 border-4 border-slate-50 rounded-[24px] md:rounded-[32px] p-5 md:p-6 text-xl md:text-2xl font-black focus:border-primary outline-none transition-all pl-16 md:pl-20 shadow-inner italic"
                                 value={phone}
                                 onChange={e => setPhone(e.target.value)}
                             />
                             <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 p-2 md:p-2.5 bg-white border-2 border-slate-100 rounded-xl md:rounded-2xl shadow-sm font-black text-[9px] md:text-[10px] text-primary">
                                 +234
                             </div>
                         </div>
                     </div>

                     <div className="space-y-3 md:space-y-4">
                         <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center gap-3 italic">
                             <TrendingUp size={14} className="text-primary md:w-4 md:h-4" /> PAYLOAD_MAGNITUDE
                         </label>
                         <div className="grid grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
                             {[100, 200, 500, 1000].map(val => (
                                 <motion.button 
                                     key={val}
                                     type="button"
                                     whileHover={{ y: -4 }}
                                     onClick={() => setAmount(val.toString())}
                                     className={`py-3 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black border-2 transition-all ${amount === val.toString() ? 'bg-primary text-white border-primary shadow-xl' : 'bg-white text-slate-400 border-slate-50 hover:border-slate-200'}`}
                                 >
                                     ₦{val}
                                 </motion.button>
                             ))}
                         </div>
                         <input 
                             type="number"
                             required
                             placeholder="CUSTOM_AMOUNT..."
                             className="w-full bg-slate-50 border-4 border-slate-50 rounded-[24px] md:rounded-[32px] p-5 md:p-6 text-xl md:text-2xl font-black focus:border-primary outline-none transition-all shadow-inner italic"
                             value={amount}
                             onChange={e => setAmount(e.target.value)}
                         />
                     </div>
                 </div>

                 <div className="p-6 md:p-8 bg-slate-900 rounded-2xl md:rounded-[32px] flex items-center justify-between relative overflow-hidden group">
                    <div className="relative z-10 space-y-1">
                        <p className="text-[9px] md:text-[10px] font-bold text-white/30 uppercase tracking-widest leading-none">Total Debit</p>
                        <p className="text-3xl md:text-4xl font-bold text-white tracking-tighter leading-none mt-1">₦{amount || '0'}</p>
                    </div>
                    <div className="text-right relative z-10 space-y-1">
                        <p className="text-[9px] md:text-[10px] font-bold text-white/30 uppercase tracking-widest leading-none">Wallet Balance</p>
                        <p className="text-sm md:text-md font-bold text-accent mt-1">₦{profile.walletBalance?.toLocaleString()}</p>
                    </div>
                </div>

                <div className="space-y-6 pt-2">
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading || !network || parseInt(amount) < 100}
                        className="w-full bg-primary text-white py-4 md:py-6 rounded-2xl md:rounded-3xl font-bold uppercase tracking-widest text-[10px] md:text-[11px] shadow-lg disabled:opacity-30 flex items-center justify-center gap-3 md:gap-4 border border-white/10"
                    >
                        {loading ? (
                            <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>Purchase Now <ArrowRight size={18} className="md:w-5 md:h-5" /></>
                        )}
                    </motion.button>
                </div>
             </form>
         </div>
      </div>
    </div>
  );
};
