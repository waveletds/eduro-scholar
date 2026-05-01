import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial check
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await handleAuthChange(session?.user || null);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      await handleAuthChange(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthChange = async (supabaseUser: any) => {
    setLoading(true);
    if (supabaseUser) {
      setUser(supabaseUser);
      const userProfile = await dbService.getUserProfile(supabaseUser.id);
      
      if (!userProfile) {
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
        setProfile(userProfile);
      }
    } else {
      setUser(null);
      setProfile(null);
    }
    setLoading(false);
  };

  return { user, profile, loading };
}
