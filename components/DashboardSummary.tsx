import { useMemo } from 'react';
import { DollarSign, TrendingUp, Tag, Calendar } from 'lucide-react';

type Transaction = {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
};

type DashboardSummaryProps = {
  transactions: Transaction[];
};

export default function DashboardSummary({ transactions }: DashboardSummaryProps) {
  const summaryData = useMemo(() => {
    const totalExpenses = transactions.reduce((sum, transaction) => 
      sum + Math.abs(transaction.amount), 0);
    
    
    const categoryCounts = {};
    const categoryTotals = {};
    
    transactions.forEach(transaction => {
      const { category, amount } = transaction;
      if (!category) return; 
      
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(amount);
    });
    
    let topCategory = null;
    let topCategoryCount = 0;
    
    Object.entries(categoryCounts).forEach(([category, count]) => {
      if (count > topCategoryCount) {
        topCategory = category;
        topCategoryCount = count as number;
      }
    });
  
    let topSpendingCategory = null;
    let topSpendingAmount = 0;
    
    Object.entries(categoryTotals).forEach(([category, amount]) => {
      if (amount > topSpendingAmount) {
        topSpendingCategory = category;
        topSpendingAmount = amount as number;
      }
    });
    
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const recentTransaction = sortedTransactions[0];
    
    return {
      totalExpenses,
      topCategory,
      topCategoryCount,
      topSpendingCategory,
      topSpendingAmount,
      recentTransaction
    };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#131720]/80 border border-[#2a3347] rounded-xl p-5 flex flex-col animate-pulse">
          <div className="h-8 w-32 bg-[#2a3347] rounded mb-2"></div>
          <div className="h-6 w-20 bg-[#2a3347] rounded mt-auto"></div>
        </div>
        <div className="bg-[#131720]/80 border border-[#2a3347] rounded-xl p-5 flex flex-col animate-pulse">
          <div className="h-8 w-32 bg-[#2a3347] rounded mb-2"></div>
          <div className="h-6 w-20 bg-[#2a3347] rounded mt-auto"></div>
        </div>
        <div className="bg-[#131720]/80 border border-[#2a3347] rounded-xl p-5 flex flex-col animate-pulse">
          <div className="h-8 w-32 bg-[#2a3347] rounded mb-2"></div>
          <div className="h-6 w-20 bg-[#2a3347] rounded mt-auto"></div>
        </div>
        <div className="bg-[#131720]/80 border border-[#2a3347] rounded-xl p-5 flex flex-col animate-pulse">
          <div className="h-8 w-32 bg-[#2a3347] rounded mb-2"></div>
          <div className="h-6 w-20 bg-[#2a3347] rounded mt-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Expenses Card */}
      <div className="bg-[#131720]/80 border border-[#2a3347] rounded-xl p-5 flex flex-col hover:shadow-lg transition-shadow">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
            <DollarSign size={20} className="text-indigo-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-300">Total Expenses</h3>
        </div>
        <div className="mt-auto">
          <p className="text-2xl font-bold text-white">
            {formatCurrency(summaryData.totalExpenses)}
          </p>
          <p className="text-xs text-gray-400 mt-1">All time spending</p>
        </div>
      </div>
      
      {/* Top Spending Category Card */}
      <div className="bg-[#131720]/80 border border-[#2a3347] rounded-xl p-5 flex flex-col hover:shadow-lg transition-shadow">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
            <TrendingUp size={20} className="text-emerald-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-300">Top Spending</h3>
        </div>
        <div className="mt-auto">
          <p className="text-xl font-bold text-white">
            {summaryData.topSpendingCategory || 'N/A'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {summaryData.topSpendingAmount 
              ? formatCurrency(summaryData.topSpendingAmount) 
              : 'No data'}
          </p>
        </div>
      </div>
      
      {/* Most Used Category Card */}
      <div className="bg-[#131720]/80 border border-[#2a3347] rounded-xl p-5 flex flex-col hover:shadow-lg transition-shadow">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
            <Tag size={20} className="text-amber-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-300">Most Used</h3>
        </div>
        <div className="mt-auto">
          <p className="text-xl font-bold text-white">
            {summaryData.topCategory || 'N/A'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {summaryData.topCategoryCount 
              ? `${summaryData.topCategoryCount} transactions` 
              : 'No data'}
          </p>
        </div>
      </div>
      
      {/* Most Recent Transaction Card */}
      <div className="bg-[#131720]/80 border border-[#2a3347] rounded-xl p-5 flex flex-col hover:shadow-lg transition-shadow">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
            <Calendar size={20} className="text-purple-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-300">Recent Transaction</h3>
        </div>
        {summaryData.recentTransaction ? (
          <div className="mt-auto">
            <p className="text-lg font-bold text-white truncate">
              {summaryData.recentTransaction.description}
            </p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-400">
                {formatDate(summaryData.recentTransaction.date)}
              </p>
              <p className="text-sm font-medium text-indigo-400">
                {formatCurrency(summaryData.recentTransaction.amount)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 mt-auto">No recent transactions</p>
        )}
      </div>
    </div>
  );
}