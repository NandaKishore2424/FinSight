import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { toast } from '../components/ui/use-toast';
import { useTheme } from '../context/ThemeContext';
import { TransactionCategories } from '../constants/categories';

type Transaction = {
  _id?: string;
  amount: number;
  date: string;
  description: string;
  category: string;
};

type TransactionFormProps = {
  onTransactionAdded: () => void;
  transactionToEdit: Transaction | null;
  resetEditMode: () => void;
};

type FormData = {
  amount: number;
  date: string;
  description: string;
  category: string;
};

export default function TransactionForm({ 
  onTransactionAdded, 
  transactionToEdit,
  resetEditMode
}: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { isDarkMode } = useTheme();
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      amount: undefined,
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: '',
    },
  });

  useEffect(() => {
    if (transactionToEdit) {
      setIsEditMode(true);
      setValue('amount', transactionToEdit.amount);
      setValue('date', new Date(transactionToEdit.date).toISOString().split('T')[0]);
      setValue('description', transactionToEdit.description);
      setValue('category', transactionToEdit.category);
    } else {
      setIsEditMode(false);
      reset({
        amount: undefined,
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: '',
      });
    }
  }, [transactionToEdit, setValue, reset]);

  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const formattedDate = new Date(data.date);
      console.log("Submitting transaction with date:", formattedDate);
      
      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode 
        ? `/api/transactions/${transactionToEdit._id}` 
        : '/api/transactions';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          date: formattedDate
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Something went wrong');
      }

      toast({
        title: 'Success',
        description: isEditMode 
          ? 'Transaction updated successfully' 
          : 'Transaction added successfully',
      });
      
      
      reset();
      if (isEditMode) {
        resetEditMode();
        setIsEditMode(false);
      }
      onTransactionAdded();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    resetEditMode();
    setIsEditMode(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label htmlFor="amount" className="form-label">
            Amount
          </label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="Enter amount"
            className="hover:border-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
            {...register('amount', { 
              required: 'Amount is required',
              valueAsNumber: true,
              validate: value => value !== 0 || 'Amount cannot be zero' 
            })}
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="date" className="form-label">
            Date
          </label>
          <Input
            id="date"
            type="date"
            className="hover:border-blue-400"
            {...register('date', { required: 'Date is required' })}
          />
          {errors.date && (
            <p className="text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <Input
            id="description"
            type="text"
            placeholder="Enter description"
            className="hover:border-blue-400"
            {...register('description', { 
              required: 'Description is required',
              maxLength: {
                value: 100,
                message: 'Description cannot be more than 100 characters'
              }
            })}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <Select
            id="category"
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
      </div>
      
      <div className="flex space-x-2 pt-4">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting 
            ? (isEditMode ? 'Updating...' : 'Adding...') 
            : (isEditMode ? 'Update Transaction' : 'Add Transaction')
          }
        </Button>
        
        {isEditMode && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            className={`border-gray-300 hover:bg-gray-50 text-gray-700 ${
              isDarkMode ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-white' : ''
            }`}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}