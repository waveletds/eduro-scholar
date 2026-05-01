import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Send, 
  Check, 
  AlertCircle,
  HelpCircle,
  Hash,
  BookOpen,
  Layers,
  Settings,
  Plus
} from 'lucide-react';
import { dbService } from '../../services/dbService';
import { supabase } from '../../lib/supabase';

interface ContributionFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const ContributionForm: React.FC<ContributionFormProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    text: '',
    options: ['', '', '', ''],
    correctOption: 0,
    explanation: '',
    subject: 'English',
    topic: '',
    difficulty: 'medium',
    examType: 'JAMB'
  });

  const subjects = ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Government', 'Literature'];
  const examTypes = ['JAMB', 'WAEC', 'NECO', 'NABTEB', 'Post-UTME', 'General'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    // Basic validation
    if (formData.text.length < 10) return setError('Question text is too short.');
    if (formData.options.some(opt => opt.length === 0)) return setError('All options must be filled.');
    if (formData.explanation.length < 20) return setError('Please provide a more detailed explanation.');

    setLoading(true);
    setError(null);

    try {
      await dbService.submitQuestion({
        ...formData,
        creatorId: user.id,
        creatorName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown Scholar',
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit question.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary text-white rounded-xl">
              <PlusSquare size={20} />
            </div>
            <h2 className="text-xl font-bold font-display uppercase tracking-tight">Submit New Question</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm flex items-center gap-3">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {/* Question Text */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <HelpCircle size={12} /> Question Content
            </label>
            <textarea
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[120px]"
              placeholder="Type your question here..."
              value={formData.text}
              onChange={e => setFormData({ ...formData, text: e.target.value })}
            />
          </div>

          {/* Options */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <Hash size={12} /> Answer Options
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.options.map((opt, idx) => (
                <div key={idx} className={`relative flex items-center gap-2 p-2 rounded-xl border-2 transition-all ${formData.correctOption === idx ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 bg-white'}`}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, correctOption: idx })}
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all shrink-0 ${formData.correctOption === idx ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}
                  >
                    {formData.correctOption === idx && <Check size={14} />}
                  </button>
                  <input
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    className="bg-transparent border-none outline-none text-sm w-full py-2 font-medium"
                    value={opt}
                    onChange={e => {
                      const newOptions = [...formData.options];
                      newOptions[idx] = e.target.value;
                      setFormData({ ...formData, options: newOptions });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><BookOpen size={12} /> Subject</label>
                <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                >
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Layers size={12} /> Exam Category</label>
                <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.examType}
                    onChange={e => setFormData({ ...formData, examType: e.target.value })}
                >
                    {examTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>
          </div>

          {/* Detailed Explanation */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <Settings size={12} /> Detailed Explanation
            </label>
            <textarea
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[100px]"
              placeholder="Explain why the answer is correct..."
              value={formData.explanation}
              onChange={e => setFormData({ ...formData, explanation: e.target.value })}
            />
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 sticky bottom-0 z-10">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Submitting...' : <><Send size={18} /> Submit for Review</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const PlusSquare = ({ size }: { size: number }) => <Plus size={size} />;
