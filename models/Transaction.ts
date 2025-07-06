import mongoose from 'mongoose';

// Export categories separately so they can be used on the client
export const TransactionCategories = [
  'Housing', 'Transportation', 'Food',
  'Utilities', 'Healthcare', 'Insurance', 'Entertainment', 'Personal',
  'Education', 'Savings', 'Debt', 'Gifts', 'Travel',
  'Shopping', 'Other'
];

// Only create the model when on the server side
const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
    validate: {
      validator: function(value: number) {
        return value !== 0;
      },
      message: 'Amount cannot be zero'
    }
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date'],
    default: Date.now
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [100, 'Description cannot be more than 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: {
      values: TransactionCategories,
      message: '{VALUE} is not a valid category'
    },
    default: 'Other'
  }
}, {
  timestamps: true
});

// Use this technique to prevent model compilation on the client side
let Transaction;

// Check if we're on the server side before trying to create the model
if (typeof window === 'undefined') {
  // We're on the server side, so it's safe to create/access the model
  Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
} else {
  // We're on the client side, so don't try to create the model
  // Just export a placeholder that won't be used directly by client components
  Transaction = {} as any;
}

export default Transaction;