import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import ExpensesChart from "../components/ExpensesChart";
import CategoryPieChart from "../components/CategoryPieChart";
import DashboardSummary from "../components/DashboardSummary";
import { Toaster } from "../components/ui/toaster";
import { useTheme } from "../context/ThemeContext";
import { Menu, X, BarChart3, PieChart, DollarSign, User, Moon, Sun, Plus } from "lucide-react";
import BudgetForm from "../components/BudgetForm";
import BudgetComparisonChart from "../components/BudgetComparisonChart";
import BudgetInsights from "../components/BudgetInsights";
import { toast } from "../components/ui/use-toast";

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

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isSeeding, setIsSeeding] = useState(false);
  
  const formRef = useRef<HTMLDivElement>(null);
  const analyticsRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const { isDarkMode, toggleTheme } = useTheme();
  
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/transactions");
      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await res.json();
      setTransactions(data.data);
      setError(null);
    } catch (err) {
      setError("Failed to load transactions. Please try again.");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgets = async () => {
    try {
      const res = await fetch(`/api/budgets?month=${currentMonth}&year=${currentYear}`);
      if (!res.ok) {
        throw new Error("Failed to fetch budgets");
      }
      const data = await res.json();
      console.log("Fetched budgets:", data.data);
      setBudgets(data.data);
    } catch (err) {
      console.error("Error fetching budgets:", err);
    }
  };
  
  const handleEditTransaction = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetEditMode = () => {
    setTransactionToEdit(null);
  };
  
  const refreshAllData = () => {
    fetchTransactions();
    fetchBudgets();
  };

  const handleTransactionAdded = () => {
    refreshAllData();
    resetEditMode();
  };
  
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToAnalytics = () => {
    analyticsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToHistory = () => {
    historyRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToBudget = () => {
    budgetRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const seedDemoData = async () => {
    setIsSeeding(true);
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Demo Data Added!",
          description: "Sample transactions and budgets have been added to showcase the app features.",
        });
        // Refresh the data
        fetchTransactions();
        fetchBudgets();
      } else {
        toast({
          title: "Note",
          description: "Demo data already exists or failed to add.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add demo data.",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const transactionsResponse = await fetch('/api/transactions');
        const transactionsData = await transactionsResponse.json();
        
        if (transactionsData.success) {
          setTransactions(transactionsData.data);
        } else {
          console.error("Failed to fetch transactions:", transactionsData.error);
          setError(`Failed to fetch transactions: ${transactionsData.error}`);
        }
        
        const budgetsResponse = await fetch(`/api/budgets?month=${currentMonth}&year=${currentYear}`);
        const budgetsData = await budgetsResponse.json();
        
        if (budgetsData.success) {
          setBudgets(budgetsData.data);
        } else {
          console.error("Failed to fetch budgets:", budgetsData.error);
          setError(prev => prev ? `${prev} | Failed to fetch budgets: ${budgetsData.error}` : `Failed to fetch budgets: ${budgetsData.error}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(`Network error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentMonth, currentYear]);

  return (
    <>
      <Head>
        <title>FinSight | Personal Finance Visualizer</title>
        <meta name="description" content="Track, analyze and optimize your personal finances with our elegant dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-white to-blue-50 text-gray-800'} flex flex-col font-['Inter',sans-serif]`}>
        {/* Navigation */}
        <nav className={`sticky top-0 z-40 ${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-blue-100'} backdrop-blur-md border-b px-4 py-3 shadow-sm`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg ${isDarkMode ? 'bg-gradient-to-br from-indigo-600 to-purple-700' : 'bg-gradient-to-br from-blue-500 to-indigo-600'} flex items-center justify-center shadow-lg`}>
                  <DollarSign size={18} className="text-white" />
                </div>
                <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700'}`}>
                  FinSight<span className={`${isDarkMode ? 'text-indigo-400' : 'text-blue-500'} ml-1`}>Pro</span>
                </span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              <NavItem onClick={scrollToForm} icon={<Plus size={16} />}>Add Transaction</NavItem>
              <NavItem onClick={scrollToBudget} icon={<DollarSign size={16} />}>Budget</NavItem>
              <NavItem onClick={scrollToAnalytics} icon={<PieChart size={16} />}>Analytics</NavItem>
              <NavItem onClick={scrollToHistory} icon={<BarChart3 size={16} />}>History</NavItem>
              
              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleTheme}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <span className="mr-2">
                  {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                </span>
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
            
            {/* Mobile menu button and dark mode toggle */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className={`flex items-center justify-center h-8 w-8 rounded-full transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button 
                className={`text-gray-500 hover:text-gray-700 focus:outline-none ${isDarkMode ? 'text-gray-300 hover:text-white' : ''}`}
                onClick={() => setIsNavOpen(!isNavOpen)}
              >
                {isNavOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isNavOpen && (
            <div className={`md:hidden pt-2 pb-4 px-2 space-y-1 border-t ${isDarkMode ? 'border-gray-700' : 'border-blue-100'} mt-2 animate-in slide-in-from-top`}>
              <MobileNavItem onClick={scrollToForm} icon={<Plus size={16} />}>Add Transaction</MobileNavItem>
              <MobileNavItem onClick={scrollToBudget} icon={<DollarSign size={16} />}>Budget</MobileNavItem>
              <MobileNavItem onClick={scrollToAnalytics} icon={<PieChart size={16} />}>Analytics</MobileNavItem>
              <MobileNavItem onClick={scrollToHistory} icon={<BarChart3 size={16} />}>History</MobileNavItem>
            </div>
          )}
        </nav>
        
        <header className="py-12 bg-gradient-to-b from-white to-transparent">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-center text-gray-800 tracking-tight">
              Master Your <span className="text-blue-600">Finances</span>
            </h1>
            <p className="text-center text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
              Visualize your spending patterns, track expenses, and take control of your financial future
            </p>
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 rounded-full text-xs text-gray-600 border border-blue-100">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>All systems operational</span>
                <span className="px-1.5 ml-1 rounded bg-white text-blue-600 font-medium">v2.0</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 relative">
          <div className="w-full max-w-6xl space-y-12 relative z-10">
            {/* Transaction Form Section */}
            <section ref={formRef} className="scroll-mt-20">
              <div className={`rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'} shadow-lg p-6 border`}>
                <div className="mb-6">
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {transactionToEdit ? 'Edit Transaction' : 'Add New Transaction'}
                  </h2>
                  <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {transactionToEdit 
                      ? 'Update the details of your transaction' 
                      : 'Track your income and expenses by adding a new transaction'}
                  </p>
                </div>
                <TransactionForm 
                  onTransactionAdded={handleTransactionAdded}
                  transactionToEdit={transactionToEdit}
                  resetEditMode={resetEditMode}
                />
              </div>
            </section>
            
            {/* Budget Section */}
            <section ref={budgetRef} className="scroll-mt-20">
              <div className="mb-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Budget Management</h2>
                <div className="flex items-center mt-2">
                  <div className="flex space-x-2 items-center">
                    <select 
                      value={currentMonth}
                      onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300'
                      } border`}
                    >
                      {[
                        'January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'
                      ].map((month, index) => (
                        <option key={month} value={index}>{month}</option>
                      ))}
                    </select>
                    
                    <select 
                      value={currentYear}
                      onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300'
                      } border`}
                    >
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                <div className={`rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'} shadow-lg p-6 border`}>
                  <div className="mb-6">
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      Set Monthly Budget
                    </h3>
                    <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Define your spending limits for each category
                    </p>
                  </div>
                  <BudgetForm 
                    onBudgetAdded={refreshAllData}
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                    budgets={budgets}
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="transform transition-all duration-500 hover:translate-y-[-5px]">
                    <BudgetComparisonChart 
                      transactions={transactions} 
                      budgets={budgets}
                      month={currentMonth}
                      year={currentYear}
                    />
                  </div>
                  
                  <div className="transform transition-all duration-500 hover:translate-y-[-5px]">
                    <BudgetInsights 
                      transactions={transactions} 
                      budgets={budgets}
                      month={currentMonth}
                      year={currentYear}
                    />
                  </div>
                </div>
              </div>
            </section>
            
            {/* Dashboard Summary */}
            <DashboardSummary transactions={transactions} />
            
            {/* Analytics Section */}
            <section ref={analyticsRef} className="scroll-mt-20">
              <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Financial Analytics</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Monthly Chart */}
                <div className="transform transition-all duration-500 hover:translate-y-[-5px]">
                  <ExpensesChart transactions={transactions} />
                </div>
                
                {/* Category Pie Chart */}
                <div className="transform transition-all duration-500 hover:translate-y-[-5px]">
                  <CategoryPieChart transactions={transactions} />
                </div>
              </div>
            </section>
            
            {/* Transaction History Section */}
            <section ref={historyRef} className="scroll-mt-20">
              <div className={`rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'} shadow-lg p-6 border`}>
                <div className="mb-6 flex items-center">
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Transaction History</h2>
                  <div className={`ml-auto px-2.5 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 border-gray-600 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'} text-xs font-medium`}>
                    {transactions.length} Transactions
                  </div>
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-10 text-red-600 font-semibold bg-red-50 rounded-xl border border-red-100">
                    {error}
                  </div>
                ) : transactions.length === 0 ? (
                  // Welcome message when no transactions exist
                  <div className="text-center py-16">
                    <div className="mb-6">
                      <DollarSign size={48} className={`mx-auto ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    </div>
                    <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      Welcome to FinSight!
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                      Get started by adding your first transaction or load some demo data to explore the features.
                    </p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={seedDemoData}
                        disabled={isSeeding}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                          isDarkMode 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        } disabled:opacity-50`}
                      >
                        {isSeeding ? 'Loading Demo Data...' : 'Load Demo Data'}
                      </button>
                      <button
                        onClick={scrollToForm}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                          isDarkMode 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        Add First Transaction
                      </button>
                    </div>
                  </div>
                ) : (
                  // Show transaction list when transactions exist
                  <TransactionList
                    transactions={transactions}
                    onTransactionDeleted={fetchTransactions}
                    onEditTransaction={handleEditTransaction}
                  />
                )}
              </div>
            </section>
          </div>
        </main>
        
        <footer className={`py-8 text-center border-t ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-blue-100 bg-white'} mt-12`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
              <div className="mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} FinSight Pro &mdash; Empowering Your Financial Journey
              </div>
              <div className="flex space-x-6">
                <span className={`hover:${isDarkMode ? 'text-indigo-400' : 'text-blue-600'} cursor-pointer transition-colors`}>Privacy</span>
                <span className={`hover:${isDarkMode ? 'text-indigo-400' : 'text-blue-600'} cursor-pointer transition-colors`}>Terms</span>
                <span className={`hover:${isDarkMode ? 'text-indigo-400' : 'text-blue-600'} cursor-pointer transition-colors`}>Contact</span>
              </div>
            </div>
          </div>
        </footer>
        
        <Toaster />
      </div>
    </>
  );
}

// Navigation Components
function NavItem({ children, icon, active = false, onClick }) {
  const { isDarkMode } = useTheme();
  
  return (
    <button 
      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? isDarkMode ? 'bg-gray-700 text-white' : 'bg-blue-50 text-blue-700'
          : isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
      }`}
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      {children}
    </button>
  );
}

function MobileNavItem({ children, icon, active = false, onClick }) {
  const { isDarkMode } = useTheme();
  
  return (
    <button 
      className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? isDarkMode ? 'bg-gray-700 text-white' : 'bg-blue-50 text-blue-700'
          : isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
      }`}
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      {children}
    </button>
  );
}
