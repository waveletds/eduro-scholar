import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  admin.initializeApp({
    projectId: config.projectId,
  });
} else {
  admin.initializeApp();
}

const db = admin.firestore();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Wallet Transfer API
  app.post('/api/wallet/transfer', async (req, res) => {
    const { fromUserId, targetWalletId, amount } = req.body;

    if (!fromUserId || !targetWalletId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid transfer parameters' });
    }

    try {
      await db.runTransaction(async (transaction) => {
        // 1. Find target user by walletId
        const targetQuery = await db.collection('users').where('walletId', '==', targetWalletId).limit(1).get();
        if (targetQuery.empty) {
          throw new Error('Target wallet not found');
        }
        const targetDoc = targetQuery.docs[0];
        const targetUserId = targetDoc.id;

        if (fromUserId === targetUserId) {
          throw new Error('Cannot transfer to self');
        }

        // 2. Get sender data
        const senderRef = db.collection('users').doc(fromUserId);
        const senderDoc = await transaction.get(senderRef);
        
        if (!senderDoc.exists) {
          throw new Error('Sender not found');
        }

        const senderBalance = senderDoc.data()?.walletBalance || 0;
        if (senderBalance < amount) {
          throw new Error('Insufficient funds');
        }

        // 3. Perform transfer
        transaction.update(senderRef, {
          walletBalance: admin.firestore.FieldValue.increment(-amount),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        transaction.update(targetDoc.ref, {
          walletBalance: admin.firestore.FieldValue.increment(amount),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 4. Create transaction logs
        const txId = db.collection('transactions').doc().id;
        transaction.set(db.collection('transactions').doc(txId), {
          userId: fromUserId,
          amount: amount,
          type: 'withdrawal',
          description: `Transfer to ${targetWalletId}`,
          status: 'completed',
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        const rxId = db.collection('transactions').doc().id;
        transaction.set(db.collection('transactions').doc(rxId), {
          userId: targetUserId,
          amount: amount,
          type: 'deposit',
          description: `Transfer from ${senderDoc.data()?.displayName || 'Scholar'}`,
          status: 'completed',
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error('Transfer error:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // Monnify Placeholder API
  app.post('/api/wallet/virtual-account', async (req, res) => {
    const { userId, displayName, email } = req.body;
    
    // In a real app, you'd call Monnify API here
    // For this build, we'll simulate account generation
    try {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userData = userDoc.data();
      
      // If already has account, return it
      if (userData?.monnifyAccountNumber) {
        return res.json({
          accountNumber: userData.monnifyAccountNumber,
          bankName: userData.monnifyBankName
        });
      }

      // Generate mock details
      const mockAccount = {
        monnifyAccountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
        monnifyBankName: 'Wema Bank (Eduro)',
        walletId: displayName.split(' ')[0].toLowerCase() + Math.floor(1000 + Math.random() * 9000)
      };

      await userRef.update({
        ...mockAccount,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.json(mockAccount);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Eduro Scholar server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
