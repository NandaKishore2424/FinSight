import mongoose from 'mongoose';
import { TransactionCategories } from '../constants/categories';

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 100,
  },
  category: {
    type: String,
    required: true,
    enum: TransactionCategories,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);