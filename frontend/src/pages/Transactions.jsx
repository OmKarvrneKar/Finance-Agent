import React, { useState, useEffect } from 'react';
import { getTransactions } from '../utils/api';
import TransactionRow from '../components/TransactionRow';
import { Filter, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  '', 'Food & Dining', 'Groceries', 'Shopping', 'Transport', 
  'Bills & Utilities', 'Subscriptions', 'Entertainment', 
  'Healthcare', 'Transfers', 'Salary/Income', 'ATM/Cash', 'Other'
];

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
  // Pagination and filtering states
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  
  const limit = 10;

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getTransactions(page, limit, category, type);
      setTransactions(data.transactions || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, category, type]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="layout-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-description">View and filter all your categorized transactions.</p>
        </div>
        <button onClick={fetchTransactions} className="btn-secondary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <Filter size={18} />
            <span style={{ fontWeight: 500 }}>Filters:</span>
          </div>
          
          <select 
            value={category} 
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.filter(c => c).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div style={{ display: 'flex', backgroundColor: 'var(--bg-color)', borderRadius: '6px', padding: '4px', border: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => { setType(''); setPage(1); }}
              style={{ padding: '4px 16px', backgroundColor: type === '' ? 'white' : 'transparent', boxShadow: type === '' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', color: type === '' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: type === '' ? 600 : 400 }}
            >
              All
            </button>
            <button 
              onClick={() => { setType('debit'); setPage(1); }}
              style={{ padding: '4px 16px', backgroundColor: type === 'debit' ? 'white' : 'transparent', boxShadow: type === 'debit' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', color: type === 'debit' ? 'var(--debit-text)' : 'var(--text-muted)', fontWeight: type === 'debit' ? 600 : 400 }}
            >
              Debits
            </button>
            <button 
              onClick={() => { setType('credit'); setPage(1); }}
              style={{ padding: '4px 16px', backgroundColor: type === 'credit' ? 'white' : 'transparent', boxShadow: type === 'credit' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', color: type === 'credit' ? 'var(--credit-text)' : 'var(--text-muted)', fontWeight: type === 'credit' ? 600 : 400 }}
            >
              Credits
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Description</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, textAlign: 'center' }}>Recurring</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading transactions...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>No transactions found matching your filters.</td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <TransactionRow key={tx.id} transaction={tx} />
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {!loading && total > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid var(--border-color)', backgroundColor: '#fafafa' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Showing <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{Math.min((page - 1) * limit + 1, total)}</span> to <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{Math.min(page * limit, total)}</span> of <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{total}</span> results
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', border: '1px solid var(--border-color)', backgroundColor: page === 1 ? '#f1f5f9' : 'white', color: page === 1 ? '#94a3b8' : 'var(--text-main)', opacity: page === 1 ? 0.5 : 1 }}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', border: '1px solid var(--border-color)', backgroundColor: page >= totalPages ? '#f1f5f9' : 'white', color: page >= totalPages ? '#94a3b8' : 'var(--text-main)', opacity: page >= totalPages ? 0.5 : 1 }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
