import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer, 
  ReferenceLine,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useTheme } from '../context/ThemeContext';

type Transaction = {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
};

type Budget = {
  _id?: string;
  category: string;
  amount: number;
  month: number;
  year: number;
};

type BudgetComparisonChartProps = {
  transactions: Transaction[];
  budgets: Budget[];
  month: number;
  year: number;
};

export default function BudgetComparisonChart({ 
  transactions, 
  budgets,
  month,
  year
}: BudgetComparisonChartProps) {
  const { isDarkMode } = useTheme();
  
  const comparisonData = useMemo(() => {
    // Filter transactions for current month/year
    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === month && 
        transactionDate.getFullYear() === year &&
        transaction.category // Ensure transaction has a category
      );
    });
    
    // Get spending by category
    const spendingByCategory = {};
    filteredTransactions.forEach(transaction => {
      const { category, amount } = transaction;
      if (!spendingByCategory[category]) {
        spendingByCategory[category] = 0;
      }
      spendingByCategory[category] += Math.abs(amount);
    });
    
    // Create comparison data with budgets
    const data = budgets.map(budget => {
      const actual = spendingByCategory[budget.category] || 0;
      const percentageUsed = budget.amount > 0 ? (actual / budget.amount) * 100 : 0;
      
      return {
        category: budget.category,
        budget: budget.amount,
        actual,
        percentageUsed,
        remaining: Math.max(0, budget.amount - actual),
        overBudget: Math.max(0, actual - budget.amount),
        isOverBudget: actual > budget.amount
      };
    });
    
    // Sort by percentage used (descending)
    return data.sort((a, b) => b.percentageUsed - a.percentageUsed);
  }, [transactions, budgets, month, year]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  if (budgets.length === 0) {
    return (
      <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'}>
        <CardHeader>
          <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-800'}>Budget Comparison</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            No budgets set for this month. Set a budget to see comparison.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'}>
      <CardHeader>
        <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-800'}>Budget Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 70
              }}
              barGap={0}
              barCategoryGap={10}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDarkMode ? '#374151' : '#e5e7eb'}
              />
              <XAxis 
                dataKey="category" 
                tick={{fill: isDarkMode ? '#9ca3af' : '#4b5563'}}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                tick={{fill: isDarkMode ? '#9ca3af' : '#4b5563'}}
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Amount']}
                contentStyle={{ 
                  backgroundColor: isDarkMode ? '#1f2937' : '#fff', 
                  borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                  color: isDarkMode ? '#f9fafb' : '#111827'
                }}
              />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: 20,
                  color: isDarkMode ? '#f9fafb' : '#111827' 
                }}
              />
              <Bar 
                name="Budget" 
                dataKey="budget" 
                fill={isDarkMode ? '#6366f1' : '#3b82f6'} 
                fillOpacity={0.6}
              />
              <Bar 
                name="Actual Spending" 
                dataKey="actual"
              >
                {comparisonData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isOverBudget 
                      ? (isDarkMode ? '#ef4444' : '#f87171') 
                      : (isDarkMode ? '#10b981' : '#34d399')} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}