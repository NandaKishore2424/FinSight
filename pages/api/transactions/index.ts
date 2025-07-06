import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Transaction from '../../../models/Transaction';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const transactions = await Transaction.find({}).sort({ date: -1 });
        res.status(200).json({ success: true, data: transactions });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
      
    case 'POST':
      try {
        // Make sure category is included in the request body
        const { amount, date, description, category } = req.body;
        
        // Ensure category has a value
        const transaction = await Transaction.create({
          amount,
          date,
          description,
          category: category || 'Other' // Provide default if missing
        });
        
        res.status(201).json({ success: true, data: transaction });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
      
    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}