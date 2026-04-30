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
  }
};
