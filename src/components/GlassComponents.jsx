import React from 'react';
import { TrendingUp, TrendingDown, Calendar, CreditCard, Wallet } from 'lucide-react';

// Stat Card Component
export function GlassStatCard({ icon, label, amount, trend, color = 'dusty-rose' }) {
  const colorClasses = {
    'dusty-rose': 'from-dusty-rose/20 to-blush/10 border-dusty-rose/30',
    'wine': 'from-wine/20 to-muted-mauve/10 border-wine/30',
    'blush': 'from-blush/30 to-dusty-rose/10 border-blush/40',
    'green': 'from-green-100/30 to-green-50/10 border-green-200/40',
    'red': 'from-red-100/30 to-red-50/10 border-red-200/40'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-xl rounded-2xl p-6 border shadow-glass hover:shadow-float transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-white/50 rounded-xl shadow-inner-glass">
          <span className="text-2xl">{icon}</span>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
            trend > 0 ? 'bg-green-100/50 text-green-700' : 'bg-red-100/50 text-red-700'
          }`}>
            {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-sm font-semibold text-wine/70 mb-1">{label}</p>
      <p className="text-3xl font-bold text-wine">{amount}</p>
    </div>
  );
}

// Payment Method Card
export function PaymentMethodCard({ method, bank, amount, percentage, transactions }) {
  const getMethodIcon = (method) => {
    switch(method) {
      case 'cash': return '💵';
      case 'debit': return '💳';
      case 'credit': return '💳';
      case 'ewallet': return '📱';
      default: return '💰';
    }
  };

  const getBankEmoji = (bank) => {
    const bankEmojis = {
      'GCash': '💙',
      'Maya (PayMaya)': '💚',
      'ShopeePay': '🟠',
      'GrabPay': '🚕',
      'PalawanPay': '🔵',
      'PayPal': '💙',
      'Coins.ph': '🪙',
      'Paymongo': '💎',
      'UnionBank': '🏦',
      'BDO': '🏦',
      'BPI': '🏦',
      'Metrobank': '🏦',
    };
    return bankEmojis[bank] || '🏦';
  };

  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-glass hover:shadow-float transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-rose rounded-xl flex items-center justify-center shadow-inner-glass">
            <span className="text-2xl">{getMethodIcon(method)}</span>
          </div>
          <div>
            <p className="font-bold text-wine">{method === 'ewallet' ? bank : method.toUpperCase()}</p>
            {method === 'ewallet' && (
              <p className="text-xs text-wine/60 flex items-center gap-1">
                {getBankEmoji(bank)} E-Wallet
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-wine">{amount}</p>
          <p className="text-xs text-wine/60">{percentage}%</p>
        </div>
      </div>
      <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-rose rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-wine/70 mt-2 flex items-center gap-1">
        <span>📊</span> {transactions} transactions
      </p>
    </div>
  );
}

// Transaction Card
export function TransactionCard({ transaction, onDelete }) {
  const getTypeColor = (type) => {
    switch(type) {
      case 'income': return 'bg-green-100/50 text-green-700 border-green-200/60';
      case 'expense': return 'bg-red-100/50 text-red-700 border-red-200/60';
      case 'savings': return 'bg-blue-100/50 text-blue-700 border-blue-200/60';
      case 'savings-withdrawal': return 'bg-orange-100/50 text-orange-700 border-orange-200/60';
      default: return 'bg-gray-100/50 text-gray-700 border-gray-200/60';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'income': return '💰';
      case 'expense': return '💸';
      case 'savings': return '🐷';
      case 'savings-withdrawal': return '📤';
      default: return '💵';
    }
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      'Food': '🍔', 'Transportation': '🚗', 'Shopping': '🛒',
      'Bills': '📄', 'Entertainment': '🎬', 'Health': '💊',
      'Education': '📚', 'Salary': '💰', 'Business': '💼',
      'Investment': '📈', 'Gift': '🎁', 'Other': '📝'
    };
    return emojis[category] || '📝';
  };

  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-glass hover:shadow-float transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 bg-gradient-rose rounded-xl flex items-center justify-center shadow-inner-glass">
            <span className="text-2xl">{getCategoryEmoji(transaction.category)}</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-wine flex items-center gap-2">
              {transaction.category}
              <span className={`text-xs px-2 py-1 rounded-lg border backdrop-blur-sm ${getTypeColor(transaction.type)}`}>
                {getTypeIcon(transaction.type)} {transaction.type.replace('-', ' ')}
              </span>
            </p>
            {transaction.description && (
              <p className="text-sm text-wine/70 mt-1">{transaction.description}</p>
            )}
            <div className="flex items-center gap-3 mt-2 text-xs text-wine/60">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              {transaction.paymentMethod && (
                <span className="flex items-center gap-1">
                  {transaction.paymentMethod === 'cash' && '💵 Cash'}
                  {transaction.paymentMethod === 'debit' && '💳 Debit'}
                  {transaction.paymentMethod === 'credit' && '💳 Credit'}
                  {transaction.paymentMethod === 'ewallet' && `📱 ${transaction.bankName}`}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${
            transaction.type === 'income' ? 'text-green-600' : 
            transaction.type === 'expense' ? 'text-red-600' : 
            'text-blue-600'
          }`}>
            {transaction.type === 'expense' || transaction.type === 'savings-withdrawal' ? '-' : '+'}
            ₱{transaction.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
          </p>
          {onDelete && (
            <button
              onClick={() => onDelete(transaction.id)}
              className="mt-2 text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Category Badge
export function CategoryBadge({ category, amount, color = 'dusty-rose' }) {
  const colorClasses = {
    'dusty-rose': 'bg-dusty-rose/20 text-wine border-dusty-rose/30',
    'blush': 'bg-blush/30 text-wine border-blush/40',
    'mauve': 'bg-muted-mauve/20 text-wine border-muted-mauve/30',
  };

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border backdrop-blur-sm ${colorClasses[color]} shadow-glass`}>
      <span className="font-semibold">{category}</span>
      <span className="text-sm opacity-80">{amount}</span>
    </div>
  );
}

// Premium Badge
export function PremiumBadge({ isPremium, expiresAt }) {
  if (!isPremium) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100/50 text-gray-700 border border-gray-200/60 backdrop-blur-sm shadow-glass">
        <span>🆓</span>
        <span className="font-semibold">Free Trial</span>
      </div>
    );
  }

  const daysLeft = Math.ceil((new Date(expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-rose text-wine border border-white/40 backdrop-blur-sm shadow-glass">
      <span>💎</span>
      <span className="font-bold">Premium</span>
      <span className="text-sm opacity-80">• {daysLeft} days left</span>
    </div>
  );
}

// Empty State
export function EmptyState({ icon, title, message, action }) {
  return (
    <div className="text-center py-16 px-6">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-rose rounded-3xl shadow-float mb-6 animate-float">
        <span className="text-6xl">{icon}</span>
      </div>
      <h3 className="text-2xl font-bold text-wine mb-3">{title}</h3>
      <p className="text-wine/70 mb-6 max-w-md mx-auto">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-gradient-rose text-wine rounded-2xl font-bold hover:shadow-float transition-all shadow-glass border border-white/40"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// Loading Spinner
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blush/30 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-dusty-rose border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
