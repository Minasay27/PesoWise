import React, { useState, useEffect } from 'react';
import { PlusCircle, DollarSign, CreditCard, Wallet, TrendingUp, TrendingDown, PiggyBank, Building2, Scale, AlertCircle, Calendar, LogOut, User } from 'lucide-react';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    paymentMethod: 'cash',
    description: '',
    date: new Date().toISOString().split('T')[0],
    accountingType: 'none',
    bankName: '',
    isInstallment: false,
    installmentMonths: 1,
    statementDate: ''
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setEmail(userData.email);
      setShowLogin(false);
      
      const savedTransactions = localStorage.getItem(`transactions_${userData.email}`);
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (user && transactions.length >= 0) {
      localStorage.setItem(`transactions_${user.email}`, JSON.stringify(transactions));
    }
  }, [transactions, user]);

  const handleLogin = () => {
    if (!email || !email.includes('@gmail.com')) {
      alert('Please enter a valid Gmail address');
      return;
    }
    
    const userData = { email, loginDate: new Date().toISOString() };
    localStorage.setItem('current_user', JSON.stringify(userData));
    setUser(userData);
    setShowLogin(false);
    
    const savedTransactions = localStorage.getItem(`transactions_${email}`);
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('current_user');
    setUser(null);
    setTransactions([]);
    setShowLogin(true);
    setEmail('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;

    const baseTransaction = {
      id: Date.now(),
      ...formData,
      amount: parseFloat(formData.amount)
    };

    // Handle installment transactions
    if (formData.paymentMethod === 'credit' && formData.isInstallment && formData.installmentMonths > 1) {
      const monthlyAmount = parseFloat(formData.amount) / parseInt(formData.installmentMonths);
      const newTransactions = [];
      
      for (let i = 0; i < parseInt(formData.installmentMonths); i++) {
        const installmentDate = new Date(formData.date);
        installmentDate.setMonth(installmentDate.getMonth() + i);
        
        newTransactions.push({
          ...baseTransaction,
          id: Date.now() + i,
          amount: monthlyAmount,
          date: installmentDate.toISOString().split('T')[0],
          description: `${formData.description} (Installment ${i + 1}/${formData.installmentMonths})`,
          installmentInfo: {
            isInstallment: true,
            currentMonth: i + 1,
            totalMonths: parseInt(formData.installmentMonths),
            originalAmount: parseFloat(formData.amount)
          }
        });
      }
      
      setTransactions([...newTransactions, ...transactions]);
    } else {
      setTransactions([baseTransaction, ...transactions]);
    }

    setFormData({
      type: 'expense',
      category: '',
      amount: '',
      paymentMethod: 'cash',
      description: '',
      date: new Date().toISOString().split('T')[0],
      accountingType: 'none',
      bankName: '',
      isInstallment: false,
      installmentMonths: 1,
      statementDate: ''
    });
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setTransactions([]);
      if (user) {
        localStorage.removeItem(`transactions_${user.email}`);
      }
    }
  };

  // Filter transactions by selected month
  const monthlyTransactions = transactions.filter(t => {
    return t.date.startsWith(selectedMonth);
  });

  // Philippine Banks
  const philippineBanks = [
    'UnionBank',
    'BDO (Banco de Oro)',
    'BPI (Bank of the Philippine Islands)',
    'RCBC (Rizal Commercial Banking Corporation)',
    'EastWest Bank',
    'Metrobank',
    'Security Bank',
    'PNB (Philippine National Bank)',
    'Landbank',
    'China Bank',
    'UCPB (United Coconut Planters Bank)',
    'Maybank',
    'HSBC Philippines',
    'Citibank Philippines'
  ];

  // ALL-TIME CALCULATIONS
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSavings = transactions
    .filter(t => t.type === 'savings')
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsWithdrawals = transactions
    .filter(t => t.type === 'savings-withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalSavings - savingsWithdrawals;

  const cashExpenses = transactions
    .filter(t => t.type === 'expense' && t.paymentMethod === 'cash')
    .reduce((sum, t) => sum + t.amount, 0);

  const debitExpenses = transactions
    .filter(t => t.type === 'expense' && t.paymentMethod === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const creditExpenses = transactions
    .filter(t => t.type === 'expense' && t.paymentMethod === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses - totalSavings + savingsWithdrawals;

  // MONTHLY CALCULATIONS
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlySavings = monthlyTransactions
    .filter(t => t.type === 'savings')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlySavingsWithdrawals = monthlyTransactions
    .filter(t => t.type === 'savings-withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyBalance = monthlyIncome - monthlyExpenses - monthlySavings + monthlySavingsWithdrawals;

  // Calculate Assets, Liabilities, and Equity
  const totalAssets = transactions
    .filter(t => t.accountingType === 'asset')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalLiabilities = transactions
    .filter(t => t.accountingType === 'liability')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalEquity = totalAssets - totalLiabilities;

  // DEBT PAYABLE CALCULATIONS
  const debtPayable = transactions
    .filter(t => t.type === 'expense' && t.paymentMethod === 'credit')
    .reduce((sum, t) => {
      if (t.installmentInfo) {
        const remainingMonths = t.installmentInfo.totalMonths - t.installmentInfo.currentMonth + 1;
        return sum + (t.amount * remainingMonths);
      }
      return sum + t.amount;
    }, 0);

  // Credit card breakdown by bank
  const creditByBank = transactions
    .filter(t => t.type === 'expense' && t.paymentMethod === 'credit' && t.bankName)
    .reduce((acc, t) => {
      if (!acc[t.bankName]) {
        acc[t.bankName] = 0;
      }
      acc[t.bankName] += t.amount;
      return acc;
    }, {});

  // Group expenses by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {showLogin ? (
        // LOGIN SCREEN
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <DollarSign className="text-blue-600" size={48} />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Expense Tracker</h1>
              <p className="text-gray-600">Sign in with your Gmail to get started</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gmail Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
              
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            </div>
            
            <p className="text-xs text-gray-500 text-center mt-6">
              Your data is stored securely in your browser
            </p>
          </div>
        </div>
      ) : (
        // MAIN APP
      <div className="max-w-7xl mx-auto">
        {/* Header with user info */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              💰 Expense Tracker
            </h1>
            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
              <User size={16} />
              {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Month Selector */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            <Calendar className="text-blue-600" size={24} />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Month
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Monthly Balance</p>
              <p className={`text-2xl font-bold ${monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₱{monthlyBalance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium">Total Income</p>
                <p className="text-2xl font-bold text-green-600">₱{totalIncome.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Month: ₱{monthlyIncome.toFixed(2)}</p>
              </div>
              <TrendingUp className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">₱{totalExpenses.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Month: ₱{monthlyExpenses.toFixed(2)}</p>
              </div>
              <TrendingDown className="text-red-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium">Net Savings</p>
                <p className="text-2xl font-bold text-purple-600">₱{netSavings.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">In: ₱{totalSavings.toFixed(2)} | Out: ₱{savingsWithdrawals.toFixed(2)}</p>
              </div>
              <PiggyBank className="text-purple-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium">Debt Payable</p>
                <p className="text-2xl font-bold text-orange-600">₱{debtPayable.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Credit card debts</p>
              </div>
              <AlertCircle className="text-orange-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium">Balance</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  ₱{balance.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Month: ₱{monthlyBalance.toFixed(2)}</p>
              </div>
              <DollarSign className="text-blue-500" size={32} />
            </div>
          </div>
        </div>

        {/* Payment Method Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="text-green-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Cash Expenses</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">₱{cashExpenses.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="text-purple-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Debit Card Expenses</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">₱{debitExpenses.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Credit Card Expenses</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">₱{creditExpenses.toFixed(2)}</p>
          </div>
        </div>

        {/* Credit Card Breakdown by Bank */}
        {Object.keys(creditByBank).length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Credit Card Expenses by Bank</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(creditByBank).map(([bank, amount]) => (
                <div key={bank} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-gray-700 font-medium">{bank}</p>
                  <p className="text-xl font-bold text-blue-600">₱{amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accounting Dashboard: Assets, Liabilities, Equity */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Building2 size={28} />
            Financial Position (Accounting Overview)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-6 border border-white border-opacity-30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-white" size={24} />
                <h3 className="text-white font-semibold text-lg">Assets</h3>
              </div>
              <p className="text-4xl font-bold text-white">₱{totalAssets.toFixed(2)}</p>
              <p className="text-white text-opacity-80 text-sm mt-2">What you own</p>
            </div>

            <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-6 border border-white border-opacity-30">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-white" size={24} />
                <h3 className="text-white font-semibold text-lg">Liabilities</h3>
              </div>
              <p className="text-4xl font-bold text-white">₱{totalLiabilities.toFixed(2)}</p>
              <p className="text-white text-opacity-80 text-sm mt-2">What you owe</p>
            </div>

            <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-6 border border-white border-opacity-30">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="text-white" size={24} />
                <h3 className="text-white font-semibold text-lg">Equity</h3>
              </div>
              <p className={`text-4xl font-bold ${totalEquity >= 0 ? 'text-white' : 'text-red-200'}`}>
                ₱{totalEquity.toFixed(2)}
              </p>
              <p className="text-white text-opacity-80 text-sm mt-2">Net worth (Assets - Liabilities)</p>
            </div>
          </div>
          <div className="mt-4 bg-white bg-opacity-10 rounded-lg p-4 border border-white border-opacity-20">
            <p className="text-white text-sm">
              <span className="font-semibold">Accounting Equation:</span> Assets (₱{totalAssets.toFixed(2)}) = Liabilities (₱{totalLiabilities.toFixed(2)}) + Equity (₱{totalEquity.toFixed(2)})
            </p>
          </div>
        </div>

        {/* Category Breakdown */}
        {Object.keys(expensesByCategory).length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Expenses by Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <div key={category} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 capitalize">{category}</p>
                  <p className="text-xl font-bold text-gray-800">₱{amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Transaction Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Transaction</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="income">💵 Income (Money In)</option>
                  <option value="expense">💸 Expense (Money Out)</option>
                  <option value="savings">🐷 Savings (Money Into Savings)</option>
                  <option value="savings-withdrawal">💰 Savings Withdrawal (Money Out from Savings)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Food, Salary, Emergency Fund"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₱)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {(formData.type === 'expense' || formData.type === 'savings-withdrawal') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="cash">💵 Cash</option>
                    <option value="debit">💳 Debit Card</option>
                    <option value="credit">💳 Credit Card</option>
                  </select>
                </div>
              )}

              {(formData.type === 'expense' || formData.type === 'savings-withdrawal') && formData.paymentMethod === 'credit' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank / Credit Card
                    </label>
                    <select
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Bank</option>
                      {philippineBanks.map(bank => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statement Date (Billing Cycle)
                    </label>
                    <input
                      type="date"
                      value={formData.statementDate}
                      onChange={(e) => setFormData({ ...formData, statementDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">40-day cycle from purchase date</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="installment"
                      checked={formData.isInstallment}
                      onChange={(e) => setFormData({ ...formData, isInstallment: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="installment" className="text-sm font-medium text-gray-700">
                      Installment Payment
                    </label>
                  </div>

                  {formData.isInstallment && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Months
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="36"
                        value={formData.installmentMonths}
                        onChange={(e) => setFormData({ ...formData, installmentMonths: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Monthly: ₱{(parseFloat(formData.amount || 0) / parseInt(formData.installmentMonths || 1)).toFixed(2)}
                      </p>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accounting Type
                </label>
                <select
                  value={formData.accountingType}
                  onChange={(e) => setFormData({ ...formData, accountingType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="none">None</option>
                  <option value="asset">📈 Asset (What you own)</option>
                  <option value="liability">⚠️ Liability (What you owe)</option>
                </select>
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add notes..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <PlusCircle size={20} />
              Add Transaction
            </button>
          </form>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Transaction History - {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            {transactions.length > 0 && (
              <button
                onClick={clearAllData}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                Clear All Data
              </button>
            )}
          </div>

          {monthlyTransactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No transactions for this month. Add your first one above!</p>
          ) : (
            <div className="space-y-3">
              {monthlyTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {transaction.type === 'income' ? '💵' : 
                         transaction.type === 'savings' ? '🐷' : 
                         transaction.type === 'savings-withdrawal' ? '💰' : '💸'}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-800 capitalize">{transaction.category}</p>
                        <p className="text-sm text-gray-600">
                          {transaction.date} 
                          {(transaction.type === 'expense' || transaction.type === 'savings-withdrawal') && 
                            ` • ${transaction.paymentMethod === 'cash' ? '💵 Cash' : 
                                  transaction.paymentMethod === 'debit' ? '💳 Debit' : '💳 Credit'}`
                          }
                          {transaction.bankName && ` • ${transaction.bankName}`}
                          {transaction.accountingType && transaction.accountingType !== 'none' && 
                            ` • ${transaction.accountingType === 'asset' ? '📈 Asset' : '⚠️ Liability'}`
                          }
                        </p>
                        {transaction.installmentInfo && (
                          <p className="text-xs text-blue-600 font-medium mt-1">
                            📅 Installment {transaction.installmentInfo.currentMonth}/{transaction.installmentInfo.totalMonths} 
                            (Total: ₱{transaction.installmentInfo.originalAmount.toFixed(2)})
                          </p>
                        )}
                        {transaction.description && (
                          <p className="text-sm text-gray-500 italic">{transaction.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`text-xl font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 
                      transaction.type === 'savings' ? 'text-purple-600' : 
                      'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₱{transaction.amount.toFixed(2)}
                    </p>
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
