import { supabase } from '../lib/supabase';

export const dbService = {
  // User Profile
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is 'no rows returned'
      console.error('Error fetching profile:', error);
    }
    return data;
  },

  async createUserProfile(userId: string, data: any) {
    // Map Firestore camelCase to Postgres snake_case if necessary, 
    // but I'll keep them consistent for now or adapt
    const profileData = {
      id: userId,
      email: data.email,
      display_name: data.displayName,
      photo_url: data.photoURL,
      role: data.role,
      wallet_balance: data.walletBalance || 0,
      is_verified_teacher: data.isVerifiedTeacher || false,
      stats: data.stats || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('profiles')
      .insert([profileData]);
    
    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  // Questions
  async submitQuestion(data: any) {
    const { data: result, error } = await supabase
      .from('questions')
      .insert([{
        text: data.text,
        options: data.options,
        correct_option: data.correctOption,
        category: data.category,
        level: data.level,
        reward: data.reward,
        creator_id: data.creatorId,
        status: 'pending',
        usage_count: 0,
        rating_sum: 0,
        rating_count: 0,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async adminApproveQuestion(questionId: string) {
    const { error } = await supabase
      .from('questions')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', questionId);
    
    if (error) throw error;
  },

  async adminRejectQuestion(questionId: string, reason: string) {
    const { error } = await supabase
      .from('questions')
      .update({ 
        status: 'rejected', 
        rejection_reason: reason, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', questionId);
    
    if (error) throw error;
  },

  // Wallet and Royalties
  async recordUsageRoyalty(questionId: string, creatorId: string) {
    const amount = 2; // 2 Naira per attempt
    
    try {
      // 1. Log transaction
      await supabase.from('transactions').insert([{
        user_id: creatorId,
        amount,
        type: 'usage_royalty',
        status: 'completed',
        description: `Royalty for question attempt`,
        created_at: new Date().toISOString()
      }]);

      // 2. Update teacher's wallet (using RPC for atomic increment if available, or fetch and update)
      // For simplicity in this demo, we'll use a standard update or an RPC if defined in Supabase
      const { data: profile } = await supabase.from('profiles').select('wallet_balance, stats').eq('id', creatorId).single();
      if (profile) {
        const newBalance = (profile.wallet_balance || 0) + amount;
        const newStats = { ...profile.stats };
        newStats.monthlyEarnings = (newStats.monthlyEarnings || 0) + amount;
        newStats.studentsReached = (newStats.studentsReached || 0) + 1;

        await supabase.from('profiles').update({
          wallet_balance: newBalance,
          stats: newStats
        }).eq('id', creatorId);
      }

      // 3. Increment question usage count
      const { data: question } = await supabase.from('questions').select('usage_count').eq('id', questionId).single();
      if (question) {
        await supabase.from('questions').update({
          usage_count: (question.usage_count || 0) + 1
        }).eq('id', questionId);
      }
    } catch (error) {
      console.error("Failed to record royalty:", error);
    }
  },

  async rateQuestion(questionId: string, rating: number) {
    const { data: question } = await supabase.from('questions').select('rating_sum, rating_count').eq('id', questionId).single();
    if (question) {
      await supabase.from('questions').update({
        rating_sum: (question.rating_sum || 0) + rating,
        rating_count: (question.rating_count || 0) + 1
      }).eq('id', questionId);
    }
  },

  async getQuestions(queryFn: any) {
    // In Supabase we don't pass a firestore query object.
    // We'll adapt this to take a category/level or just return all approved
    let query = supabase.from('questions').select('*').eq('status', 'approved');
    
    // Simple mock of logic
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Attempts
  async saveAttempt(userId: string, data: any) {
    const { data: result, error } = await supabase
      .from('attempts')
      .insert([{
        user_id: userId,
        ...data,
        timestamp: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // Wallet APIs (Proxy to Express server)
  async getVirtualAccount(userId: string, displayName: string, email: string) {
    try {
      const response = await fetch('/api/wallet/virtual-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, displayName, email })
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch virtual account:', error);
      return null;
    }
  },

  async transferWallet(fromUserId: string, targetWalletId: string, amount: number) {
    try {
      const response = await fetch('/api/wallet/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromUserId, targetWalletId, amount })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Transfer failed');
      return data;
    } catch (error: any) {
      console.error('Transfer error:', error);
      throw error;
    }
  },

  async withdrawToBank(userId: string, data: { amount: number; bankCode: string; accountNumber: string; accountName: string }) {
    try {
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...data })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Withdrawal failed');
      return result;
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      throw error;
    }
  },

  async payUtility(userId: string, data: { type: string; amount: number; detail: string; description: string }) {
    try {
      const response = await fetch('/api/wallet/utility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...data })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Payment failed');
      return result;
    } catch (error: any) {
      console.error('Utility payment error:', error);
      throw error;
    }
  },

  // Social Features
  async updateUserSocial(userId: string, data: any) {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) throw error;
  },

  async createPost(data: any) {
    const { data: result, error } = await supabase
      .from('posts')
      .insert([{
        author_id: data.authorId,
        author_name: data.authorName,
        author_photo: data.authorPhoto,
        content: data.content,
        image: data.image,
        likes_count: 0,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async getPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    return data;
  },

  async sendChatMessage(data: any) {
    const { error } = await supabase
      .from('chats')
      .insert([{
        sender_id: data.senderId,
        receiver_id: data.receiverId,
        text: data.text,
        created_at: new Date().toISOString()
      }]);
    
    if (error) throw error;
  },

  async sendForumMessage(data: any) {
    const { error } = await supabase
      .from('forums')
      .insert([{
        author_id: data.authorId,
        author_name: data.authorName,
        stream: data.stream,
        text: data.text,
        created_at: new Date().toISOString()
      }]);
    
    if (error) throw error;
  },

  async getForumMessages(stream: string) {
    const { data, error } = await supabase
      .from('forums')
      .select('*')
      .or(`stream.eq.${stream},stream.eq.General`)
      .order('created_at', { ascending: true })
      .limit(100);
    
    if (error) throw error;
    return data;
  },

  async searchScholars(searchTerm: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .ilike('display_name', `%${searchTerm}%`)
      .limit(20);
    
    if (error) throw error;
    return data;
  },

  async followUser(followerId: string, followingId: string) {
    try {
      // 1. Create follow doc
      await supabase.from('follows').insert([{
        follower_id: followerId,
        following_id: followingId,
        created_at: new Date().toISOString()
      }]);

      // 2. Increment counts
      const { data: follower } = await supabase.from('profiles').select('following_count').eq('id', followerId).single();
      const { data: following } = await supabase.from('profiles').select('followers_count').eq('id', followingId).single();

      await supabase.from('profiles').update({
        following_count: (follower?.following_count || 0) + 1
      }).eq('id', followerId);

      await supabase.from('profiles').update({
        followers_count: (following?.followers_count || 0) + 1
      }).eq('id', followingId);

    } catch (error) {
      console.error('Follow error:', error);
      throw error;
    }
  }
};
