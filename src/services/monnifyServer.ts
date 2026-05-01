import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const MONNIFY_BASE_URL = 'https://api.monnify.com/api/v1'; // Use 'https://sandbox.monnify.com/api/v1' for testing if needed

export const monnifyService = {
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
    const token = await this.getAccessToken();
    const contractCode = process.env.MONNIFY_CONTRACT_CODE;

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
