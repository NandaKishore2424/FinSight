import { useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type Transaction = {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
};

type CategoryPieChartProps = {
  transactions: Transaction[];
};

const CATEGORY_COLORS = {
  'Housing': '#8884d8',
  'Transportation': '#83a6ed',
  'Food': '#8dd1e1',
  'Utilities': '#82ca9d',
  'Healthcare': '#a4de6c',
  'Insurance': '#d0ed57',
  'Entertainment': '#ffc658',
  'Personal': '#ff8042',
  'Education': '#ff6361',
  'Savings': '#bc5090',
  'Debt': '#58508d',
  'Gifts': '#003f5c',
  'Travel': '#665191',
  'Shopping': '#a05195',
  'Other': '#d45087'
};

export default function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  const categoryData = useMemo(() => {
    const categoryTotals = {};
    
    transactions.forEach(transaction => {
      const { category, amount } = transaction;
      if (!category) return;
      categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(amount);
    });
    
    return Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .filter(item => item.value > 0) 
      .sort((a, b) => (b.value as number) - (a.value as number)); 
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <Card className="bg-[#0f131d]/90 border-[#2a3347]">
        <CardHeader>
          <CardTitle className="text-white">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-center text-gray-400">No transaction data available for chart visualization.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => 
                  percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                }
              >
                {categoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CATEGORY_COLORS[entry.name] || '#8884d8'} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Amount']} 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderColor: '#e2e8f0',
                  borderRadius: '0.5rem',
                  color: '#1e293b'
                }}
              />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                wrapperStyle={{ color: '#1e293b' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}