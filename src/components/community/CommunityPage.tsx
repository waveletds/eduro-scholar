import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Users, Globe, Hash, Send, UserPlus, Heart, Search, Play } from 'lucide-react';
import { dbService } from '../../services/dbService';
import { supabase } from '../../lib/supabase';

interface CommunityPageProps {
  profile: any;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'forums' | 'chat'>('timeline');
  const [posts, setPosts] = useState<any[]>([]);
  const [forumMessages, setForumMessages] = useState<any[]>([]);
  const [activeForum, setActiveForum] = useState<string>('General');
  const [activeHub, setActiveHub] = useState<string>('General');
  const [newMessage, setNewMessage] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // Chat State
  const [chatPartners, setChatPartners] = useState<any[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (activeTab === 'timeline') loadPosts();
    if (activeTab === 'forums') loadForumMessages();
    if (activeTab === 'chat') loadChatPartners();
  }, [activeTab, activeForum, activeHub]);

  useEffect(() => {
    if (selectedPartner) loadChatMessages();
  }, [selectedPartner]);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const results = await dbService.searchScholars(searchQuery);
          setSearchResults(results || []);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadPosts = async () => {
    const allPosts = await dbService.getPosts(activeHub);
    setPosts(allPosts || []);
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    setIsPosting(true);
    try {
      await dbService.createPost({
        authorId: profile.uid,
        authorName: profile.displayName,
        authorPhoto: profile.photoURL,
        content: newPostContent,
        hub: activeHub
      });
      setNewPostContent('');
      loadPosts();
    } finally {
      setIsPosting(false);
    }
  };

  const loadChatPartners = async () => {
    const partners = await dbService.getRecentChatPartners(profile.uid);
    setChatPartners(partners || []);
  };

  const loadChatMessages = async () => {
    if (!selectedPartner) return;
    const messages = await dbService.getChatMessages(profile.uid, selectedPartner.id);
    setChatMessages(messages || []);
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || !selectedPartner) return;
    try {
      await dbService.sendChatMessage({
        senderId: profile.uid,
        receiverId: selectedPartner.id,
        text: chatInput
      });
      setChatInput('');
      loadChatMessages();
    } catch (err) {
      console.error(err);
    }
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
    <div className="space-y-8 md:space-y-12 pb-32">
      {/* Header section with tab switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-block px-3 md:px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1 md:mb-2 shadow-sm">Collective Awareness</div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Student <span className="text-primary italic">Commons</span></h1>
          <p className="text-slate-400 font-medium tracking-tight text-xs md:text-sm">Synchronize with fellow scholars and share neural data blocks.</p>
        </div>

        <div className="bg-slate-50 p-1 md:p-1.5 rounded-2xl md:rounded-[20px] flex flex-wrap justify-center gap-1 md:gap-2 border border-slate-100">
          {[
            { id: 'timeline', label: 'Timeline', icon: Globe },
            { id: 'forums', label: 'Hubs', icon: Hash },
            { id: 'chat', label: 'Neural Chat', icon: MessageSquare }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeTab === tab.id ? 'bg-white text-primary shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon size={14} className="md:w-3.5 md:h-3.5" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6 md:space-y-8 min-h-[400px] md:min-h-[600px]">
          {activeTab === 'timeline' && (
            <div className="space-y-8">
              {/* Create Post */}
              <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                       <img src={profile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.uid}`} alt="me" />
                    </div>
                    <div className="flex-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Broadcasting as {profile.displayName}</p>
                       <textarea 
                         value={newPostContent}
                         onChange={(e) => setNewPostContent(e.target.value)}
                         placeholder="Share educational data, logic snippets, or questions..."
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium outline-none focus:border-primary transition-all resize-none h-24"
                       />
                    </div>
                 </div>
                 
                 <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                         {['General', 'Science', 'Art', 'Commercial'].map(h => (
                           <button 
                             key={h}
                             onClick={() => setActiveHub(h)}
                             className={`shrink-0 px-4 h-9 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                               activeHub === h ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-slate-400 border-slate-100'
                             }`}
                           >
                             {h} HUB
                           </button>
                         ))}
                      </div>
                      <button className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors border border-dashed border-slate-200">
                        <Play size={14} className="rotate-90" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={handleCreatePost}
                      disabled={isPosting || !newPostContent.trim()}
                      className="bg-slate-900 text-white px-8 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
                    >
                      {isPosting ? 'Propagating...' : 'Post Logic'}
                    </button>
                 </div>
              </div>

              {posts.map((post) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[32px] border border-slate-100 shadow-sm space-y-4 md:space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden">
                        <img src={post.author_photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author_id}`} alt="author" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 leading-none">{post.author_name}</p>
                          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                          <button className="text-[9px] font-bold text-primary uppercase tracking-widest hover:underline">Follow</button>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                          {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg text-slate-700 leading-relaxed font-medium">{post.content}</p>
                  <div className="flex items-center gap-8 pt-4 border-t border-slate-50">
                    <button className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors">
                      <Heart size={16} /> {post.likes_count || 0}
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
              <div className="flex gap-2 md:gap-4 overflow-x-auto pb-4 scrollbar-hide">
                 {['General', 'Science', 'Art', 'Commercial'].map(f => (
                   <button
                     key={f}
                     onClick={() => setActiveForum(f)}
                     className={`shrink-0 px-6 md:px-8 h-10 md:h-12 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-widest border transition-all ${
                       activeForum === f ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100'
                     }`}
                   >
                     {f} HUB
                   </button>
                 ))}
               </div>

              {/* Messages View */}
              <div className="bg-white rounded-3xl md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[450px] md:h-[600px]">
                 <div className="p-4 md:p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                   <h3 className="font-bold text-[10px] md:text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                     <Hash size={14} className="md:w-4 md:h-4" /> {activeForum} Forum
                   </h3>
                   <div className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Broadcast active</div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {forumMessages.map((msg, idx) => (
                      <div key={idx} className={`flex gap-4 ${msg.author_id === profile.uid ? 'flex-row-reverse' : ''}`}>
                         <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 mt-1">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.author_id}`} alt="user" />
                         </div>
                         <div className={`space-y-1 max-w-[80%] ${msg.author_id === profile.uid ? 'text-right' : ''}`}>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{msg.author_name}</p>
                            <div className={`p-4 rounded-2xl ${msg.author_id === profile.uid ? 'bg-primary text-white' : 'bg-slate-50 text-slate-700'}`}>
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
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row h-[600px]">
               {/* Contact List */}
               <div className="w-full md:w-80 border-r border-slate-50 flex flex-col h-full bg-slate-50/20">
                  <div className="p-6 border-b border-slate-50">
                     <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recent Signals</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                     {chatPartners.length === 0 ? (
                       <div className="p-8 text-center space-y-4 pt-12">
                          <div className="w-12 h-12 bg-white rounded-2xl mx-auto flex items-center justify-center text-slate-200 border border-slate-100 italic">?</div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">No active neural links. Search for scholars to begin synchronization.</p>
                       </div>
                     ) : (
                       chatPartners.map(partner => (
                         <div 
                           key={partner.id}
                           onClick={() => setSelectedPartner(partner)}
                           className={`p-6 flex items-center gap-4 cursor-pointer transition-all border-b border-transparent ${
                             selectedPartner?.id === partner.id ? 'bg-white border-l-4 border-l-primary shadow-sm' : 'hover:bg-slate-50'
                           }`}
                         >
                           <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border-2 border-white shadow-sm">
                              <img src={partner.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.id}`} alt="partner" />
                           </div>
                           <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate leading-none mb-1">{partner.display_name}</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">{partner.stream || 'General'} Engineer</p>
                           </div>
                         </div>
                       ))
                     )}
                  </div>
               </div>

               {/* Chat Window */}
               <div className="flex-1 flex flex-col h-full bg-white">
                  {selectedPartner ? (
                    <>
                      <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 overflow-hidden">
                               <img src={selectedPartner.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPartner.id}`} alt="p" />
                            </div>
                            <div>
                               <h4 className="font-bold text-slate-900 leading-none">{selectedPartner.display_name}</h4>
                               <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Live Endpoint</p>
                            </div>
                         </div>
                         <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">
                            <Hash size={16} />
                         </button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/20">
                         {chatMessages.length === 0 && (
                            <div className="h-full flex items-center justify-center">
                               <div className="text-center space-y-4">
                                  <div className="w-16 h-16 bg-white rounded-[24px] mx-auto flex items-center justify-center text-slate-100 border border-slate-50">
                                     <MessageSquare size={32} />
                                  </div>
                                  <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Beginning data exchange...</p>
                               </div>
                            </div>
                         )}
                         {chatMessages.map((msg, i) => (
                           <div key={i} className={`flex ${msg.sender_id === profile.uid ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[75%] p-4 rounded-2xl shadow-sm ${
                                msg.sender_id === profile.uid ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                              }`}>
                                 <p className="text-sm font-medium">{msg.text}</p>
                                 <p className={`text-[7px] font-bold uppercase tracking-widest mt-1.5 ${msg.sender_id === profile.uid ? 'text-white/50' : 'text-slate-300'}`}>
                                    {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Syncing...'}
                                 </p>
                              </div>
                           </div>
                         ))}
                      </div>

                      <div className="p-6 bg-white">
                         <div className="flex gap-4">
                            <input 
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                              placeholder={`Secure sync with ${selectedPartner.display_name}...`}
                              className="flex-1 h-14 px-8 rounded-2xl bg-slate-50 border border-transparent outline-none focus:bg-white focus:border-primary transition-all font-medium text-slate-900"
                            />
                            <motion.button 
                              whileTap={{ scale: 0.95 }}
                              onClick={handleSendChatMessage}
                              className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-primary/30 transition-all"
                            >
                               <Send size={20} />
                            </motion.button>
                         </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-10 p-12 text-center opacity-60 grayscale">
                       <div className="relative">
                          <div className="w-32 h-32 bg-slate-50 rounded-[48px] animate-pulse"></div>
                          <MessageSquare size={64} className="absolute inset-0 m-auto text-slate-200" />
                       </div>
                       <div className="space-y-4">
                         <h3 className="text-xl font-bold uppercase tracking-tight text-slate-400 italic">Awaiting Synchronicity</h3>
                         <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] max-w-xs leading-loose">Select a scholar from your neural signals to initiate data propagation.</p>
                       </div>
                    </div>
                  )}
               </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          {/* Student Search */}
          <div className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[40px] border border-slate-100 shadow-sm space-y-4 md:space-y-6">
            <h3 className="font-bold text-[10px] md:text-xs uppercase tracking-widest text-slate-900 flex items-center gap-2">
              <Search size={14} className="text-primary md:w-4 md:h-4" /> Global Search
            </h3>
            <div className="relative">
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name or Stream..."
                className="w-full h-12 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none transition-all text-sm font-medium"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            </div>

            {/* Search Results */}
            <AnimatePresence>
              {(searchResults.length > 0 || isSearching) && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="h-px bg-slate-50" />
                  {isSearching ? (
                    <div className="py-4 text-center">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {searchResults.map((scholar) => (
                        <div key={scholar.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                            <img src={scholar.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${scholar.id}`} alt="profile" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-900 truncate">{scholar.display_name}</p>
                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[8px] font-bold uppercase tracking-wider">
                                {scholar.stream || 'General'}
                              </span>
                              <p className="text-[10px] text-slate-400 font-medium truncate">{scholar.status || 'Active Scholar'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  await dbService.followUser(profile.uid, scholar.id);
                                  console.log(`Now following ${scholar.display_name}`);
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                              className="w-8 h-8 rounded-lg bg-slate-50 text-slate-300 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                            >
                              <UserPlus size={14} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPartner(scholar);
                                setActiveTab('chat');
                              }}
                              className="w-8 h-8 rounded-lg bg-slate-50 text-slate-300 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all"
                            >
                              <MessageSquare size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            {searchQuery.trim().length > 1 && !isSearching && searchResults.length === 0 && (
              <p className="text-[10px] text-slate-400 text-center font-medium italic">No scholars found matching your criteria.</p>
            )}
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
              <Globe size={16} /> Community Protocol
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
