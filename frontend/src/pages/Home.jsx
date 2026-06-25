import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Upload, FileText, CheckCircle, AlertCircle, Loader, List } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import { uploadStatement } from '../utils/api';

const Home = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await uploadStatement(file);
      
      // Transform category breakdown for chart
      const chartData = Object.entries(data.category_breakdown || {}).map(([name, count]) => ({
        name,
        count
      })).sort((a, b) => b.count - a.count);

      setResult({
        ...data,
        chartData
      });
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.detail || err.message || 'An error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="layout-container">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--primary-blue)', marginBottom: '8px' }}>Statement Upload</h1>
        <p style={{ color: 'var(--text-muted)' }}>Upload your bank statement CSV to automatically categorize your transactions using AI.</p>
      </div>

      {!result && !loading && (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div 
            {...getRootProps()} 
            style={{
              border: `2px dashed ${isDragActive ? 'var(--primary-blue)' : 'var(--border-color)'}`,
              borderRadius: '8px',
              padding: '48px 24px',
              textAlign: 'center',
              backgroundColor: isDragActive ? 'rgba(24, 95, 165, 0.05)' : '#fafafa',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '24px'
            }}
          >
            <input {...getInputProps()} />
            <Upload size={48} color={isDragActive ? 'var(--primary-blue)' : 'var(--text-muted)'} style={{ margin: '0 auto 16px' }} />
            {file ? (
              <div>
                <FileText size={24} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary-blue)' }} />
                <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{file.name}</span>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '8px' }}>Drag & drop your CSV file here</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>or click to select file</p>
              </div>
            )}
          </div>

          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '12px 16px', borderRadius: '6px', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <button 
            className="btn-primary" 
            style={{ opacity: !file ? 0.5 : 1, width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            onClick={handleUpload}
            disabled={!file}
          >
            <Upload size={18} />
            Process Statement
          </button>
        </div>
      )}

      {loading && (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '64px 24px' }}>
          <Loader size={48} color="var(--primary-blue)" style={{ margin: '0 auto 24px', animation: 'spin 2s linear infinite' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Categorizing your transactions...</h2>
          <p style={{ color: 'var(--text-muted)' }}>Our AI is analyzing each transaction to assign accurate categories. This may take a moment.</p>
        </div>
      )}

      {result && (
        <div>
          <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '16px', borderRadius: '8px', color: '#047857', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <CheckCircle size={24} />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Processing Complete!</h3>
              <p style={{ margin: 0, opacity: 0.9 }}>Successfully imported and categorized your bank statement.</p>
            </div>
            <button onClick={reset} style={{ marginLeft: 'auto', backgroundColor: 'transparent', color: '#047857', textDecoration: 'underline', fontWeight: 600 }}>Upload another</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            <SummaryCard title="Total Transactions" value={result.total_transactions} icon={List} />
            <SummaryCard title="Total Spent" value={result.total_spent} icon={FileText} isCurrency={true} />
            <SummaryCard title="Total Income" value={result.total_income || 0} icon={CheckCircle} isCurrency={true} isIncome={true} />
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>Category Breakdown</h3>
            <div style={{ height: '400px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.chartData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="var(--primary-blue)" radius={[0, 4, 4, 0]} name="Transactions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
