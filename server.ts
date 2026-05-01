import express from 'express';
// Removed top-level vite import to avoid production overhead
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

// Monnify Service Logic (Internalized to fix deployment resolution issues)
const MONNIFY_BASE_URL = 'https://api.monnify.com/api/v1';

const monnifyService = {
  async getAccessToken() {
    const apiKey = process.env.MONNIFY_API_KEY;
    const secretKey = process.env.MONNIFY_SECRET_KEY;
    
    if (!apiKey || !secretKey) {
      throw new Error('Monnify credentials not configured');
    }

    const auth = Buffer.from(`${apiKey}:${secretKey}`).toString('base64');
    
    try {
      const response = await axios.post(`${MONNIFY_BASE_URL}/auth/login`, {}, {
        headers: {
          Authorization: `Basic ${auth}`
        }
      });
      
      return response.data.responseBody.accessToken;
    } catch (error: any) {
      console.error('Monnify Auth Error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Monnify');
    }
  },

  async createReservedAccount(user: { id: string, name: string, email: string }) {
    const apiKey = process.env.MONNIFY_API_KEY;
    const secretKey = process.env.MONNIFY_SECRET_KEY;
    const contractCode = process.env.MONNIFY_CONTRACT_CODE;

    if (!apiKey || !secretKey || !contractCode) {
      console.warn('Monnify credentials not configured, providing mock virtual account');
      return {
        accounts: [
          {
            accountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
            bankName: 'EDURO TEST BANK'
          }
        ]
      };
    }

    const token = await this.getAccessToken();

    try {
      const response = await axios.post(`${MONNIFY_BASE_URL}/bank-transfer/reserved-accounts`, {
        accountReference: `EDURO_${user.id.substring(0, 10)}_${Date.now()}`,
        accountName: `EDURO-${user.name || 'Scholar'}`,
        currencyCode: 'NGN',
        contractCode: contractCode,
        customerEmail: user.email,
        customerName: user.name || 'Eduro Scholar',
        getAllAvailableBanks: true
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data.responseBody;
    } catch (error: any) {
      console.error('Monnify Reserved Account Error:', error.response?.data || error.message);
      throw new Error('Failed to create virtual account');
    }
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase with Service Role Key for server-side operations
const supabaseUrl = process.env.SUPABASE_URL || 'https://xhzssxxwjcyvcrscdpiq.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenNzeHh3amN5dmNyc2NkcGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NDA1NTksImV4cCI6MjA5MzExNjU1OX0.KPiqD1Of-0hUGH5H0tM3CA884wWlrQWsLqHKSmSfrl4';

const supabase = createClient(supabaseUrl, supabaseKey);

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
      // 1. Find target user by wallet_id
      const { data: targetProfile, error: targetError } = await supabase
        .from('profiles')
        .select('id, display_name, wallet_balance')
        .eq('wallet_id', targetWalletId)
        .single();
      
      if (targetError || !targetProfile) {
        throw new Error('Target wallet not found');
      }
      
      const targetUserId = targetProfile.id;

      if (fromUserId === targetUserId) {
        throw new Error('Cannot transfer to self');
      }

      // 2. Get sender data
      const { data: senderProfile, error: senderError } = await supabase
        .from('profiles')
        .select('display_name, wallet_balance')
        .eq('id', fromUserId)
        .single();
      
      if (senderError || !senderProfile) {
        throw new Error('Sender not found');
      }

      const senderBalance = senderProfile.wallet_balance || 0;
      if (senderBalance < amount) {
        throw new Error('Insufficient funds');
      }

      // 3. Perform transfer (Atomic update - in a real app use Supabase RPC/Function)
      // Since we don't have transaction support in JS client easily without RPC,
      // we do standard updates.
      const { error: updErr1 } = await supabase
        .from('profiles')
        .update({ wallet_balance: senderBalance - amount })
        .eq('id', fromUserId);
      
      const { error: updErr2 } = await supabase
        .from('profiles')
        .update({ wallet_balance: (targetProfile.wallet_balance || 0) + amount })
        .eq('id', targetUserId);

      if (updErr1 || updErr2) throw new Error('Update failed');

      // 4. Create transaction logs
      await supabase.from('transactions').insert([
        {
          user_id: fromUserId,
          amount: amount,
          type: 'withdrawal',
          description: `Transfer to ${targetWalletId}`,
          status: 'completed',
          created_at: new Date().toISOString()
        },
        {
          user_id: targetUserId,
          amount: amount,
          type: 'deposit',
          description: `Transfer from ${senderProfile.display_name || 'Scholar'}`,
          status: 'completed',
          created_at: new Date().toISOString()
        }
      ]);

      res.json({ success: true });
    } catch (error: any) {
      console.error('Transfer error:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // Monnify API Integration
  app.post('/api/wallet/virtual-account', async (req, res) => {
    const { userId, displayName, email } = req.body;
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('monnify_account_number, monnify_bank_name, display_name, email, wallet_id')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // If already has account, return it
      if (profile.monnify_account_number) {
        return res.json({
          monnifyAccountNumber: profile.monnify_account_number,
          monnifyBankName: profile.monnify_bank_name,
          walletId: profile.wallet_id
        });
      }

      // Create real Monnify Reserved Account
      const monnifyData = await monnifyService.createReservedAccount({
        id: userId,
        name: profile.display_name || displayName || 'Scholar',
        email: profile.email || email
      });

      const bankDetails = monnifyData.accounts[0];
      const walletId = profile.wallet_id || (profile.display_name?.split(' ')[0] || 'scholar').toLowerCase() + Math.floor(1000 + Math.random() * 9000);

      await supabase
        .from('profiles')
        .update({
          monnify_account_number: bankDetails.accountNumber,
          monnify_bank_name: bankDetails.bankName,
          wallet_id: walletId,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      res.json({
        monnifyAccountNumber: bankDetails.accountNumber,
        monnifyBankName: bankDetails.bankName,
        walletId: walletId
      });
    } catch (error: any) {
      console.error('Monnify Account Creation Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Monnify Webhook
  app.post('/api/webhooks/monnify', async (req, res) => {
    // In production, verify Monnify signature here
    const { eventType, responseBody } = req.body;

    if (eventType === 'PAID_TRANSACTION') {
      const { customer, amountPaid, settlementAmount, transactionReference, paymentReference } = responseBody;
      const email = customer.email;

      try {
        // 1. Find user by email
        const { data: profile, error: profError } = await supabase
          .from('profiles')
          .select('id, wallet_balance')
          .eq('email', email)
          .single();

        if (profError || !profile) {
          console.error('Webhook: User not found for email', email);
          return res.status(404).end();
        }

        // 2. Update wallet balance
        const newBalance = (profile.wallet_balance || 0) + settlementAmount;
        
        const { error: updError } = await supabase
          .from('profiles')
          .update({ 
            wallet_balance: newBalance,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id);

        if (updError) throw updError;

        // 3. Log transaction
        await supabase.from('transactions').insert([{
          user_id: profile.id,
          amount: settlementAmount,
          type: 'deposit',
          description: `Wallet Funding via Monnify (Ref: ${paymentReference})`,
          status: 'completed',
          created_at: new Date().toISOString()
        }]);

        console.log(`Successfully funded wallet for ${email}: +${settlementAmount}`);
        return res.status(200).json({ success: true });
      } catch (error) {
        console.error('Webhook Error:', error);
        return res.status(500).end();
      }
    }

    res.status(200).end();
  });

  // Withdrawal API
  app.post('/api/wallet/withdraw', async (req, res) => {
    const { userId, amount, bankCode, accountNumber, accountName } = req.body;

    if (!userId || !amount || amount < 500) {
      return res.status(400).json({ error: 'Minimum withdrawal is ₦500' });
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', userId)
        .single();
      
      if (error || !profile) throw new Error('User not found');
      
      const balance = profile.wallet_balance || 0;
      if (balance < amount) throw new Error('Insufficient funds');

      await supabase
        .from('profiles')
        .update({
          wallet_balance: balance - amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      await supabase.from('transactions').insert([{
        user_id: userId,
        amount,
        type: 'withdrawal',
        description: `Withdrawal to ${accountName} (${accountNumber})`,
        status: 'pending',
        created_at: new Date().toISOString()
      }]);

      res.json({ success: true, message: 'Withdrawal initiated' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Utility Payment API (Airtime/Data/Courses)
  app.post('/api/wallet/utility', async (req, res) => {
    const { userId, type, amount, detail, description } = req.body;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid operation' });
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', userId)
        .single();
      
      if (error || !profile) throw new Error('User not found');
      
      const balance = profile.wallet_balance || 0;
      if (balance < amount) throw new Error('Insufficient funds');

      await supabase
        .from('profiles')
        .update({
          wallet_balance: balance - amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      await supabase.from('transactions').insert([{
        user_id: userId,
        amount,
        type: type, 
        description: description || `Payment for ${type}`,
        status: 'completed',
        created_at: new Date().toISOString()
      }]);

      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Vite integration
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    try {
      console.log('Attempting to start Vite dev server...');
      const { createServer } = await import('vite');
      const vite = await createServer({
        server: { 
          middlewareMode: true,
          hmr: false
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('Vite dev server middleware integrated.');
    } catch (e: any) {
      console.warn('Vite not found or failed to start, falling back to static:', e.message);
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Eduro Scholar server running at http://localhost:${PORT} in ${isProd ? 'production' : 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
