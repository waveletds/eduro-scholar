import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Users, Globe, Hash, Send, UserPlus, Heart, Search } from 'lucide-react';
import { dbService } from '../../services/dbService';
import { auth } from '../../services/firebase';

interface CommunityPageProps {
  profile: any;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'forums' | 'chat'>('timeline');
  const [posts, setPosts] = useState<any[]>([]);
  const [forumMessages, setForumMessages] = useState<any[]>([]);
  const [activeForum, setActiveForum] = useState<string>('General');
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (activeTab === 'timeline') loadPosts();
    if (activeTab === 'forums') loadForumMessages();
  }, [activeTab, activeForum]);

  const loadPosts = async () => {
    const allPosts = await dbService.getPosts();
    setPosts(allPosts || []);
  };

  const loadForumMessages = async () => {
    // In a real app, I'd query by forum type. 
    // For now, I'll fetch and filter if needed, or assume global for demo.
    // Fetching forum messages from dbService (to be added/implemented properly)
    const messages = await dbService.getForumMessages?.(activeForum) || [];
    setForumMessages(messages);
  };

  const handleSendForumMessage = async () => {
    if (!newMessage.trim()) return;
    setIsSending(true);
    try {
      await dbService.sendForumMessage({
        authorId: profile.uid,
        authorName: profile.displayName,
        stream: activeForum,
        text: newMessage,
      });
      setNewMessage('');
      loadForumMessages();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-12 pb-32">
      {/* Header section with tab switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-1">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-bold uppercase tracking-widest mb-2 shadow-sm">Collective Awareness</div>
          <h1 className="text-4xl font-bold tracking-tight">Student <span className="text-primary italic">Commons</span></h1>
          <p className="text-slate-400 font-medium tracking-tight text-sm">Synchronize with fellow scholars and share neural data blocks.</p>
        </div>

        <div className="bg-slate-50 p-1.5 rounded-[20px] flex gap-2 border border-slate-100">
          {[
            { id: 'timeline', label: 'Timeline', icon: Globe },
            { id: 'forums', label: 'Hubs', icon: Hash },
            { id: 'chat', label: 'Neural Chat', icon: MessageSquare }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeTab === tab.id ? 'bg-white text-primary shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-8 min-h-[600px]">
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {posts.map((post) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden">
                        <img src={post.authorPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorId}`} alt="author" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 leading-none">{post.authorName}</p>
                          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                          <button className="text-[9px] font-bold text-primary uppercase tracking-widest hover:underline">Follow</button>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                          {post.createdAt?.toDate?.()?.toLocaleDateString() || 'Just now'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg text-slate-700 leading-relaxed font-medium">{post.content}</p>
                  <div className="flex items-center gap-8 pt-4 border-t border-slate-50">
                    <button className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors">
                      <Heart size={16} /> {post.likesCount || 0}
                    </button>
                    <button className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
                      <MessageSquare size={16} /> Comment
                    </button>
                    <button className="ml-auto w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">
                      <Users size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'forums' && (
            <div className="space-y-8">
              {/* Forum Selector */}
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {['General', 'Science', 'Art', 'Commercial'].map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveForum(f)}
                    className={`shrink-0 px-8 h-12 rounded-2xl text-xs font-bold uppercase tracking-widest border transition-all ${
                      activeForum === f ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100'
                    }`}
                  >
                    {f} HUB
                  </button>
                ))}
              </div>

              {/* Messages View */}
              <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
                <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                    <Hash size={16} /> {activeForum} Forum
                  </h3>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Global Broadcast active</div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                   {forumMessages.map((msg, idx) => (
                     <div key={idx} className={`flex gap-4 ${msg.authorId === profile.uid ? 'flex-row-reverse' : ''}`}>
                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 mt-1">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.authorId}`} alt="user" />
                        </div>
                        <div className={`space-y-1 max-w-[80%] ${msg.authorId === profile.uid ? 'text-right' : ''}`}>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{msg.authorName}</p>
                           <div className={`p-4 rounded-2xl ${msg.authorId === profile.uid ? 'bg-primary text-white' : 'bg-slate-50 text-slate-700'}`}>
                              <p className="text-sm font-medium">{msg.text}</p>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="p-6 border-t border-slate-50 bg-slate-50/30">
                  <div className="flex gap-4">
                    <input 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendForumMessage()}
                      placeholder={`Post to ${activeForum} Hub...`}
                      className="flex-1 h-14 px-8 rounded-2xl bg-white border border-slate-200 outline-none focus:border-primary transition-all font-medium text-slate-900 shadow-sm"
                    />
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendForumMessage}
                      disabled={isSending || !newMessage.trim()}
                      className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all disabled:opacity-50"
                    >
                      <Send size={20} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex flex-col items-center justify-center h-[600px] text-center space-y-8 bg-slate-50/50 rounded-[64px] border-4 border-dashed border-slate-100">
               <div className="w-24 h-24 bg-white rounded-3xl border border-slate-100 flex items-center justify-center text-slate-200 shadow-sm">
                  <MessageSquare size={48} />
               </div>
               <div className="space-y-2">
                 <h2 className="text-2xl font-bold uppercase tracking-tight text-slate-900">Neural DM Portal</h2>
                 <p className="text-sm text-slate-400 max-w-xs mx-auto">Direct student-to-student encrypted messaging is currently optimizing. Check back soon for safe-space collaboration.</p>
               </div>
               <button className="bg-primary text-white px-8 h-12 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg">Request Beta Access</button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          {/* Student Search */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-bold text-xs uppercase tracking-widest text-slate-900 flex items-center gap-2">
              <Search size={16} className="text-primary" /> Global Search
            </h3>
            <div className="relative">
              <input 
                placeholder="Find Scholars..."
                className="w-full h-12 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none transition-all text-sm font-medium"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            </div>
          </div>

          {/* Social Stats */}
          <div className="bg-slate-900 p-10 rounded-[48px] text-white relative overflow-hidden shadow-2xl">
             <div className="relative z-10 space-y-8">
               <div className="space-y-2">
                  <h3 className="text-2xl font-bold uppercase tracking-tight text-accent">Community Impact</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">Your neural contributions reach 4,203 students daily.</p>
               </div>
               
               <div className="space-y-4">
                  <div className="flex items-center justify-between group">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Network Trust</span>
                    <span className="text-xl font-bold text-white">98%</span>
                  </div>
                  <div className="flex items-center justify-between group">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Links</span>
                    <span className="text-xl font-bold text-white">420</span>
                  </div>
               </div>

               <button className="w-full bg-white text-primary h-14 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg hover:bg-accent hover:text-primary transition-all">
                  Synchronize Activity
               </button>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-5 rounded-full blur-[100px]"></div>
          </div>

          {/* Guidelines */}
          <div className="bg-emerald-50 p-8 rounded-[40px] border border-emerald-100 space-y-6">
            <h3 className="font-bold text-[10px] uppercase tracking-widest text-emerald-900 flex items-center gap-2">
              <globe size={16} /> Community Protocol
            </h3>
            <ul className="space-y-4">
              {[
                'Share only verified educational logic.',
                'Maintain high-fidelity scholar ethics.',
                'Propagate positivity across all hubs.',
                'Report unauthorized data patterns.'
              ].map((tip, i) => (
                <li key={i} className="text-[11px] text-emerald-700/70 leading-tight flex gap-3 font-medium tracking-tight">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0"></div>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
