import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ChevronLeft, ChevronRight, Flag, Send, CheckCircle2, XCircle } from 'lucide-react';
import { dbService } from '../../services/dbService';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface QuizPlayerProps {
  subject: string;
  userId: string;
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ subject, userId, onComplete, onExit }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      // For MVP, we fetch approved questions for the subject
      const q = query(
        collection(db, 'questions'),
        where('subject', '==', subject.replace('JAMB ', '')),
        where('status', '==', 'approved'),
        limit(10) // Small batch for testing
      );
      
      const results = await dbService.getQuestions(q);
      if (results && results.length > 0) {
        setQuestions(results);
      } else {
        // Mock some data if DB is empty for initial demo
        setQuestions([
          {
            text: "What is the primary function of the root in plants?",
            options: ["Photosynthesis", "Absorption of water and minerals", "Seed production", "Transpiration"],
            correctOption: 1,
            explanation: "Roots absorb water and dissolved minerals from the soil and transport them upward."
          },
          {
            text: "In the sentence 'The quick brown fox jumps over the lazy dog', which word is a verb?",
            options: ["Quick", "Brown", "Jumps", "Lazy"],
            correctOption: 2,
            explanation: "'Jumps' is the action being performed."
          },
          {
             text: "Solve for x: 2x + 5 = 15",
             options: ["5", "10", "7.5", "20"],
             correctOption: 0,
             explanation: "2x = 15 - 5 => 2x = 10 => x = 5"
          }
        ]);
      }
      setLoading(false);
    };

    fetchQuestions();
  }, [subject]);

  useEffect(() => {
    if (timeLeft <= 0) handleFinish();
    if (isFinished) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const handleFinish = async () => {
    setIsFinished(true);
    let correct = 0;
    const answeredQuestionIds: string[] = [];
    
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctOption) {
        correct++;
      }
      if (q.id) answeredQuestionIds.push(q.id);
    });
    
    const finalScore = Math.round((correct / questions.length) * 100);
    await dbService.saveAttempt(userId, {
      subject,
      score: finalScore,
      totalQuestions: questions.length,
      duration: 3600 - timeLeft
    });

    // Record royalties for contributors
    for (const q of questions) {
      if (q.creatorId && q.id) {
        await dbService.recordUsageRoyalty(q.id, q.creatorId);
      }
    }
    
    onComplete(finalScore);
  };

  const handleRate = async (rating: number) => {
    // Rate all questions in the set or just a general feedback? 
    // Usually it represents the quality of the set.
    for (const q of questions) {
        if (q.id) await dbService.rateQuestion(q.id, rating);
    }
    handleFinish();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="font-bold text-slate-500">Preparing your questions...</p>
    </div>
  );

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-32">
      {/* Quiz Header */}
      <div className="sticky top-28 z-40 glass p-6 rounded-[32px] border-2 border-white/40 flex items-center justify-between neo-3d shadow-2xl">
        <div className="flex items-center gap-6">
          <button onClick={onExit} className="w-12 h-12 bg-slate-100 flex items-center justify-center rounded-2xl hover:bg-slate-200 transition-colors neo-3d">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">Combat Subject</h2>
            <p className="font-black text-xl text-primary uppercase tracking-tighter italic leading-none">{subject}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Integrity Index</p>
            <p className="text-lg font-black text-slate-900 mt-1 italic tracking-widest">{currentIndex + 1} / {questions.length}</p>
          </div>
          <div className={`flex flex-col items-center justify-center min-w-[100px] py-2 px-4 rounded-2xl neo-3d-accent border border-accent/20 ${timeLeft < 300 ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-900 text-accent'}`}>
            <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Terminal Time</span>
            <span className="text-xl font-black font-mono italic tracking-tighter">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden neo-3d border-2 border-white/40">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          className="bg-primary h-full shadow-[0_0_20px_rgba(30,64,175,0.5)]"
        />
      </div>

      {/* Question Content */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          initial={{ rotateY: -10, scale: 0.95, opacity: 0 }}
          animate={{ rotateY: 0, scale: 1, opacity: 1 }}
          exit={{ rotateY: 10, scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 15 }}
          className="bg-white p-12 rounded-[60px] border-2 border-slate-100 shadow-3d min-h-[500px] flex flex-col justify-between relative overflow-hidden"
        >
          {/* Decorative index */}
          <span className="absolute -top-10 -right-10 text-[200px] font-black text-slate-50 select-none -z-0 leading-none">
            {currentIndex + 1}
          </span>

          <div className="space-y-12 relative z-10">
            <h3 className="text-3xl font-black text-slate-900 leading-[1.1] tracking-tight italic">
              {currentQuestion.text}
            </h3>

            <div className="grid gap-4">
              {currentQuestion.options.map((option: string, idx: number) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02, x: 10 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setAnswers({ ...answers, [currentIndex]: idx })}
                  className={`w-full p-6 rounded-3xl border-4 text-left transition-all flex items-center justify-between gap-6 group ${
                    answers[currentIndex] === idx 
                    ? 'border-primary bg-primary/5 neo-3d active:translate-x-0' 
                    : 'border-slate-50 hover:border-slate-200 bg-white shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all neo-3d ${
                      answers[currentIndex] === idx ? 'bg-primary text-white' : 'bg-slate-100 text-slate-300'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className={`text-lg font-bold uppercase tracking-tight ${answers[currentIndex] === idx ? 'text-primary' : 'text-slate-600'}`}>
                      {option}
                    </span>
                  </div>
                  {answers[currentIndex] === idx && (
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white neo-3d"
                    >
                        <CheckCircle2 size={20} />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-16 pt-10 border-t-2 border-slate-50 relative z-10">
            <button 
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all disabled:opacity-30 group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 neo-3d border border-slate-100">
                <ChevronLeft size={20} />
              </div>
              Previous Cycle
            </button>
            
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-slate-300 hover:text-rose-500 transition-colors">
                <Flag size={20} /> Flag Node
              </button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
                  else handleFinish();
                }}
                className="flex items-center gap-4 bg-slate-900 text-accent px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-sm neo-3d-accent border-2 border-white/10"
              >
                {currentIndex === questions.length - 1 ? 'Finalize Logic' : 'Next Cycle'} <ChevronRight size={24} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Quick Navigation Dots */}
      <div className="flex flex-wrap items-center justify-center gap-3 py-10 bg-slate-900/5 rounded-[40px] border-2 border-white/50 neo-3d">
        {questions.map((_, idx) => (
          <motion.button
            key={idx}
            whileHover={{ y: -5 }}
            onClick={() => setCurrentIndex(idx)}
            className={`w-14 h-14 rounded-2xl font-black text-lg transition-all neo-3d ${
              currentIndex === idx 
              ? 'bg-primary text-white border-2 border-white/20' 
              : answers[idx] !== undefined 
                ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
                : 'bg-white text-slate-300 border-2 border-slate-100 hover:border-slate-300'
            }`}
          >
            {idx + 1}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
