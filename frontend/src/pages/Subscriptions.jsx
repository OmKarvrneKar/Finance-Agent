import React, { useState, useEffect } from 'react';
import { fetchSubscriptions } from '../utils/api';
import CategoryBadge from '../components/CategoryBadge';
import { Repeat, Calendar, DollarSign, Activity } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const data = await fetchSubscriptions();
        setSubscriptions(data || []);
      } catch (err) {
        console.error('Failed to load subscriptions', err);
      } finally {
        setLoading(false);
      }
    };
    loadSubscriptions();
  }, []);

  const totalMonthlyCost = subscriptions.reduce((sum, sub) => sum + (sub.estimated_monthly_cost || 0), 0);
  const totalAnnualCost = subscriptions.reduce((sum, sub) => sum + (sub.estimated_annual_cost || 0), 0);

  return (
    <div className="layout-container">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--primary-blue)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Repeat size={28} /> Subscriptions & Recurring
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Automatically detected recurring expenses and their estimated costs.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <SummaryCard title="Total Monthly Cost" value={totalMonthlyCost} icon={DollarSign} isCurrency={true} />
        <SummaryCard title="Total Annual Cost" value={totalAnnualCost} icon={Calendar} isCurrency={true} />
        <SummaryCard title="Active Subscriptions" value={subscriptions.length} icon={Activity} />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>Loading subscriptions...</div>
      ) : subscriptions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '64px 24px', backgroundColor: '#fafafa' }}>
          <Repeat size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No recurring subscriptions detected yet.</h2>
          <p style={{ color: 'var(--text-muted)' }}>Upload more months of bank statements to improve detection accuracy.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {subscriptions.map((sub, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 600 }}>{sub.description}</h3>
                <CategoryBadge category={sub.category} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: '#fafafa', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Frequency</div>
                  <div style={{ fontWeight: 500 }}>{sub.frequency}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg Charge</div>
                  <div style={{ fontWeight: 500 }}>₹{sub.average_amount.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Est. Monthly</div>
                  <div style={{ fontWeight: 600, color: 'var(--debit-text)' }}>₹{sub.estimated_monthly_cost.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Est. Annual</div>
                  <div style={{ fontWeight: 600, color: 'var(--debit-text)' }}>₹{sub.estimated_annual_cost.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Last seen: {new Date(sub.last_seen).toLocaleDateString()}</span>
                <span>Detected {sub.occurrences} times</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
