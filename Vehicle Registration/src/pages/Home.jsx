import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Repeat, CheckCircle2, Shield, Clock, Zap, Bot, MessageSquare } from 'lucide-react';
import Card from '../components/Card';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container animate-fade-in">
      <div className="container">
        
        {/* Welcome Section */}
        <section className="welcome-section text-center">
          <h1 className="welcome-title">Welcome, {localStorage.getItem('username') || 'User'}!</h1>
          <p className="welcome-subtitle text-muted">Select a service to continue</p>
        </section>

        {/* Main Section */}
        <section className="services-grid">
          <Card 
            hoverable 
            className="service-card"
            onClick={() => navigate('/service/registration')}
          >
            <div className="service-icon-wrapper blue">
              <FileText size={32} />
            </div>
            <h3 className="service-title">New Vehicle Registration</h3>
            <p className="service-desc text-muted">Click to view documents & process</p>
          </Card>

          <Card 
            hoverable 
            className="service-card"
            onClick={() => navigate('/service/transfer')}
          >
            <div className="service-icon-wrapper green">
              <Repeat size={32} />
            </div>
            <h3 className="service-title">Ownership Transfer</h3>
            <p className="service-desc text-muted">Click to transfer vehicle ownership</p>
          </Card>
        </section>

        {/* Below Section */}
        <section className="features-section glass-section">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2 className="section-title text-glow">Why use this portal?</h2>
            <div className="title-underline neon-underline"></div>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><CheckCircle2 size={28} /></div>
              <h4>Easy Guidance</h4>
              <p className="text-muted text-sm">Step-by-step instructions for all processes</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Clock size={28} /></div>
              <h4>Saves Time</h4>
              <p className="text-muted text-sm">Quick access to fees, forms, and prerequisites</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><MessageSquare size={28} /></div>
              <h4>Reduces Confusion</h4>
              <p className="text-muted text-sm">Clear assistance to resolve your doubts dynamically</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Shield size={28} /></div>
              <h4>Secure & Reliable</h4>
              <p className="text-muted text-sm">Valid, government-aligned rules and secure access</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Zap size={28} /></div>
              <h4>Fast Processing</h4>
              <p className="text-muted text-sm">Calculate RTO taxes instantly without manual effort</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Bot size={28} /></div>
              <h4>24/7 AI Support</h4>
              <p className="text-muted text-sm">Always online to answer your questions accurately</p>
            </div>
          </div>
        </section>

      </div>
      
      {/* Footer */}
      <footer className="footer">
        <div className="container text-center text-muted">
          <p>Smart Vehicle Portal &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
