import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, BookOpen, PenTool, Check, ArrowRight, Award, Briefcase, GraduationCap } from 'lucide-react';
import { dbService } from '../../services/dbService';

interface RoleSelectionProps {
  userId: string;
  onComplete: (role: string) => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ userId, onComplete }) => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Teacher profile fields
  const [teacherData, setTeacherData] = useState({
    qualifications: '',
    experience: 0,
    subjects: [] as string[]
  });

  const availableSubjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Government', 'Literature'];

  const toggleSubject = (s: string) => {
    setTeacherData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(s) 
        ? prev.subjects.filter(item => item !== s)
        : [...prev.subjects, s]
    }));
  };

  const handleStart = async () => {
    if (selectedRole === 'teacher' && step === 1) {
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      await dbService.createUserProfile(userId, {
        uid: userId,
        role: selectedRole,
        walletBalance: 0,
        isVerifiedTeacher: false,
        teacherProfile: selectedRole === 'teacher' ? {
          ...teacherData,
          approvalStatus: 'pending'
        } : null,
        stats: {
          totalQuizzes: 0,
          averageScore: 0,
          questionsContributed: 0,
          approvalRate: 0,
          monthlyEarnings: 0,
          studentsReached: 0
        }
      });
      onComplete(selectedRole);
    } catch (error) {
      console.error("Error setting role:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 selection:bg-accent selection:text-primary overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]"></div>
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-4xl w-full space-y-16 relative z-10"
      >
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-2 bg-primary/5 rounded-xl text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/10">Welcome</div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Select Your <span className="text-primary rounded-2xl">Identity</span>
          </h1>
          <p className="text-slate-400 font-medium tracking-tight text-sm max-w-sm mx-auto leading-relaxed">
            Choose your role to customize your specialized learning interface and permissions.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="grid md:grid-cols-2 gap-10"
            >
              <motion.button
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRole('student')}
                className={`group relative p-12 rounded-[40px] border-2 text-left transition-all flex flex-col items-center text-center ${
                  selectedRole === 'student' ? 'border-primary bg-white shadow-xl' : 'border-slate-100 bg-slate-50 opacity-60'
                }`}
              >
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all ${
                  selectedRole === 'student' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-slate-300 border border-slate-100'
                }`}>
                  <GraduationCap size={40} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-2">Student</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium px-4">Practice for exams, track progress, and earn rewards for success.</p>
                {selectedRole === 'student' && (
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg"
                  >
                    <Check size={24} />
                  </motion.div>
                )}
              </motion.button>

              <motion.button
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRole('teacher')}
                className={`group relative p-12 rounded-[40px] border-2 text-left transition-all flex flex-col items-center text-center ${
                  selectedRole === 'teacher' ? 'border-primary bg-white shadow-xl' : 'border-slate-100 bg-slate-50 opacity-60'
                }`}
              >
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all ${
                    selectedRole === 'teacher' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-slate-300 border border-slate-100'
                }`}>
                  <PenTool size={40} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-2">Teacher</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium px-4">Contribute content, verify solutions, and help students excel.</p>
                {selectedRole === 'teacher' && (
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg"
                  >
                    <Check size={24} />
                  </motion.div>
                )}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="bg-white p-12 rounded-[60px] shadow-3d border-4 border-slate-100 space-y-12"
            >
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
                    <GraduationCap size={14} className="text-primary" /> Credentials (B.Ed, PhD)
                  </label>
                  <input 
                    type="text"
                    placeholder="ENTER DEGREES..."
                    className="w-full bg-slate-50 border-4 border-slate-100 rounded-3xl p-6 text-sm font-black uppercase tracking-widest focus:border-primary outline-none transition-all neo-3d"
                    value={teacherData.qualifications}
                    onChange={e => setTeacherData({...teacherData, qualifications: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
                    <Briefcase size={14} className="text-primary" /> Combat Experience
                  </label>
                  <input 
                    type="number"
                    placeholder="TOTAL YEARS..."
                    className="w-full bg-slate-50 border-4 border-slate-100 rounded-3xl p-6 text-sm font-black uppercase tracking-widest focus:border-primary outline-none transition-all neo-3d"
                    value={teacherData.experience || ''}
                    onChange={e => setTeacherData({...teacherData, experience: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
                  <Award size={14} className="text-primary" /> Core Disciplines
                </label>
                <div className="flex flex-wrap gap-3">
                  {availableSubjects.map(s => (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleSubject(s)}
                      className={`px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all border-4 neo-3d ${
                        teacherData.subjects.includes(s) 
                          ? 'bg-primary border-primary text-white translate-y-[-2px]' 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <button onClick={() => setStep(1)} className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] hover:text-primary transition-colors block w-full text-center">
                ← Re-initialize Avatar Sync
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          disabled={isSubmitting || (selectedRole === 'teacher' && step === 2 && (teacherData.subjects.length === 0 || !teacherData.qualifications))}
          className="bg-slate-900 text-white px-12 py-6 rounded-2xl font-bold text-lg tracking-tight transition-all flex items-center gap-4 mx-auto disabled:opacity-50 group shadow-xl"
        >
          {isSubmitting ? 'Finalizing...' : step === 1 && selectedRole === 'teacher' ? 'Continue' : 'Start Journey'} 
          <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
        </motion.button>
      </motion.div>
    </div>
  );
};
