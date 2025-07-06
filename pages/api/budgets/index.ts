import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Budget from '../../../models/Budget';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Budget API Route called:', req.method);
  
  try {
    await dbConnect();
    console.log('Database connected successfully');
    
    if (req.method === 'GET') {
      try {
        const { month, year } = req.query;
        
        const budgets = await Budget.find({
          month: parseInt(month as string) || new Date().getMonth(),
          year: parseInt(year as string) || new Date().getFullYear()
        });
        
        console.log('Budgets fetched:', budgets.length);
        
        res.status(200).json({ 
          success: true, 
          data: budgets,
          count: budgets.length 
        });
      } catch (error) {
        console.error('Error fetching budgets:', error);
        res.status(500).json({ 
          success: false, 
          error: 'Failed to fetch budgets',
          details: error.message 
        });
      }
    } else if (req.method === 'POST') {
      try {
        const { category, amount, month, year } = req.body;
        
        // Check if budget already exists for this category and month
        const existingBudget = await Budget.findOne({ category, month, year });
        
        if (existingBudget) {
          // Update existing budget
          existingBudget.amount = amount;
          await existingBudget.save();
          console.log('Budget updated:', existingBudget._id);
          
          res.status(200).json({ 
            success: true, 
            data: existingBudget 
          });
        } else {
          // Create new budget
          const budget = new Budget({ category, amount, month, year });
          await budget.save();
          console.log('Budget created:', budget._id);
          
          res.status(201).json({ 
            success: true, 
            data: budget 
          });
        }
      } catch (error) {
        console.error('Error creating/updating budget:', error);
        res.status(400).json({ 
          success: false, 
          error: 'Failed to create/update budget',
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