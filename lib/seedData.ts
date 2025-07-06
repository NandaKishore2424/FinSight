import dbConnect from './mongodb';
import Transaction from '../models/Transaction';
import Budget from '../models/Budget';

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

const sampleTransactions = [
  {
    amount: -28000,
    date: new Date(currentYear, currentMonth, 1),
    description: "Monthly Rent Payment",
    category: "Housing"
  },
  {
    amount: -4200,
    date: new Date(currentYear, currentMonth, 3),
    description: "Weekly Grocery Shopping",
    category: "Food"
  },
  {
    amount: -2800,
    date: new Date(currentYear, currentMonth, 5),
    description: "Fuel for Car",
    category: "Transportation"
  },
  {
    amount: -1500,
    date: new Date(currentYear, currentMonth, 8),
    description: "Movie Night with Friends",
    category: "Entertainment"
  },
  {
    amount: -3200,
    date: new Date(currentYear, currentMonth, 10),
    description: "Electricity Bill",
    category: "Utilities"
  },
  {
    amount: -2100,
    date: new Date(currentYear, currentMonth, 12),
    description: "Doctor Visit",
    category: "Healthcare"
  },
  {
    amount: -1800,
    date: new Date(currentYear, currentMonth, 15),
    description: "Online Course Subscription",
    category: "Education"
  },
  {
    amount: -4500,
    date: new Date(currentYear, currentMonth, 18),
    description: "Monthly Grocery Stock",
    category: "Food"
  },
  {
    amount: -2200,
    date: new Date(currentYear, currentMonth, 20),
    description: "Car Service",
    category: "Transportation"
  },
  {
    amount: -1200,
    date: new Date(currentYear, currentMonth, 22),
    description: "Netflix & Spotify",
    category: "Entertainment"
  },
  {
    amount: -3800,
    date: new Date(currentYear, currentMonth, 25),
    description: "New Clothes Shopping",
    category: "Shopping"
  },
  {
    amount: 85000,
    date: new Date(currentYear, currentMonth, 1),
    description: "Monthly Salary",
    category: "Other"
  },
  {
    amount: 15000,
    date: new Date(currentYear, currentMonth, 15),
    description: "Freelance Project Payment",
    category: "Other"
  },
  
  {
    amount: -26000,
    date: new Date(currentYear, currentMonth - 1, 1),
    description: "Monthly Rent Payment",
    category: "Housing"
  },
  {
    amount: -3800,
    date: new Date(currentYear, currentMonth - 1, 4),
    description: "Weekly Grocery Shopping",
    category: "Food"
  },
  {
    amount: -2500,
    date: new Date(currentYear, currentMonth - 1, 7),
    description: "Fuel for Car",
    category: "Transportation"
  },
  {
    amount: -1800,
    date: new Date(currentYear, currentMonth - 1, 10),
    description: "Concert Tickets",
    category: "Entertainment"
  },
  {
    amount: -2900,
    date: new Date(currentYear, currentMonth - 1, 12),
    description: "Water & Gas Bills",
    category: "Utilities"
  },
  {
    amount: 82000,
    date: new Date(currentYear, currentMonth - 1, 1),
    description: "Monthly Salary",
    category: "Other"
  },
];

const sampleBudgets = [
  {
    category: "Housing",
    amount: 35000,
    month: currentMonth,
    year: currentYear
  },
  {
    category: "Food",
    amount: 12000,
    month: currentMonth,
    year: currentYear
  },
  {
    category: "Transportation",
    amount: 8000,
    month: currentMonth,
    year: currentYear
  },
  {
    category: "Entertainment",
    amount: 5000,
    month: currentMonth,
    year: currentYear
  },
  {
    category: "Utilities",
    amount: 6000,
    month: currentMonth,
    year: currentYear
  },
  {
    category: "Healthcare",
    amount: 4000,
    month: currentMonth,
    year: currentYear
  },
  {
    category: "Education",
    amount: 3000,
    month: currentMonth,
    year: currentYear
  },
  {
    category: "Shopping",
    amount: 8000,
    month: currentMonth,
    year: currentYear
  },
];

export async function seedDefaultData() {
  try {
    await dbConnect();
    
    const existingTransactions = await Transaction.countDocuments();
    const existingBudgets = await Budget.countDocuments();
    
    if (existingTransactions === 0) {
      console.log('Seeding default transactions...');
      await Transaction.insertMany(sampleTransactions);
      console.log(` Added ${sampleTransactions.length} sample transactions`);
    }
    
    if (existingBudgets === 0) {
      console.log('Seeding default budgets...');
      await Budget.insertMany(sampleBudgets);
      console.log(` Added ${sampleBudgets.length} sample budgets`);
    }
    
    return { success: true, message: 'Default data seeded successfully' };
  } catch (error) {
    console.error('Error seeding default data:', error);
    return { success: false, error: error.message };
  }
}