import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

type Transaction = {
  _id: string;
  amount: number;
  date: string;
  description: string;
};

type ExpensesChartProps = {
  transactions: Transaction[];
};

export default function ExpensesChart({ transactions }: ExpensesChartProps) {
  const monthlyData = useMemo(() => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    // Initialize data for all months
    const data = months.map(month => ({
      month,
      total: 0,
    }));
    
    // Group transactions by month and calculate totals
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthIndex = date.getMonth();
      data[monthIndex].total += Math.abs(transaction.amount);
    });
    
    return data;
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">No transaction data available for chart visualization.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `$${value}`}
                width={60}
              />
              <Tooltip 
                formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Amount']} 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderColor: '#e2e8f0',
                  borderRadius: '0.5rem',
                  color: '#1e293b'
                }}
              />
              <Bar dataKey="total" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}