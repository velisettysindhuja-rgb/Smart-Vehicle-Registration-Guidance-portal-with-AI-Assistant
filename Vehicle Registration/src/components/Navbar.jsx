import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, LogOut, MessageSquare } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container nav-content">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">🚗</span>
          <span className="brand-text">Vehicle Portal</span>
        </Link>
        
        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="btn btn-outline nav-logout" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
