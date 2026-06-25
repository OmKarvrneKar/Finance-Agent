import React from 'react';
import CategoryBadge from './CategoryBadge';
import { Repeat } from 'lucide-react';

const TransactionRow = ({ transaction }) => {
  const isDebit = transaction.transaction_type === 'debit';
  const amountClass = isDebit ? 'amount-debit' : 'amount-credit';
  const amountPrefix = isDebit ? '-' : '+';

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <tr>
      <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
        {formatDate(transaction.date)}
      </td>
      <td>
        <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>
          {transaction.description}
        </div>
        {transaction.subcategory && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {transaction.subcategory}
          </div>
        )}
      </td>
      <td className={amountClass} style={{ fontWeight: 600, textAlign: 'right', whiteSpace: 'nowrap' }}>
        {amountPrefix}₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            fontWeight: '600',
            backgroundColor: isDebit ? 'var(--debit-bg)' : 'var(--credit-bg)',
            color: isDebit ? 'var(--debit-text)' : 'var(--credit-text)'
          }}>
            {transaction.transaction_type}
          </span>
        </div>
      </td>
      <td>
        <CategoryBadge category={transaction.category} />
      </td>
      <td style={{ textAlign: 'center' }}>
        {transaction.is_recurring ? (
          <div title="Recurring Transaction" style={{ color: 'var(--primary-blue)', display: 'flex', justifyContent: 'center' }}>
            <Repeat size={16} />
          </div>
        ) : (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>-</span>
        )}
      </td>
    </tr>
  );
};

export default TransactionRow;
