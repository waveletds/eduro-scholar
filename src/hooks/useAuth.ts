import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const handleAuthStateSync = async (supabaseUser: any) => {
      if (!mounted) return;
      console.log("handleAuthChange triggered for user:", supabaseUser?.id);

      if (!supabaseUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching profile for:", supabaseUser.id);
        const data = await dbService.getUserProfile(supabaseUser.id);
        
        if (!mounted) return;
        console.log("Profile data received:", data ? "Success" : "Not Found");
        
        setUser(supabaseUser);
        
        if (!data) {
          setProfile(null);
        } else {
          const mappedProfile = {
            uid: data.id,
            email: data.email,
            displayName: data.display_name,
            photoURL: data.photo_url,
            role: data.role || 'student',
            walletBalance: data.wallet_balance || 0,
            isVerifiedTeacher: data.is_verified_teacher || false,
            stats: data.stats || {},
            stream: data.stream,
            status: data.status,
            walletId: data.wallet_id,
            monnifyAccountNumber: data.monnify_account_number,
            monnifyBankName: data.monnify_bank_name,
            followingCount: data.following_count || 0,
            followersCount: data.followers_count || 0
          };
          setProfile(mappedProfile);
        }
      } catch (error) {
        console.error("Auth change error details:", error);
      } finally {
        if (mounted) {
          console.log("Loading finished");
          setLoading(false);
        }
      }
    };

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        if (session) {
          handleAuthStateSync(session.user);
        } else {
          setLoading(false);
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      console.log("Auth event:", event);
      
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        handleAuthStateSync(session?.user || null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setLoading(false);
      } else if (event === 'INITIAL_SESSION') {
        if (session?.user) {
          handleAuthStateSync(session.user);
        } else {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}
