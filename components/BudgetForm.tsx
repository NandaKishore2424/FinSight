import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { toast } from './ui/use-toast';
import { TransactionCategories } from '../models/Transaction';
import { useTheme } from '../context/ThemeContext';

type Budget = {
  _id?: string;
  category: string;
  amount: number;
  month: number;
  year: number;
};

type BudgetFormProps = {
  onBudgetAdded: () => void;
  currentMonth: number;
  currentYear: number;
  budgets: Budget[];
};

type FormData = {
  category: string;
  amount: number;
};

export default function BudgetForm({ onBudgetAdded, currentMonth, currentYear, budgets }: BudgetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isDarkMode } = useTheme();
  
  const { 
    register, 
    handleSubmit, 
    reset,
    setValue,
    watch,
    formState: { errors } 
  } = useForm<FormData>({
    defaultValues: {
      category: '',
      amount: 0
    }
  });

  const selectedCategory = watch('category');

  // Set amount if budget for this category already exists
  useEffect(() => {
    if (selectedCategory) {
      const existingBudget = budgets.find(b => b.category === selectedCategory);
      if (existingBudget) {
        setValue('amount', existingBudget.amount);
      } else {
        setValue('amount', 0);
      }
    }
  }, [selectedCategory, budgets, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: data.category,
          amount: parseFloat(data.amount.toString()),
          month: currentMonth,
          year: currentYear
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save budget');
      }

      toast({
        title: "Budget set successfully",
        description: `Budget for ${data.category} has been set to ${new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR'
        }).format(data.amount)}`,
      });
      
      reset({ category: '', amount: 0 });
      onBudgetAdded();
      
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <Select
            id="category"
            className={`hover:border-blue-400 ${isDarkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white' : ''}`}
            {...register('category', { required: 'Category is required' })}
          >
            <option value="">Select a category</option>
            {TransactionCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="amount" className="form-label">
            Budget Amount
          </label>
          <Input
            id="amount"
            type="number"
            step="100"
            min="0"
            placeholder="Enter budget amount"
            className={`hover:border-blue-400 ${isDarkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400' : ''}`}
            {...register('amount', { 
              required: 'Budget amount is required',
              valueAsNumber: true,
              min: {
                value: 0,
                message: 'Budget amount cannot be negative'
              }
            })}
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className={`${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
        >
          {isSubmitting ? 'Saving...' : 'Set Budget'}
        </Button>
      </div>
    </form>
  );
}