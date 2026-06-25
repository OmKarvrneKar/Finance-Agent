import React from 'react';
import { NavLink } from 'react-router-dom';
import { Wallet, Upload, List, MessageSquare, PieChart } from 'lucide-react';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Wallet className="logo-icon" size={28} />
          <span>Finance Agent</span>
        </div>
        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <Upload size={18} />
            <span>Upload</span>
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <List size={18} />
            <span>Transactions</span>
          </NavLink>
          <NavLink to="/ask" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <MessageSquare size={18} />
            <span>Ask AI</span>
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <PieChart size={18} />
            <span>Dashboard</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
