import { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { toast } from '../components/ui/use-toast';
import { useTheme } from '../context/ThemeContext'; 

type Transaction = {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
};

type TransactionListProps = {
  transactions: Transaction[];
  onTransactionDeleted: () => void;
  onEditTransaction: (transaction: Transaction) => void;
};

export default function TransactionList({ 
  transactions, 
  onTransactionDeleted,
  onEditTransaction 
}: TransactionListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { isDarkMode } = useTheme(); // Get the dark mode state

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      setDeletingId(id);
      
      try {
        const res = await fetch(`/api/transactions/${id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Something went wrong');
        }

        toast({
          title: 'Success',
          description: 'Transaction deleted successfully',
        });
        
        onTransactionDeleted();
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center p-8 bg-[#131720]/30 border border-[#2a3347] rounded-xl">
        <p className="text-gray-400">No transactions found. Add some transactions to get started!</p>
      </div>
    );
  }

  return (
    <div className={`rounded-md overflow-hidden border ${isDarkMode ? 'border-gray-700' : 'border-blue-100'}`}>
      <Table>
        <TableHeader className={isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}>
          <TableRow className={`${isDarkMode ? 'border-b-gray-700 hover:bg-gray-700/50' : 'border-b-blue-100 hover:bg-blue-100/50'}`}>
            <TableHead className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold`}>Date</TableHead>
            <TableHead className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold`}>Description</TableHead>
            <TableHead className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold`}>Category</TableHead>
            <TableHead className={`text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold`}>Amount</TableHead>
            <TableHead className={`text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold`}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow 
              key={transaction._id} 
              className={`${isDarkMode ? 'border-b-gray-700 hover:bg-gray-700/50' : 'border-b-blue-100 hover:bg-blue-50'}`}
            >
              <TableCell className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-medium`}>
                {formatDate(transaction.date)}
              </TableCell>
              <TableCell className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-medium`}>
                {transaction.description}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isDarkMode 
                    ? 'bg-blue-900/40 text-blue-300' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {transaction.category || 'Uncategorized'}
                </span>
              </TableCell>
              <TableCell className={`text-right font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2 border-blue-200 hover:bg-blue-100 text-blue-700"
                  onClick={() => onEditTransaction(transaction)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 hover:bg-red-100 text-red-600"
                  onClick={() => handleDelete(transaction._id)}
                  disabled={deletingId === transaction._id}
                >
                  {deletingId === transaction._id ? 'Deleting...' : 'Delete'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}