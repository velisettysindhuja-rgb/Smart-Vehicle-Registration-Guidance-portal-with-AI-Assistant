import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Repeat, 
  IndianRupee, 
  Car,
  Database,
  Bot, 
  User, 
  LogOut
} from 'lucide-react';
import SynvoraLogo from './SynvoraLogo';
import ThemeToggle from './ThemeToggle';
import './Sidebar.css';

const Sidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem('auth');
    window.location.href = '/login';
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'New Registration', path: '/service/registration', icon: <FileText size={20} /> },
    { name: 'Ownership Transfer', path: '/service/transfer', icon: <Repeat size={20} /> },
    { name: 'Road Tax Payment', path: '/tax-payment', icon: <IndianRupee size={20} /> },
    { name: 'Road Tax Status', path: '/tax-status', icon: <Car size={20} /> },
    { name: 'AI Assistant', path: '/ai-assistant', icon: <Bot size={20} /> },
    { name: 'Direct Entry', path: '/admin/add-vehicle', icon: <Database size={20} /> },
  ];

  return (
    <div className="sidebar glass-panel">
      <div className="sidebar-header" style={{ padding: '1.5rem 1rem 1rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <SynvoraLogo width="170" height="auto" />
        <div style={{ position: 'absolute', right: '0.5rem', top: '1.5rem' }}>
          <ThemeToggle />
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
          >
            <span className="icon-wrapper">{item.icon}</span>
            <span className="link-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-link logout-btn" onClick={handleLogout}>
          <span className="icon-wrapper"><LogOut size={20} /></span>
          <span className="link-text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
