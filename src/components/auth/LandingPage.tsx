import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Trophy, PenTool, ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import { AuthModal } from './AuthModal';

export const LandingPage: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white selection:bg-accent selection:text-primary">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {/* Hero Section */}
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl glass rounded-2xl md:rounded-3xl px-4 md:px-8 py-3 md:py-4 shadow-xl border border-white/40 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group">
            <div className="bg-primary text-accent p-1.5 md:p-2 rounded-lg md:rounded-xl group-hover:scale-105 transition-transform">
                <BookOpen size={20} className="md:w-6 md:h-6" />
            </div>
            <h1 className="text-sm md:text-xl font-bold text-primary uppercase tracking-tight">
                Eduro Scholar
            </h1>
        </div>
        <button 
          onClick={() => setIsAuthModalOpen(true)}
          className="bg-slate-900 text-accent px-4 md:px-8 py-2 md:py-3 rounded-lg md:rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all hover:bg-slate-800"
        >
          Access Portal
        </button>
      </nav>

      <main className="pt-24 md:pt-32 overflow-x-hidden">
        <section className="max-w-7xl mx-auto px-4 pt-8 md:pt-16 pb-20 md:pb-32 grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="space-y-6 md:space-y-10 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-amber-100 shadow-sm mx-auto lg:mx-0">
               <Star size={14} fill="currentColor" /> Nigeria's #1 CBT Platform
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-8xl font-bold leading-[0.95] tracking-tighter text-slate-900">
               Master <br />
               <span className="text-primary">Your Exams.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-500 font-medium max-w-lg leading-relaxed mx-auto lg:mx-0">
               Nigeria's smartest exam preparation platform. Prepare for JAMB, WAEC & Post-UTME with gamified learning.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <motion.button 
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-primary text-white px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg uppercase tracking-wider shadow-lg flex items-center justify-center gap-3"
              >
                Get Started <ArrowRight size={20} className="md:w-6 md:h-6" />
              </motion.button>
              <motion.button 
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-white text-primary border border-slate-200 px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg uppercase tracking-wider shadow-sm hover:border-primary transition-all flex items-center justify-center"
              >
                Join Faculty
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotateY: 30 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative perspective-1000"
          >
            {/* Abstract UI representation */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 bg-white p-6 rounded-[60px] shadow-3d border-4 border-slate-100 rotate-3 preserve-3d"
            >
                <div className="bg-slate-900 rounded-[40px] p-10 space-y-8 neo-3d-accent">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-3">
                            <div className="w-4 h-4 rounded-full bg-rose-500 neo-3d"></div>
                            <div className="w-4 h-4 rounded-full bg-amber-500 neo-3d"></div>
                            <div className="w-4 h-4 rounded-full bg-emerald-500 neo-3d"></div>
                        </div>
                        <div className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black text-accent uppercase tracking-widest border border-white/10">BATTLE_MODE: ACTIVE</div>
                    </div>
                    <div className="space-y-6">
                        <div className="h-10 w-3/4 bg-white/10 rounded-2xl neo-3d"></div>
                        <div className="h-6 w-1/2 bg-white/5 rounded-2xl"></div>
                        <div className="grid gap-4 pt-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-16 rounded-3xl border-2 ${i === 2 ? 'border-accent bg-accent/10' : 'border-white/5 bg-white/5'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
            {/* Background blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-accent/20 rounded-full blur-[150px] -z-10 animate-pulse"></div>
          </motion.div>
        </section>

        {/* Feature Grid */}
        <section className="bg-slate-900 py-20 md:py-32 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 space-y-16 md:space-y-24 relative z-10">
                <div className="text-center space-y-4 md:space-y-6">
                    <div className="inline-block px-4 py-2 bg-white/10 rounded-2xl text-[9px] md:text-[10px] font-black text-accent uppercase tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-4">Core Systems</div>
                    <h2 className="text-3xl md:text-6xl font-black font-display uppercase tracking-tighter text-white italic">SYTEMS FOR <span className="text-accent not-italic">EXCELLENCE</span></h2>
                    <p className="text-slate-400 max-w-2xl mx-auto font-bold uppercase tracking-widest text-[10px] md:text-xs leading-relaxed">Eduro Scholar combines localized exam content with high-frequency gamified learning architecture.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {[
                        { 
                            title: 'BATTLE ARCHIVE', 
                            desc: 'Full access to JAMB, WAEC, NECO and Post-UTME neural networks with 15+ years of past data.',
                            icon: BookOpen,
                            color: 'text-blue-400',
                            bg: 'bg-blue-500/10'
                        },
                        { 
                            title: 'YIELD FARMING', 
                            desc: 'High-performance leaderboard system. Earn academic yield convertible to real-world carrier data.',
                            icon: Trophy,
                            color: 'text-amber-400',
                            bg: 'bg-amber-500/10'
                        },
                        { 
                            title: 'NEURAL GUIDES', 
                            desc: 'Quantum explanations from verified masters. Don\'t just find the solution, verify the methodology.',
                            icon: PenTool,
                            color: 'text-emerald-400',
                            bg: 'bg-emerald-500/10'
                        }
                    ].map((feature, idx) => (
                        <motion.div 
                          key={idx} 
                          whileHover={{ y: -20, rotateZ: 1 }}
                          className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-3xl md:rounded-[48px] border-2 border-white/10 shadow-2xl space-y-4 md:space-y-6 group"
                        >
                            <div className={`w-12 h-12 md:w-16 md:h-16 ${feature.bg} ${feature.color} rounded-2xl md:rounded-3xl flex items-center justify-center neo-3d group-hover:rotate-12 transition-transform`}>
                                <feature.icon size={24} className="md:w-8 md:h-8" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight italic">{feature.title}</h3>
                            <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-widest">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
            {/* Decors */}
            <div className="absolute -top-64 -left-64 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]"></div>
            <div className="absolute -bottom-64 -right-64 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px]"></div>
        </section>

        {/* Teacher Section */}
        <section className="max-w-7xl mx-auto px-4 py-20 md:py-40 flex flex-col lg:flex-row items-center gap-12 md:gap-24">
            <div className="flex-1 space-y-6 md:space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] border-2 border-emerald-100 neo-3d mx-auto lg:mx-0">
                   <PenTool size={14} fill="currentColor" /> Faculty Intel
                </div>
                <h2 className="text-4xl md:text-7xl font-black font-display uppercase tracking-tighter leading-[0.85] italic">
                    QUANTUM <br />
                    <span className="text-emerald-600 not-italic">TEACHING.</span>
                </h2>
                <p className="text-lg md:text-xl text-slate-500 font-bold uppercase tracking-tight leading-relaxed max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
                    Join our verified contributor network. 
                    Upload content, verify methodology, and receive weekly royalties directly to your node.
                </p>
                <div className="grid gap-3 md:gap-4 max-w-md mx-auto lg:mx-0 text-left">
                    {[
                        'Consistent yield for high-quality data',
                        'Node reputation scoring system',
                        'Real-time reach analytics',
                        'Friday clearing to commercial banks'
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 text-slate-800 font-black text-[10px] md:text-xs uppercase tracking-widest">
                            <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center neo-3d shrink-0">
                                <CheckCircle2 size={14} className="text-emerald-600" />
                            </div>
                            {item}
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full lg:flex-1 bg-slate-900 p-1 md:p-2 rounded-3xl md:rounded-[60px] neo-3d-accent">
                <div className="bg-white border-2 md:border-4 border-slate-100 rounded-[28px] md:rounded-[56px] p-8 md:p-16 space-y-8 md:space-y-10">
                    <div className="space-y-2 md:space-y-3 text-center">
                        <p className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic">ENROLL NOW</p>
                        <p className="text-slate-300 font-black uppercase text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em]">Initialize Faculty Sync</p>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                        <div className="h-12 md:h-16 bg-slate-50 rounded-xl md:rounded-[28px] border-2 border-slate-100 flex items-center px-4 md:px-6 font-black text-[8px] md:text-[10px] uppercase tracking-widest text-slate-400 neo-3d">Awaiting Credentials...</div>
                        <div className="h-12 md:h-16 bg-slate-50 rounded-xl md:rounded-[28px] border-2 border-slate-100 flex items-center px-4 md:px-6 font-black text-[8px] md:text-[10px] uppercase tracking-widest text-slate-400 neo-3d">Select Disciplines...</div>
                        <button 
                          onClick={() => setIsAuthModalOpen(true)}
                          className="w-full bg-slate-900 text-accent py-4 md:py-6 rounded-xl md:rounded-[28px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm neo-3d-accent transition-all hover:scale-[1.02]"
                        >
                            Become a Master
                        </button>
                    </div>
                </div>
            </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-500 py-20 md:py-32 border-t border-white/5 overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
              <div className="sm:col-span-2 space-y-6 md:space-y-8 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <div className="bg-white/10 text-accent p-2 rounded-2xl neo-3d border border-white/10">
                        <BookOpen size={24} />
                    </div>
                    <h1 className="text-lg md:text-xl font-black font-display text-white uppercase tracking-tighter italic">
                        Eduro Scholar
                    </h1>
                  </div>
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest leading-relaxed max-w-sm mx-auto sm:mx-0">
                    Empowering the Next Generation of Nigerian Thinkers through academic combat and sustainable faculty income.
                  </p>
              </div>
              <div className="space-y-4 md:space-y-6 text-center sm:text-left">
                  <h4 className="text-white font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px]">Registry</h4>
                  <ul className="text-[9px] md:text-[10px] font-black uppercase tracking-widest space-y-3 md:space-y-4 leading-none">
                      <li className="hover:text-accent cursor-pointer transition-colors pb-1">JAMB_NET</li>
                      <li className="hover:text-accent cursor-pointer transition-colors pb-1">WAEC_PORTAL</li>
                      <li className="hover:text-accent cursor-pointer transition-colors pb-1">NECO_CORE</li>
                      <li className="hover:text-accent cursor-pointer transition-colors pb-1">UTME_BATTLE</li>
                  </ul>
              </div>
              <div className="space-y-4 md:space-y-6 text-center sm:text-left">
                  <h4 className="text-white font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px]">Infrastructure</h4>
                  <ul className="text-[9px] md:text-[10px] font-black uppercase tracking-widest space-y-3 md:space-y-4 leading-none">
                      <li className="hover:text-accent cursor-pointer transition-colors pb-1">Join_Faculty</li>
                      <li className="hover:text-accent cursor-pointer transition-colors pb-1">Yield_Fund</li>
                      <li className="hover:text-accent cursor-pointer transition-colors pb-1">Node_Support</li>
                      <li className="hover:text-accent cursor-pointer transition-colors pb-1">Privacy_Key</li>
                  </ul>
              </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-20 md:mt-32 pt-8 md:pt-12 border-t border-white/5 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 text-center text-white/20">
              <p>© 2024 EDURO_SCHOLAR_SYS. DEPLOYED_IN_LAGOS.</p>
              <div className="flex gap-8 md:gap-12">
                  <span className="hover:text-accent cursor-pointer transition-colors">X</span>
                  <span className="hover:text-accent cursor-pointer transition-colors">GH</span>
                  <span className="hover:text-accent cursor-pointer transition-colors">IN</span>
              </div>
          </div>
      </footer>
    </div>
  );
};
