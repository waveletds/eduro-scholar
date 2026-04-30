import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc,
  Timestamp,
  increment,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const dbService = {
  // User Profile
  async getUserProfile(userId: string) {
    const path = `users/${userId}`;
    try {
      const docSnap = await getDoc(doc(db, 'users', userId));
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  async createUserProfile(userId: string, data: any) {
    const path = `users/${userId}`;
    try {
      await setDoc(doc(db, 'users', userId), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Questions
  async submitQuestion(data: any) {
    const path = 'questions';
    try {
      return await addDoc(collection(db, 'questions'), {
        ...data,
        status: 'pending',
        usageCount: 0,
        ratingSum: 0,
        ratingCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async adminApproveQuestion(questionId: string) {
    const path = `questions/${questionId}`;
    try {
      await updateDoc(doc(db, 'questions', questionId), {
        status: 'approved',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async adminRejectQuestion(questionId: string, reason: string) {
    const path = `questions/${questionId}`;
    try {
      await updateDoc(doc(db, 'questions', questionId), {
        status: 'rejected',
        rejectionReason: reason,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  // Wallet and Royalties
  async recordUsageRoyalty(questionId: string, creatorId: string) {
    const transactionPath = 'transactions';
    const amount = 2; // 2 Naira per attempt as per PRD range (1-2)
    
    try {
      // 1. Log transaction
      await addDoc(collection(db, 'transactions'), {
        userId: creatorId,
        amount,
        type: 'usage_royalty',
        questionId,
        status: 'completed',
        description: `Royalty for question attempt`,
        timestamp: serverTimestamp()
      });

      // 2. Update teacher's wallet and stats
      const userRef = doc(db, 'users', creatorId);
      await updateDoc(userRef, {
        walletBalance: increment(amount),
        'stats.monthlyEarnings': increment(amount),
        'stats.studentsReached': increment(1)
      });

      // 3. Increment question usage count
      const questionRef = doc(db, 'questions', questionId);
      await updateDoc(questionRef, {
        usageCount: increment(1)
      });
    } catch (error) {
      console.error("Failed to record royalty:", error);
    }
  },

  async rateQuestion(questionId: string, rating: number) {
    const path = `questions/${questionId}`;
    try {
      await updateDoc(doc(db, 'questions', questionId), {
        ratingSum: increment(rating),
        ratingCount: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async getQuestions(q: any) {
    const path = 'questions';
    try {
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  // Attempts
  async saveAttempt(userId: string, data: any) {
    const path = 'attempts';
    try {
      return await addDoc(collection(db, 'attempts'), {
        userId,
        ...data,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  // Wallet APIs
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

  // Social Features
  async updateUserSocial(userId: string, data: { status?: string; stream?: string; photoURL?: string; displayName?: string }) {
    const path = `users/${userId}`;
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async createPost(data: any) {
    const path = 'posts';
    try {
      return await addDoc(collection(db, 'posts'), {
        ...data,
        likesCount: 0,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async getPosts() {
    const path = 'posts';
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async sendChatMessage(data: any) {
    const path = 'chats';
    try {
      return await addDoc(collection(db, 'chats'), {
        ...data,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async sendForumMessage(data: any) {
    const path = 'forums';
    try {
      return await addDoc(collection(db, 'forums'), {
        ...data,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async getForumMessages(stream: string) {
    const path = 'forums';
    try {
      const q = query(
        collection(db, 'forums'), 
        where('stream', 'in', [stream, 'General']),
        orderBy('createdAt', 'asc'), 
        limit(100)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async searchScholars(searchTerm: string) {
    const path = 'users';
    try {
      // Basic search (in a real app we'd use Algolia or a better index)
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'student'),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      return users.filter(u => u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async followUser(followerId: string, followingId: string) {
    const path = 'follows';
    try {
      // 1. Create follow doc
      await addDoc(collection(db, 'follows'), {
        followerId,
        followingId,
        createdAt: serverTimestamp()
      });

      // 2. Increment counts
      await updateDoc(doc(db, 'users', followerId), {
        followingCount: increment(1)
      });
      await updateDoc(doc(db, 'users', followingId), {
        followersCount: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }
};
