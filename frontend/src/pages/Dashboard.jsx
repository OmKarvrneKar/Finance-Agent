import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { getAllTransactions } from '../utils/api';
import SummaryCard from '../components/SummaryCard';
import { List, ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';

const COLORS = ['#185FA5', '#047857', '#b45309', '#b91c1c', '#6d28d9', '#0369a1', '#a21caf', '#0f766e', '#be123c'];

const Dashboard = () => {
  const [data, setData] = useState({
    transactions: [],
    totalSpent: 0,
    totalIncome: 0,
    netSavings: 0,
    categoryData: [],
    topCategories: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllTransactions();
        const txs = response.transactions || [];
        
        let spent = 0;
        let income = 0;
        const categoryMap = {};

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        txs.forEach(tx => {
          if (tx.transaction_type === 'debit') {
            spent += tx.amount;
            
            // For pie chart: only current month debits
            const txDate = new Date(tx.date);
            if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
              const cat = tx.category || 'Other';
              categoryMap[cat] = (categoryMap[cat] || 0) + tx.amount;
            }
          } else if (tx.transaction_type === 'credit') {
            income += tx.amount;
          }
        });

        // Format for PieChart
        const categoryData = Object.entries(categoryMap)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

        // All time top 5 categories for BarChart
        const allTimeCatMap = {};
        txs.forEach(tx => {
          if (tx.transaction_type === 'debit') {
            const cat = tx.category || 'Other';
            allTimeCatMap[cat] = (allTimeCatMap[cat] || 0) + tx.amount;
          }
        });
        
        const topCategories = Object.entries(allTimeCatMap)
          .map(([name, amount]) => ({ name, amount }))
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5);

        setData({
          transactions: txs,
          totalSpent: spent,
          totalIncome: income,
          netSavings: income - spent,
          categoryData,
          topCategories
        });
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'white', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>{payload[0].name}</p>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>
            ₹{Number(payload[0].value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="layout-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="layout-container">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--primary-blue)', marginBottom: '8px' }}>Financial Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Overview of your spending habits and financial health.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <SummaryCard title="Total Spent" value={data.totalSpent} icon={ArrowDownCircle} isCurrency={true} />
        <SummaryCard title="Total Income" value={data.totalIncome} icon={ArrowUpCircle} isCurrency={true} isIncome={true} />
        <SummaryCard title="Net Savings" value={data.netSavings} icon={Wallet} isCurrency={true} isIncome={data.netSavings >= 0} />
        <SummaryCard title="Transactions" value={data.transactions.length} icon={List} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
        
        <div className="card">
          <h3 style={{ marginBottom: '8px', fontSize: '1.25rem' }}>Current Month Spending</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>Breakdown by category for the current calendar month.</p>
          
          {data.categoryData.length > 0 ? (
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No spending data for this month yet.
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '8px', fontSize: '1.25rem' }}>Top 5 Spending Categories</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>Highest expenses across all time.</p>
          
          {data.topCategories.length > 0 ? (
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topCategories} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis width={80} tick={{ fontSize: 12 }} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="amount" fill="var(--primary-blue)" radius={[4, 4, 0, 0]} name="Amount (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No transaction data available.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
