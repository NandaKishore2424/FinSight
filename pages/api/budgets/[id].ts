import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Budget from '../../../models/Budget';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const budget = await Budget.findById(id);
        if (!budget) {
          return res.status(404).json({ success: false, error: 'Budget not found' });
        }
        res.status(200).json({ success: true, data: budget });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
      }
      break;

    case 'PUT':
      try {
        const { amount } = req.body;
        const budget = await Budget.findByIdAndUpdate(
          id, 
          { amount },
          { new: true, runValidators: true }
        );
        
        if (!budget) {
          return res.status(404).json({ success: false, error: 'Budget not found' });
        }
        
        res.status(200).json({ success: true, data: budget });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const budget = await Budget.findByIdAndDelete(id);
        
        if (!budget) {
          return res.status(404).json({ success: false, error: 'Budget not found' });
        }
        
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
      
    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}