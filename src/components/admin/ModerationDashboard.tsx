import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  AlertTriangle,
  Search,
  Check,
  X,
  MessageSquare,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { dbService } from '../../services/dbService';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

export const ModerationDashboard: React.FC = () => {
  const [pendingQuestions, setPendingQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchPending = async () => {
    setLoading(true);
    const q = query(
      collection(db, 'questions'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'asc')
    );
    const docs = await dbService.getQuestions(q);
    setPendingQuestions(docs || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id: string) => {
    await dbService.adminApproveQuestion(id);
    setPendingQuestions(prev => prev.filter(q => q.id !== id));
    setSelectedQuestion(null);
  };

  const handleReject = async () => {
    if (!rejectionReason) return;
    await dbService.adminRejectQuestion(selectedQuestion.id, rejectionReason);
    setPendingQuestions(prev => prev.filter(q => q.id !== selectedQuestion.id));
    setSelectedQuestion(null);
    setShowRejectModal(false);
    setRejectionReason('');
  };

  return (
    <div className="space-y-12 pb-32">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
            <div className="inline-block px-4 py-1.5 bg-slate-900 text-accent rounded-xl text-[10px] font-bold uppercase tracking-widest mb-2 shadow-sm">Gatekeeper Protocol</div>
            <h1 className="text-4xl font-bold tracking-tight">Moderation <span className="text-primary italic">Center</span></h1>
            <p className="text-slate-400 font-medium tracking-tight text-sm">Review and verify community-contributed educational content.</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
           <AlertTriangle size={24} className="text-amber-500" />
           <div>
               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Awaiting Review</p>
               <p className="text-lg font-bold text-slate-900 mt-1">{pendingQuestions.length} Modules</p>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* List */}
        <div className="space-y-6">
          {loading ? (
            <div className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs animate-pulse">Scanning Grid...</div>
          ) : pendingQuestions.length === 0 ? (
            <div className="bg-white p-20 rounded-[40px] border border-slate-100 text-center space-y-6 shadow-sm">
               <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                  <CheckCircle2 size={40} />
               </div>
               <div className="space-y-1">
                 <p className="font-bold text-slate-900 text-xl tracking-tight">Queue Clear</p>
                 <p className="text-xs text-slate-400 font-medium">No unauthorized patterns detected.</p>
               </div>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingQuestions.map(q => (
                <motion.button
                  key={q.id}
                  whileHover={{ x: 5 }}
                  onClick={() => setSelectedQuestion(q)}
                  className={`w-full text-left p-6 rounded-3xl border transition-all flex items-start gap-4 group relative overflow-hidden ${
                    selectedQuestion?.id === q.id ? 'border-primary bg-white shadow-lg translate-x-2' : 'border-slate-100 bg-slate-50 opacity-100 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${selectedQuestion?.id === q.id ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-slate-300 border-slate-100 group-hover:text-primary transition-colors'}`}>
                    <Clock size={24} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase text-primary tracking-widest">{q.subject}</span>
                      <span className="text-slate-200">|</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{q.examType}</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight tracking-tight">{q.text}</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-2">By: {q.creatorName || q.creatorId}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Details View */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {selectedQuestion ? (
              <motion.div 
                key={selectedQuestion.id}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl sticky top-32 space-y-10 relative overflow-hidden"
              >
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Question Analysis</h3>
                    <div className="px-4 py-1.5 bg-slate-900 text-accent rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg">
                       Difficulty: {selectedQuestion.difficulty}
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">{selectedQuestion.text}</p>
                </div>

                <div className="space-y-4 relative z-10">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Responses</h4>
                  <div className="grid gap-3">
                    {selectedQuestion.options.map((opt: string, i: number) => (
                      <div key={i} className={`p-5 rounded-2xl border flex items-center gap-4 transition-all ${i === selectedQuestion.correctOption ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-50 bg-slate-50/50'}`}>
                         <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg border-2 ${i === selectedQuestion.correctOption ? 'bg-emerald-500 text-white border-emerald-400 shadow-md' : 'bg-white text-slate-300 border-slate-100'}`}>
                            {String.fromCharCode(65 + i)}
                         </span>
                         <span className={`text-lg font-bold tracking-tight ${i === selectedQuestion.correctOption ? 'text-emerald-700' : 'text-slate-600'}`}>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-slate-900 rounded-3xl space-y-2 relative z-10 shadow-lg">
                   <h4 className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare size={14} /> Explanation
                   </h4>
                   <p className="text-sm text-white/70 leading-relaxed font-medium">{selectedQuestion.explanation}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <motion.button 
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowRejectModal(true)}
                    className="flex items-center justify-center gap-3 bg-white border border-rose-100 text-rose-600 py-5 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-sm hover:bg-rose-50 transition-all"
                  >
                    <XCircle size={20} /> Reject
                  </motion.button>
                  <motion.button 
                     whileHover={{ y: -2 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={() => handleApprove(selectedQuestion.id)}
                     className="flex items-center justify-center gap-3 bg-emerald-600 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-lg hover:bg-emerald-700 transition-all"
                  >
                    <CheckCircle2 size={20} /> Approve
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[64px] h-[700px] flex flex-col items-center justify-center text-slate-300 p-12 text-center space-y-8 sticky top-32">
                 <div className="w-32 h-32 bg-white rounded-[40px] flex items-center justify-center neo-3d border border-slate-100">
                    <Search size={64} className="opacity-20" />
                 </div>
                 <div className="space-y-4">
                    <p className="font-black text-slate-400 uppercase tracking-widest text-xl italic">Awaiting Module Selection</p>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] max-w-xs leading-relaxed">Neural data modules selected from the grid will appear here for verification against JAMB/WAEC protocols.</p>
                 </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-6">
          <motion.div 
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white max-w-xl w-full p-16 rounded-[60px] shadow-2xl border-4 border-slate-100 space-y-10 relative overflow-hidden"
          >
            <div className="space-y-4 relative z-10 text-center">
              <h3 className="text-4xl font-black uppercase tracking-tighter italic">PURGE <span className="text-rose-600 not-italic">MODULE</span></h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Supply the reason code for pattern rejection.</p>
            </div>
            
            <div className="space-y-6 relative z-10">
               <textarea 
                  className="w-full bg-slate-50 border-4 border-slate-100 rounded-[32px] p-8 text-sm font-black uppercase tracking-widest min-h-[180px] outline-none focus:border-rose-500 transition-all neo-3d"
                  placeholder="EXPLAIN ANOMALY..."
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
               />
            </div>

            <div className="flex gap-6 relative z-10">
              <button onClick={() => setShowRejectModal(false)} className="flex-1 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Abort Purge</button>
              <button 
                onClick={handleReject}
                className="flex-1 bg-rose-600 text-white py-6 rounded-[32px] font-black uppercase tracking-widest text-xs neo-3d border-2 border-white/20 hover:bg-rose-700 transition-all shadow-xl shadow-rose-500/20"
                disabled={!rejectionReason}
              >
                Purge Node
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
