import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlayCircle, Navigation, ShieldCheck, Zap, 
  Bell, FileClock, CarFront, Bike, Truck, 
  Activity, ArrowRight, CheckCircle2, Clock
} from 'lucide-react';
import './DashboardHome.css';

const DashboardHome = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('username') || 'Student Demo';

  return (
    <div className="dashboard-home animate-fade-in">
      {/* Hero Welcome Section */}
      <div className="hero-section glass-panel">
        <div className="hero-content">
          <h1 className="hero-title">Welcome, {userName} 👋</h1>
          <p className="hero-subtitle">Your synchronized gateway to vehicle registrations, renewals, and monitoring. All systems are fully operational.</p>
          <div className="hero-actions mt-3">
            <button className="btn btn-primary glow-button btn-lg" onClick={() => navigate('/service/registration')}>
              <PlayCircle size={20} /> Start New Service
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card glass-panel group">
          <div className="stat-icon-wrapper cyan-glow group-hover">
            <ShieldCheck size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Active Applications</p>
            <h3 className="stat-value">2</h3>
          </div>
        </div>
        <div className="stat-card glass-panel group">
          <div className="stat-icon-wrapper blue-glow group-hover">
            <CarFront size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Vehicles Owned</p>
            <h3 className="stat-value">3</h3>
          </div>
        </div>
        <div className="stat-card glass-panel group">
          <div className="stat-icon-wrapper purple-glow group-hover">
            <FileClock size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending Reviews</p>
            <h3 className="stat-value">1</h3>
          </div>
        </div>
        <div className="stat-card glass-panel group">
          <div className="stat-icon-wrapper indigo-glow group-hover">
            <Bell size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Notifications</p>
            <h3 className="stat-value">4</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-main-cols">
        {/* Left Column Data */}
        <div className="dashboard-col-left">
          
          {/* Vehicle Details Summary */}
          <div className="dashboard-card glass-panel">
            <div className="dashboard-card-header">
              <h3><Zap size={20} className="text-primary"/> Vehicle Portfolio</h3>
            </div>
            <div className="vehicle-summary-grid">
              <div className="vehicle-summary-card">
                <CarFront size={32} className="text-secondary" />
                <div className="vs-details">
                  <h4>Cars</h4>
                  <p>2 Registered</p>
                </div>
              </div>
              <div className="vehicle-summary-card">
                <Bike size={32} className="text-secondary" />
                <div className="vs-details">
                  <h4>Bikes</h4>
                  <p>1 Registered</p>
                </div>
              </div>
              <div className="vehicle-summary-card">
                <Truck size={32} className="text-secondary" />
                <div className="vs-details">
                  <h4>Trucks/Utility</h4>
                  <p>0 Registered</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Tracker Snippet */}
          <div className="dashboard-card glass-panel mt-4">
            <div className="dashboard-card-header">
              <h3><Navigation size={20} className="text-purple"/> Current Application: Toyota Camry</h3>
            </div>
            <div className="progress-tracker">
              <div className="progress-step completed">
                <div className="step-icon"><CheckCircle2 size={16}/></div>
                <div className="step-text">Submitted</div>
              </div>
              <div className="progress-line active"></div>
              <div className="progress-step active">
                <div className="step-icon"><Clock size={16}/></div>
                <div className="step-text">RTO verification</div>
              </div>
              <div className="progress-line"></div>
              <div className="progress-step">
                <div className="step-icon">3</div>
                <div className="step-text">Approved</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column Data */}
        <div className="dashboard-col-right">
          {/* Recent Activity Panel */}
          <div className="dashboard-card glass-panel">
            <div className="dashboard-card-header">
              <h3><Activity size={20} className="text-indigo"/> Recent Activity</h3>
              <button className="btn-text">View All <ArrowRight size={14}/></button>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-dot dot-cyan"></div>
                <div className="activity-content">
                  <h4>Road Tax Paid</h4>
                  <p>Royal Enfield (Valid till 2026)</p>
                  <span className="activity-time">Sep 28, 11:15 AM</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot dot-blue"></div>
                <div className="activity-content">
                  <h4>Ownership Transferred</h4>
                  <p>Honda City (TS09 EK 1234)</p>
                  <span className="activity-time">Yesterday, 10:00 AM</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot dot-purple"></div>
                <div className="activity-content">
                  <h4>Registration Applied</h4>
                  <p>Toyota Camry (Awaiting RC)</p>
                  <span className="activity-time">Oct 12, 02:30 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default DashboardHome;
