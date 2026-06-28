import React from 'react';

const SummaryCard = ({ title, value, icon: Icon, isCurrency = false, isIncome = false }) => {
  const displayValue = isCurrency 
    ? `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : value;

  const valueStyle = {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginTop: '8px',
    color: isCurrency ? (isIncome ? 'var(--credit-text)' : 'var(--debit-text)') : 'var(--text-main)'
  };

  return (
    <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </div>
        <div style={valueStyle}>
          {displayValue}
        </div>
      </div>
      {Icon && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: 'var(--bg-secondary)', 
          borderRadius: 'var(--radius-full)',
          color: 'var(--text-main)'
        }}>
          <Icon size={20} />
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
