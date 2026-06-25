import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader } from 'lucide-react';
import { askAgent } from '../utils/api';
import StepTrace from '../components/StepTrace';

const SUGGESTED_QUESTIONS = [
  "How much did I spend this month?",
  "What are my top spending categories?",
  "Show me all my subscriptions",
  "What's my savings rate this month?"
];

const AskAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await askAgent(text);
      const aiMessage = { 
        role: 'assistant', 
        content: response.answer,
        steps: response.steps || []
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Agent error:', error);
      const errorMessage = { 
        role: 'system', 
        content: `Error: ${error.response?.data?.detail || error.message || 'Failed to get a response from the AI agent.'}`
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="layout-container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', paddingBottom: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--primary-blue)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Sparkles size={28} /> Ask AI Finance Agent
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Ask questions about your spending, income, or transaction history in plain English.</p>
      </div>

      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        
        {/* Chat Messages Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: '#fafafa' }}>
          
          {messages.length === 0 && (
            <div style={{ margin: 'auto', textAlign: 'center', maxWidth: '600px' }}>
              <div style={{ backgroundColor: 'var(--card-bg)', padding: '32px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Bot size={48} color="var(--primary-blue)" style={{ margin: '0 auto 16px' }} />
                <h2 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Hello! I'm your AI Finance Agent.</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
                  I can analyze your transactions, compare spending across months, and find subscriptions. Try asking one of the questions below.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSend(q)}
                      style={{ padding: '8px 16px', backgroundColor: '#eef2ff', color: 'var(--primary-blue)', border: '1px solid #c7d2fe', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.2s ease' }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              width: '100%'
            }}>
              <div style={{ 
                maxWidth: '80%', 
                display: 'flex', 
                gap: '12px',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
              }}>
                <div style={{ 
                  width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: msg.role === 'user' ? '#e2e8f0' : msg.role === 'system' ? '#fecaca' : '#dbeafe',
                  color: msg.role === 'user' ? '#475569' : msg.role === 'system' ? '#dc2626' : 'var(--primary-blue)'
                }}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                
                <div style={{ 
                  backgroundColor: msg.role === 'user' ? 'var(--primary-blue)' : msg.role === 'system' ? '#fef2f2' : 'var(--card-bg)',
                  color: msg.role === 'user' ? 'white' : msg.role === 'system' ? '#b91c1c' : 'var(--text-main)',
                  padding: '16px', 
                  borderRadius: '12px',
                  border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  lineHeight: 1.5,
                  borderTopRightRadius: msg.role === 'user' ? '4px' : '12px',
                  borderTopLeftRadius: msg.role !== 'user' ? '4px' : '12px'
                }}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                  
                  {msg.steps && msg.steps.length > 0 && (
                    <StepTrace steps={msg.steps} />
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#dbeafe', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={20} />
                </div>
                <div style={{ backgroundColor: 'var(--card-bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Loader size={18} color="var(--primary-blue)" style={{ animation: 'spin 2s linear infinite' }} />
                  <span style={{ color: 'var(--text-muted)' }}>Analyzing database...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '16px 24px', backgroundColor: 'var(--card-bg)', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask anything about your spending..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '16px',
                paddingRight: '56px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                outline: 'none',
                resize: 'none',
                height: '56px',
                fontFamily: 'inherit',
                fontSize: '1rem',
                backgroundColor: '#fafafa',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              style={{
                position: 'absolute',
                right: '8px',
                top: '8px',
                width: '40px',
                height: '40px',
                borderRadius: '6px',
                backgroundColor: input.trim() && !loading ? 'var(--primary-blue)' : '#e2e8f0',
                color: input.trim() && !loading ? 'white' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <Send size={18} style={{ marginLeft: '2px' }} />
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            The AI queries your local SQLite database directly.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskAI;
