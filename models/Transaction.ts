import mongoose from 'mongoose';


export const TransactionCategories = [
  'Housing', 'Transportation', 'Food',
  'Utilities', 'Healthcare', 'Insurance', 'Entertainment', 'Personal',
  'Education', 'Savings', 'Debt', 'Gifts', 'Travel',
  'Shopping', 'Other'
];


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

let Transaction;

if (typeof window === 'undefined') {
  Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
} else {
  Transaction = {} as any;
}

export default Transaction;