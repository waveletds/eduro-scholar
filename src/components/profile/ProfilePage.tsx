import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Edit2, MessageSquare, Send, Heart, Share2, UserPlus, Users, Link as LinkIcon } from 'lucide-react';
import { dbService } from '../../services/dbService';
import { supabase } from '../../lib/supabase';

interface ProfilePageProps {
  profile: any;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ profile }) => {
  const [status, setStatus] = useState(profile.status || "Hello, I'm using Eduro Scholar!");
  const [stream, setStream] = useState(profile.stream || 'Science');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, [profile.uid]);

  const loadPosts = async () => {
    const allPosts = await dbService.getPosts();
    // Filter for user's own posts for the profile timeline
    setPosts(allPosts?.filter((p: any) => p.author_id === profile.uid) || []);
  };

  const handleUpdateSocial = async () => {
    await dbService.updateUserSocial(profile.uid, { status, stream });
    setIsEditingProfile(false);
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
      });
      setNewPostContent('');
      loadPosts();
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-32 md:h-48 bg-gradient-to-r from-primary to-accent relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>
        </div>
        
        <div className="px-6 md:px-10 pb-8 md:pb-10 relative">
          <div className="relative -mt-16 md:-mt-24 mb-4 md:mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-0">
            <div className="relative group mx-auto md:mx-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] md:rounded-[48px] border-4 md:border-8 border-white shadow-xl overflow-hidden bg-slate-100">
                <img src={profile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.uid}`} alt="profile" className="w-full h-full object-cover" />
              </div>
              <button className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-8 h-8 md:w-10 md:h-10 bg-slate-900 text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-all border-2 md:border-4 border-white">
                <Camera size={14} className="md:w-[18px] md:h-[18px]" />
              </button>
            </div>
            
            <div className="flex justify-center md:justify-end gap-3 md:gap-4 mb-2 md:mb-4">
              <motion.button 
                whileHover={{ y: -2 }}
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="bg-slate-50 text-slate-600 px-4 md:px-6 h-10 md:h-12 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs uppercase tracking-widest border border-slate-100 flex items-center gap-2"
              >
                <Edit2 size={12} className="md:w-3.5 md:h-3.5" /> {isEditingProfile ? 'Cancel' : 'Edit Profile'}
              </motion.button>
              <motion.button 
                whileHover={{ y: -2 }}
                className="bg-primary text-white px-4 md:px-6 h-10 md:h-12 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-lg flex items-center gap-2"
              >
                <Share2 size={12} className="md:w-3.5 md:h-3.5" /> Share
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 text-center md:text-left">
            <div className="md:col-span-2 space-y-4 md:space-y-6">
              <div className="space-y-2 md:space-y-0">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                  <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">{profile.displayName}</h1>
                  <span className={`inline-block mx-auto md:mx-0 px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg text-[8px] md:text-[9px] font-bold uppercase tracking-widest ${
                    stream === 'Science' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                    stream === 'Art' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                    'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}>
                    {stream} Student
                  </span>
                </div>
                <AnimatePresence mode="wait">
                  {isEditingProfile ? (
                    <motion.div 
                      key="editing"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 space-y-4"
                    >
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Status</label>
                        <input 
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="w-full h-12 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary outline-none transition-all"
                          placeholder="What's on your mind?"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academic Stream</label>
                        <div className="flex gap-2">
                          {['Science', 'Art', 'Commercial'].map(s => (
                            <button
                              key={s}
                              onClick={() => setStream(s)}
                              className={`flex-1 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                                stream === s ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-slate-400 border-slate-100'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button 
                        onClick={handleUpdateSocial}
                        className="w-full bg-slate-900 text-white h-12 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg"
                      >
                        Synchronize Updates
                      </button>
                    </motion.div>
                  ) : (
                    <motion.p 
                      key="viewing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-slate-500 mt-2 text-lg italic font-medium"
                    >
                      "{status}"
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex justify-center md:justify-start gap-6 md:gap-8">
                 <div className="text-center md:text-left">
                    <p className="text-xl md:text-2xl font-bold text-slate-900">{profile.followersCount || 0}</p>
                    <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Followers</p>
                 </div>
                 <div className="text-center md:text-left">
                    <p className="text-xl md:text-2xl font-bold text-slate-900">{profile.followingCount || 0}</p>
                    <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Following</p>
                 </div>
                 <div className="text-center md:text-left">
                    <p className="text-xl md:text-2xl font-bold text-slate-900">{posts.length}</p>
                    <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Posts</p>
                 </div>
              </div>
            </div>

              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl md:rounded-3xl space-y-4 md:space-y-6">
              <h3 className="font-bold text-[10px] md:text-xs uppercase tracking-widest text-slate-900 flex items-center justify-center md:justify-start gap-2">
                 <LinkIcon size={14} className="text-primary md:w-3.5 md:h-3.5" /> Scholarship Wallet
              </h3>
              <div className="space-y-3 md:space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wallet ID</span>
                    <span className="text-[8px] md:text-[10px] font-bold text-primary uppercase tracking-wider">{profile.walletId || 'Generating...'}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reg ID</span>
                    <span className="text-[8px] md:text-[10px] font-bold text-slate-900 uppercase">EDU-{profile.uid.substring(0, 8)}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logic Node</span>
                    <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider ${profile.monnifyAccountNumber ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {profile.monnifyAccountNumber ? 'Active Sync' : 'In-active'}
                    </span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rank</span>
                    <span className="text-[8px] md:text-[10px] font-bold text-emerald-600 uppercase">Scholar Prime</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6 md:space-y-8">
          {/* Post Box */}
          <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[32px] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0">
                <img src={profile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.uid}`} alt="me" />
              </div>
              <textarea 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Broadcast to your neural network..."
                className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl p-3 md:p-4 outline-none focus:border-primary transition-all min-h-[80px] md:min-h-[100px] text-slate-900 placeholder:text-slate-300 font-medium text-sm md:text-base"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <button className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">
                  <Camera size={16} className="md:w-[18px] md:h-[18px]" />
                </button>
              </div>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={handleCreatePost}
                disabled={isPosting || !newPostContent.trim()}
                className="bg-primary text-white px-6 md:px-8 h-10 md:h-12 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-lg flex items-center gap-3 disabled:opacity-50"
              >
                {isPosting ? 'Broadcasting...' : <>Broadcast <Send size={12} className="md:w-3.5 md:h-3.5" /></>}
              </motion.button>
            </div>
          </div>

          {/* User's Timeline */}
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight text-slate-900 px-2">Timeline Feed</h2>
            
            {posts.length === 0 ? (
              <div className="bg-white p-12 md:p-20 rounded-3xl md:rounded-[40px] border border-slate-100 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 text-slate-200 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto">
                   <MessageSquare size={32} className="md:w-10 md:h-10" />
                </div>
                <p className="text-slate-400 font-medium italic text-sm md:text-base">No signal detected on this timeline.</p>
              </div>
            ) : (
              posts.map((post) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[32px] border border-slate-100 shadow-sm space-y-4 md:space-y-6"
                >
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-100 overflow-hidden">
                          <img src={post.author_photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author_id}`} alt="author" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-none text-sm md:text-base">{post.author_name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                  </div>

                  <p className="text-base md:text-lg text-slate-700 leading-relaxed font-medium">{post.content}</p>

                  <div className="flex items-center gap-6 md:gap-8 pt-4 border-t border-slate-50">
                    <button className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors">
                      <Heart size={14} className="md:w-4 md:h-4" /> {post.likes_count || 0}
                    </button>
                    <button className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
                      <MessageSquare size={14} className="md:w-4 md:h-4" /> 0
                    </button>
                    <button className="ml-auto w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">
                      <Share2 size={14} className="md:w-4 md:h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 md:space-y-8">
           <div className="bg-slate-900 p-6 md:p-8 rounded-2xl md:rounded-[40px] text-white space-y-4 md:space-y-6 relative overflow-hidden shadow-xl">
              <div className="relative z-10 space-y-2">
                 <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight text-accent">Skill Tree</h3>
                 <p className="text-[10px] md:text-xs text-slate-400 font-medium">Coming soon: Master your stream and earn exclusive badges.</p>
              </div>
              <div className="w-full h-1.5 md:h-2 bg-white/10 rounded-full relative overflow-hidden z-10">
                 <div className="absolute inset-y-0 left-0 bg-accent w-1/3 shadow-[0_0_10px_#ccfcf4]"></div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-accent/5 rounded-full blur-3xl z-0"></div>
           </div>

           <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[40px] border border-slate-100 shadow-sm space-y-4 md:space-y-6">
              <h3 className="font-bold text-[10px] md:text-xs uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                 <UserPlus size={14} className="text-primary md:w-4 md:h-4" /> Featured Students
              </h3>
              <div className="space-y-3 md:space-y-4">
                 {[1,2,3].map(i => (
                   <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-100 overflow-hidden shrink-0">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=feature${i}`} alt="user" />
                         </div>
                         <div>
                            <p className="text-[10px] md:text-[11px] font-bold text-slate-900 group-hover:text-primary transition-colors truncate w-24 md:w-auto">Scholar_{i}02</p>
                            <p className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-widest">Science</p>
                         </div>
                      </div>
                      <button className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shrink-0">
                         <UserPlus size={12} className="md:w-3.5 md:h-3.5" />
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
