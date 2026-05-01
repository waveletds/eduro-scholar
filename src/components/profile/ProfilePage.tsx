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
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-primary to-accent relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>
        </div>
        
        <div className="px-10 pb-10 relative">
          <div className="relative -mt-24 mb-6 flex items-end justify-between">
            <div className="relative group">
              <div className="w-40 h-40 rounded-[48px] border-8 border-white shadow-xl overflow-hidden bg-slate-100">
                <img src={profile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.uid}`} alt="profile" className="w-full h-full object-cover" />
              </div>
              <button className="absolute bottom-2 right-2 w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-all border-4 border-white">
                <Camera size={18} />
              </button>
            </div>
            
            <div className="flex gap-4 mb-4">
              <motion.button 
                whileHover={{ y: -2 }}
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="bg-slate-50 text-slate-600 px-6 h-12 rounded-2xl font-bold text-xs uppercase tracking-widest border border-slate-100 flex items-center gap-2"
              >
                <Edit2 size={14} /> {isEditingProfile ? 'Cancel' : 'Edit Profile'}
              </motion.button>
              <motion.button 
                whileHover={{ y: -2 }}
                className="bg-primary text-white px-6 h-12 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2"
              >
                <Share2 size={14} /> Share
              </motion.button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold tracking-tight text-slate-900">{profile.displayName}</h1>
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${
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

              <div className="flex gap-8">
                 <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">{profile.followersCount || 0}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Followers</p>
                 </div>
                 <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">{profile.followingCount || 0}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Following</p>
                 </div>
                 <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">{posts.length}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Posts</p>
                 </div>
              </div>
            </div>

              <div className="bg-slate-50 p-8 rounded-3xl space-y-6">
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-900 flex items-center gap-2">
                 <LinkIcon size={14} className="text-primary" /> Scholarship Wallet
              </h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wallet ID</span>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{profile.walletId || 'Generating...'}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reg ID</span>
                    <span className="text-[10px] font-bold text-slate-900 uppercase">EDU-{profile.uid.substring(0, 8)}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rank</span>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Scholar Prime</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Post Box */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0">
                <img src={profile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.uid}`} alt="me" />
              </div>
              <textarea 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Broadcast to your neural network..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:border-primary transition-all min-h-[100px] text-slate-900 placeholder:text-slate-300 font-medium"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">
                  <Camera size={18} />
                </button>
              </div>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={handleCreatePost}
                disabled={isPosting || !newPostContent.trim()}
                className="bg-primary text-white px-8 h-12 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-3 disabled:opacity-50"
              >
                {isPosting ? 'Broadcasting...' : <>Broadcast <Send size={14} /></>}
              </motion.button>
            </div>
          </div>

          {/* User's Timeline */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-tight text-slate-900 px-2">Timeline Feed</h2>
            
            {posts.length === 0 ? (
              <div className="bg-white p-20 rounded-[40px] border border-slate-100 text-center space-y-4 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mx-auto">
                   <MessageSquare size={40} />
                </div>
                <p className="text-slate-400 font-medium italic">No signal detected on this timeline.</p>
              </div>
            ) : (
              posts.map((post) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6"
                >
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden">
                          <img src={post.author_photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author_id}`} alt="author" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-none">{post.author_name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                  </div>

                  <p className="text-lg text-slate-700 leading-relaxed font-medium">{post.content}</p>

                  <div className="flex items-center gap-8 pt-4 border-t border-slate-50">
                    <button className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors">
                      <Heart size={16} /> {post.likes_count || 0} Likes
                    </button>
                    <button className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
                      <MessageSquare size={16} /> 0 Comments
                    </button>
                    <button className="ml-auto w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">
                      <Share2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <div className="bg-slate-900 p-8 rounded-[40px] text-white space-y-6 relative overflow-hidden shadow-xl">
              <div className="relative z-10 space-y-2">
                 <h3 className="text-xl font-bold uppercase tracking-tight text-accent">Skill Tree Progress</h3>
                 <p className="text-xs text-slate-400 font-medium">Coming soon: Master your stream and earn exclusive badges.</p>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full relative overflow-hidden z-10">
                 <div className="absolute inset-y-0 left-0 bg-accent w-1/3 shadow-[0_0_10px_#ccfcf4]"></div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-accent/5 rounded-full blur-3xl z-0"></div>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-900 flex items-center gap-2">
                 <UserPlus size={16} className="text-primary" /> Featured Students
              </h3>
              <div className="space-y-4">
                 {[1,2,3].map(i => (
                   <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=feature${i}`} alt="user" />
                         </div>
                         <div>
                            <p className="text-[11px] font-bold text-slate-900 group-hover:text-primary transition-colors">Scholar_{i}02</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Science</p>
                         </div>
                      </div>
                      <button className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                         <UserPlus size={14} />
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
