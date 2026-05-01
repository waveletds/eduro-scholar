import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await handleAuthChange(session.user);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Session check error:", error);
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        await handleAuthChange(session?.user || null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthChange = async (supabaseUser: any) => {
    setLoading(true);
    try {
      if (supabaseUser) {
        setUser(supabaseUser);
        const data = await dbService.getUserProfile(supabaseUser.id);
        
        if (!data) {
          // New user registration
          const newProfile = {
            uid: supabaseUser.id,
            email: supabaseUser.email,
            displayName: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0],
            photoURL: supabaseUser.user_metadata?.avatar_url,
            role: 'student',
            walletBalance: 0,
            isVerifiedTeacher: false,
            stats: {
              totalQuizzes: 0,
              averageScore: 0,
              questionsContributed: 0
            }
          };
          await dbService.createUserProfile(supabaseUser.id, newProfile);
          setProfile(newProfile);
        } else {
          // Map snake_case to camelCase
          const mappedProfile = {
            uid: data.id,
            email: data.email,
            displayName: data.display_name,
            photoURL: data.photo_url,
            role: data.role,
            walletBalance: data.wallet_balance,
            isVerifiedTeacher: data.is_verified_teacher,
            stats: data.stats,
            stream: data.stream,
            status: data.status,
            walletId: data.wallet_id,
            monnifyAccountNumber: data.monnify_account_number,
            monnifyBankName: data.monnify_bank_name,
            followingCount: data.following_count,
            followersCount: data.followers_count
          };
          setProfile(mappedProfile);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error("Auth change error:", error);
    } finally {
      setLoading(false);
    }
  };

  return { user, profile, loading };
}
