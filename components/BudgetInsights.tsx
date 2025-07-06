import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
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

type BudgetInsightsProps = {
  transactions: Transaction[];
  budgets: Budget[];
  month: number;
  year: number;
};

export default function BudgetInsights({ 
  transactions, 
  budgets,
  month,
  year
}: BudgetInsightsProps) {
  const { isDarkMode } = useTheme();
  
  const insights = useMemo(() => {
    console.log("Recalculating insights with:", {
      transactionsCount: transactions.length,
      budgetsCount: budgets.length,
      month,
      year
    });
    
    // For better debugging
    console.log("Raw transactions data:", transactions.map(t => ({
      date: new Date(t.date),
      month: new Date(t.date).getMonth(),
      year: new Date(t.date).getFullYear(),
      amount: t.amount,
      category: t.category
    })));
    
    if (!transactions.length || !budgets.length) {
      return [];
    }
    
    // Filter transactions for current month/year - using proper date handling
    const currentMonthTransactions = transactions.filter(transaction => {
      // Ensure date is handled correctly - may need to be converted first
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === month && 
        transactionDate.getFullYear() === year &&
        transaction.category // Only consider transactions with categories
      );
    });
    
    // After filtering for current month
    console.log("Current month filtered transactions:", currentMonthTransactions.map(t => ({
      category: t.category,
      amount: t.amount
    })));
    
    console.log("Current month transactions:", currentMonthTransactions.length);
    
    // Get previous month
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    
    // Filter transactions for previous month/year
    const prevMonthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === prevMonth && 
        transactionDate.getFullYear() === prevYear &&
        transaction.category // Only consider transactions with categories
      );
    });
    
    console.log("Previous month transactions:", prevMonthTransactions.length);
    
    // Calculate spending by category for current month
    const spendingByCategory = {};
    currentMonthTransactions.forEach(transaction => {
      const { category, amount } = transaction;
      if (!category) return;
      
      if (!spendingByCategory[category]) {
        spendingByCategory[category] = 0;
      }
      spendingByCategory[category] += Math.abs(amount);
    });
    
    // Calculate spending by category for previous month
    const prevSpendingByCategory = {};
    prevMonthTransactions.forEach(transaction => {
      const { category, amount } = transaction;
      if (!category) return;
      
      if (!prevSpendingByCategory[category]) {
        prevSpendingByCategory[category] = 0;
      }
      prevSpendingByCategory[category] += Math.abs(amount);
    });
    
    console.log("Spending by category:", spendingByCategory);
    console.log("Previous spending by category:", prevSpendingByCategory);
    
    const insightsList = [];
    
    // Insight 1: Categories over budget
    const overBudgetCategories = budgets
      .filter(budget => {
        const spent = spendingByCategory[budget.category] || 0;
        return spent > budget.amount;
      })
      .sort((a, b) => {
        const aOverage = (spendingByCategory[a.category] || 0) - a.amount;
        const bOverage = (spendingByCategory[b.category] || 0) - b.amount;
        return bOverage - aOverage;
      });
    
    if (overBudgetCategories.length > 0) {
      const topOverBudget = overBudgetCategories[0];
      const spent = spendingByCategory[topOverBudget.category] || 0;
      const overage = spent - topOverBudget.amount;
      const percentOver = ((spent / topOverBudget.amount) - 1) * 100;
      
      insightsList.push({
        type: 'warning',
        icon: <AlertTriangle className={`${isDarkMode ? 'text-yellow-300' : 'text-yellow-500'}`} />,
        title: `${topOverBudget.category} is over budget`,
        description: `You've exceeded your ${topOverBudget.category} budget by ${formatCurrency(overage)} (${percentOver.toFixed(0)}% over)`
      });
      
      if (overBudgetCategories.length > 1) {
        insightsList.push({
          type: 'warning',
          icon: <AlertTriangle className={`${isDarkMode ? 'text-yellow-300' : 'text-yellow-500'}`} />,
          title: `${overBudgetCategories.length} categories over budget`,
          description: `You have ${overBudgetCategories.length} categories where spending exceeds the budget`
        });
      }
    }
    
    // Insight 2: Categories with increased spending
    const increasedSpendingCategories = Object.keys(spendingByCategory)
      .filter(category => {
        const currentSpent = spendingByCategory[category] || 0;
        const prevSpent = prevSpendingByCategory[category] || 0;
        return prevSpent > 0 && currentSpent > prevSpent * 1.2; // 20% increase
      })
      .sort((a, b) => {
        const aIncrease = (spendingByCategory[a] || 0) - (prevSpendingByCategory[a] || 0);
        const bIncrease = (spendingByCategory[b] || 0) - (prevSpendingByCategory[b] || 0);
        return bIncrease - aIncrease;
      });
    
    if (increasedSpendingCategories.length > 0) {
      const topIncrease = increasedSpendingCategories[0];
      const currentSpent = spendingByCategory[topIncrease] || 0;
      const prevSpent = prevSpendingByCategory[topIncrease] || 0;
      const percentIncrease = ((currentSpent / prevSpent) - 1) * 100;
      
      insightsList.push({
        type: 'info',
        icon: <TrendingUp className={`${isDarkMode ? 'text-red-300' : 'text-red-500'}`} />,
        title: `${topIncrease} spending increased`,
        description: `Spending on ${topIncrease} increased by ${percentIncrease.toFixed(0)}% compared to last month`
      });
    }
    
    // Insight 3: Categories with decreased spending
    const decreasedSpendingCategories = Object.keys(spendingByCategory)
      .filter(category => {
        const currentSpent = spendingByCategory[category] || 0;
        const prevSpent = prevSpendingByCategory[category] || 0;
        return prevSpent > 0 && currentSpent < prevSpent * 0.8; // 20% decrease
      })
      .sort((a, b) => {
        const aDecrease = (prevSpendingByCategory[a] || 0) - (spendingByCategory[a] || 0);
        const bDecrease = (prevSpendingByCategory[b] || 0) - (spendingByCategory[b] || 0);
        return bDecrease - aDecrease;
      });
    
    if (decreasedSpendingCategories.length > 0) {
      const topDecrease = decreasedSpendingCategories[0];
      const currentSpent = spendingByCategory[topDecrease] || 0;
      const prevSpent = prevSpendingByCategory[topDecrease] || 0;
      const percentDecrease = ((prevSpent - currentSpent) / prevSpent) * 100;
      
      insightsList.push({
        type: 'success',
        icon: <TrendingDown className={`${isDarkMode ? 'text-green-300' : 'text-green-500'}`} />,
        title: `${topDecrease} spending decreased`,
        description: `Spending on ${topDecrease} decreased by ${percentDecrease.toFixed(0)}% compared to last month`
      });
    }
    
    // Insight 4: Well managed categories
    const wellManagedCategories = budgets
      .filter(budget => {
        const spent = spendingByCategory[budget.category] || 0;
        // Between 80% and 100% of budget
        return spent >= budget.amount * 0.8 && spent <= budget.amount;
      })
      .sort((a, b) => {
        const aPercentage = (spendingByCategory[a.category] || 0) / a.amount;
        const bPercentage = (spendingByCategory[b.category] || 0) / b.amount;
        return bPercentage - aPercentage; // Closest to budget first
      });
    
    if (wellManagedCategories.length > 0) {
      insightsList.push({
        type: 'success',
        icon: <CheckCircle className={`${isDarkMode ? 'text-green-300' : 'text-green-500'}`} />,
        title: `Well managed budgets`,
        description: `You're staying within budget for ${wellManagedCategories.length} categories`
      });
    }
    
    // Insight 5: General advice based on overall spending
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = Object.values(spendingByCategory).reduce((sum: number, amount: number) => sum + amount, 0);
    
    if (totalSpent < totalBudget * 0.7) {
      insightsList.push({
        type: 'tip',
        icon: <Lightbulb className={`${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />,
        title: `You're under budget`,
        description: `You've only used ${((totalSpent / totalBudget) * 100).toFixed(0)}% of your total budget. Consider saving the difference!`
      });
    }
    
    // Add a basic insight if we have budget and spending data but no other insights
    if (insightsList.length === 0 && totalBudget > 0) {
      const percentUsed = (totalSpent / totalBudget) * 100;
      insightsList.push({
        type: 'tip',
        icon: <Lightbulb className={`${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />,
        title: `Budget Overview`,
        description: `You've used ${percentUsed.toFixed(0)}% of your total budget so far this month.`
      });
    }
    
    return insightsList;
  }, [transactions, budgets, month, year, isDarkMode]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  console.log("Rendering BudgetInsights with", insights.length, "insights");

  if (insights.length === 0) {
    return (
      <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'}>
        <CardHeader>
          <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-800'}>Spending Insights</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            Set budgets and add transactions to get personalized spending insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'}>
      <CardHeader>
        <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-800'}>Spending Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${
                insight.type === 'warning' 
                  ? isDarkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200' 
                : insight.type === 'success'
                  ? isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
                : insight.type === 'info'
                  ? isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
                : isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  {insight.icon}
                </div>
                <div>
                  <h4 className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {insight.title}
                  </h4>
                  <p className={`text-sm mt-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}