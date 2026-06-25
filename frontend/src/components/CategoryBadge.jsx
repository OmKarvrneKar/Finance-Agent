import React from 'react';

const CategoryBadge = ({ category }) => {
  if (!category) return null;

  // Generate a consistent color based on category string
  const getCategoryColor = (cat) => {
    const colors = [
      { bg: '#eef2ff', text: '#4338ca' }, // Indigo
      { bg: '#ecfdf5', text: '#047857' }, // Emerald
      { bg: '#fffbeb', text: '#b45309' }, // Amber
      { bg: '#fef2f2', text: '#b91c1c' }, // Red
      { bg: '#f5f3ff', text: '#6d28d9' }, // Violet
      { bg: '#f0f9ff', text: '#0369a1' }, // Sky
      { bg: '#fdf4ff', text: '#a21caf' }, // Fuchsia
      { bg: '#ecfeff', text: '#0f766e' }, // Cyan
      { bg: '#fff1f2', text: '#be123c' }, // Rose
    ];
    
    // Simple hash function for consistent color assignment
    let hash = 0;
    for (let i = 0; i < cat.length; i++) {
      hash = cat.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const style = getCategoryColor(category);

  return (
    <span style={{
      backgroundColor: style.bg,
      color: style.text,
      padding: '4px 10px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '600',
      display: 'inline-block',
      whiteSpace: 'nowrap'
    }}>
      {category}
    </span>
  );
};

export default CategoryBadge;
