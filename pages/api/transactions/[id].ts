import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/mongodb';
import Transaction from '../../../models/Transaction';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({ success: false, error: 'Invalid ID format' });
  }

  await connectToDatabase();

  switch (req.method) {
    case 'GET':
      try {
        const transaction = await Transaction.findById(id);
        if (!transaction) {
          return res.status(404).json({ success: false, error: 'Transaction not found' });
        }
        res.status(200).json({ success: true, data: transaction });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
      }
      break;

    case 'PUT':
      try {
        const { amount, date, description, category } = req.body;
        const transaction = await Transaction.findByIdAndUpdate(
          id, 
          { amount, date, description, category },
          { new: true, runValidators: true }
        );
        
        if (!transaction) {
          return res.status(404).json({ success: false, error: 'Transaction not found' });
        }
        
        res.status(200).json({ success: true, data: transaction });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const transaction = await Transaction.findByIdAndDelete(id);
        
        if (!transaction) {
          return res.status(404).json({ success: false, error: 'Transaction not found' });
        }
        
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
      }
      break;

    default:
      res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }
}