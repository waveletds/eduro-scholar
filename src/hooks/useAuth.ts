import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { dbService } from '../services/dbService';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        const userProfile = await dbService.getUserProfile(firebaseUser.uid);
        
        if (!userProfile) {
          // New user registration
          const newProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: 'student',
            walletBalance: 0,
            isVerifiedTeacher: false,
            stats: {
              totalQuizzes: 0,
              averageScore: 0,
              questionsContributed: 0
            }
          };
          await dbService.createUserProfile(firebaseUser.uid, newProfile);
          setProfile(newProfile);
        } else {
          setProfile(userProfile);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, profile, loading };
}
