import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Transaction from '../../../models/Transaction';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API Route called:', req.method);
  
  try {
    await dbConnect();
    console.log('Database connected successfully');
    
    if (req.method === 'GET') {
      try {
        const transactions = await Transaction.find({}).sort({ date: -1 });
        console.log('Transactions fetched:', transactions.length);
        
        res.status(200).json({ 
          success: true, 
          data: transactions,
          count: transactions.length 
        });
      } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ 
          success: false, 
          error: 'Failed to fetch transactions',
          details: error.message 
        });
      }
    } else if (req.method === 'POST') {
      try {
        const { amount, date, description, category } = req.body;
        
        const transaction = new Transaction({
          amount,
          date: new Date(date),
          description,
          category,
        });
        
        await transaction.save();
        console.log('Transaction saved:', transaction._id);
        
        res.status(201).json({ 
          success: true, 
          data: transaction 
        });
      } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(400).json({ 
          success: false, 
          error: 'Failed to create transaction',
          details: error.message 
        });
      }
    } else {
      res.status(405).json({ 
        success: false, 
        error: `Method ${req.method} not allowed` 
      });
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Database connection failed',
      details: error.message 
    });
  }
}