import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Terminal } from 'lucide-react';

const StepTrace = ({ steps }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!steps || steps.length === 0) return null;

  return (
    <div style={{ marginTop: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '12px 16px', 
          backgroundColor: 'var(--bg-color)',
          borderBottom: isOpen ? '1px solid var(--border-color)' : 'none',
          color: 'var(--text-muted)'
        }}
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <Terminal size={16} />
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>How I thought about this ({steps.length} tool calls)</span>
      </button>

      {isOpen && (
        <div style={{ padding: '16px', backgroundColor: '#fafafa', fontSize: '0.875rem' }}>
          {steps.map((step, index) => (
            <div key={index} style={{ marginBottom: index !== steps.length - 1 ? '16px' : '0' }}>
              <div style={{ fontWeight: 600, color: 'var(--primary-blue)', marginBottom: '4px' }}>
                {index + 1}. Calling tool: <code style={{ backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', color: '#0f172a' }}>{step.tool}</code>
              </div>
              
              <div style={{ paddingLeft: '16px', borderLeft: '2px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Arguments:</div>
                <pre style={{ margin: 0, backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '4px', overflowX: 'auto', fontSize: '0.75rem', color: '#334155' }}>
                  {JSON.stringify(step.args, null, 2)}
                </pre>
                
                <div style={{ color: 'var(--text-muted)', marginTop: '8px', marginBottom: '4px' }}>Result:</div>
                <div style={{ backgroundColor: '#f8fafc', padding: '8px', borderRadius: '4px', fontSize: '0.75rem', color: '#475569', border: '1px solid #e2e8f0' }}>
                  {Array.isArray(step.result) 
                    ? `Returned ${step.result.length} items.`
                    : typeof step.result === 'object' 
                      ? `Returned data with keys: ${Object.keys(step.result).join(', ')}`
                      : String(step.result)
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepTrace;
