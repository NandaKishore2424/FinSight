import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Budget from '../../../models/Budget';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const { month, year } = req.query;
        
        let query = {};
        if (month !== undefined && year !== undefined) {
          // Ensure month and year are properly parsed as integers
          query = { 
            month: parseInt(month as string, 10), 
            year: parseInt(year as string, 10) 
          };
        }
        
        console.log("Budget query:", query);
        const budgets = await Budget.find(query);
        console.log("Found budgets:", budgets.length);
        res.status(200).json({ success: true, data: budgets });
      } catch (error) {
        console.error("Budget fetch error:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
      
    case 'POST':
      try {
        const { category, amount, month, year } = req.body;
        
        // Try to find existing budget for this category and period
        let budget = await Budget.findOne({ 
          category, 
          month: parseInt(month), 
          year: parseInt(year) 
        });
        
        // If exists, update it
        if (budget) {
          budget.amount = amount;
          await budget.save();
        } else {
          // Otherwise create new
          budget = await Budget.create({
            category,
            amount,
            month: parseInt(month),
            year: parseInt(year)
          });
        }
        
        res.status(201).json({ success: true, data: budget });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
      
    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}