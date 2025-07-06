import mongoose from 'mongoose';
import { TransactionCategories } from '../constants/categories'; 

const BudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: {
      values: TransactionCategories,
      message: '{VALUE} is not a valid category'
    }
  },
  amount: {
    type: Number,
    required: [true, 'Please provide a budget amount'],
    min: [0, 'Budget amount cannot be negative']
  },
  month: {
    type: Number,
    required: [true, 'Month is required'],
    min: [0, 'Month must be between 0 and 11'],
    max: [11, 'Month must be between 0 and 11']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    validate: {
      validator: function(value: number) {
        return value >= 2020 && value <= 2100;
      },
      message: 'Year must be between 2020 and 2100'
    }
  }
}, {
  timestamps: true
});

BudgetSchema.index({ category: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);