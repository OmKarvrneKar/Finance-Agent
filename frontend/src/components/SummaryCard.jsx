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
    <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {title}
        </div>
        <div style={valueStyle}>
          {displayValue}
        </div>
      </div>
      {Icon && (
        <div style={{ 
          padding: '12px', 
          backgroundColor: 'var(--bg-color)', 
          borderRadius: '50%',
          color: 'var(--primary-blue)'
        }}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
