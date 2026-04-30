import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { LandingPage } from './components/auth/LandingPage';
import { RoleSelection } from './components/auth/RoleSelection';
import { Header } from './components/common/Header';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { QuizPlayer } from './components/quiz/QuizPlayer';
import { ContributionForm } from './components/teacher/ContributionForm';
import { ModerationDashboard } from './components/admin/ModerationDashboard';
import { WalletPage } from './components/wallet/WalletPage';
import { VTUPage } from './components/vtu/VTUPage';
import { ContestPage } from './components/contest/ContestPage';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { user, profile, loading } = useAuth();
  const [currentView, setView] = useState('dashboard');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showContribute, setShowContribute] = useState(false);
  const [lastQuizScore, setLastQuizScore] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  if (user && !profile && !loading) {
     // Profile is being created or user needs to pick role
     return <RoleSelection userId={user.uid} onComplete={() => window.location.reload()} />;
  }

  const renderContent = () => {
    if (selectedSubject) {
      return (
        <QuizPlayer 
          subject={selectedSubject} 
          userId={user.uid}
          onExit={() => setSelectedSubject(null)}
          onComplete={(score) => {
            setLastQuizScore(score);
            setSelectedSubject(null);
            setView('dashboard');
          }}
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        if (profile.role === 'admin') return <ModerationDashboard />;
        return profile.role === 'teacher' ? (
          <TeacherDashboard profile={profile} onAddQuestion={() => setShowContribute(true)} />
        ) : (
          <StudentDashboard 
              profile={profile} 
              onStartPractice={(subject) => setSelectedSubject(subject)} 
          />
        );
      
      case 'wallet':
        return <WalletPage profile={profile} />;
      
      case 'vtu':
        return <VTUPage profile={profile} />;
      
      case 'contest':
        return <ContestPage profile={profile} onStartPractice={(subject) => setSelectedSubject(subject)} />;
      
      case 'moderation':
        return profile.role === 'admin' ? <ModerationDashboard /> : null;
      
      case 'contribute':
        return profile.role === 'teacher' ? <TeacherDashboard profile={profile} onAddQuestion={() => setShowContribute(true)} /> : null;

      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <p className="font-bold">This section is coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      {!selectedSubject && (
        <Header profile={profile} currentView={currentView} setView={setView} />
      )}
      
      <main className={`max-w-7xl mx-auto px-6 relative z-10 ${selectedSubject ? 'pt-0' : 'pt-40'}`}>
        {/* Score Overlay */}
        <AnimatePresence>
            {lastQuizScore !== null && (
                <motion.div 
                    initial={{ y: -50, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -50, opacity: 0, scale: 0.9 }}
                    className="mb-12 bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl flex items-center justify-between neo-3d border-4 border-slate-800"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center neo-3d shadow-xl">
                            <CheckCircle2 size={36} />
                        </div>
                        <div className="space-y-1">
                            <p className="font-black text-2xl uppercase tracking-tighter italic italic">SESSION_HALTED</p>
                            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">Efficiency Rating: {lastQuizScore}% • Contribution Logged</p>
                        </div>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setLastQuizScore(null)}
                        className="bg-white text-primary px-8 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] neo-3d"
                    >
                        Acknowledge
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>

        {renderContent()}
      </main>

      {/* Cinematic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>
        <div className="absolute top-1/4 left-10 w-px h-64 bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
        <div className="absolute top-1/3 right-20 w-1 h-32 bg-gradient-to-b from-transparent via-accent/10 to-transparent"></div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showContribute && (
          <ContributionForm 
            onClose={() => setShowContribute(false)} 
            onSuccess={() => {
                setShowContribute(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
