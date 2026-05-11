import React, { useState } from 'react';
import { Search, Car, Calendar, CheckCircle, AlertCircle, FileText, Download, Loader2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Card from '../components/Card';
import './RoadTaxStatus.css';

const RoadTaxStatus = () => {
  const [vehicleNo, setVehicleNo] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [statusParam, setStatusParam] = useState('paid'); // 'paid' or 'pending'

  const [isSearching, setIsSearching] = useState(false);

  const handleStatusCheck = async (e) => {
    e.preventDefault();
    if (!vehicleNo.trim()) {
      alert("Please enter a vehicle number.");
      return;
    }
    
    setIsSearching(true);
    
    // Mock logic simulating pending status if ends with 'P'
    const generatedStatus = vehicleNo.toUpperCase().endsWith('P') ? 'pending' : 'paid';
    
    try {
      // Log the search into Firestore
      await addDoc(collection(db, 'status'), {
        user: localStorage.getItem('username') || 'Unknown User',
        queryVehicleNo: vehicleNo.trim().toUpperCase(),
        resultStatus: generatedStatus,
        timestamp: new Date().toISOString()
      });
      
      setStatusParam(generatedStatus);
      setHasSearched(true);
    } catch (error) {
      console.error('Error logging status check:', error);
      alert('Network error while checking status. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="status-container animate-fade-in container">
      <div className="status-header text-center">
        <h1 className="status-page-title glow-text">Road Tax Status</h1>
        <p className="text-muted mt-2">Check the road tax payment status and validity of your vehicle.</p>
      </div>

      <div className="search-section">
        <Card className="glass-panel search-card">
          <form onSubmit={handleStatusCheck} className="search-form">
            <div className="form-group mb-0 search-input-group">
              <label className="form-label" style={{ display: 'none' }}>Vehicle Number</label>
              <div className="input-with-icon full-width-search">
                <Car size={20} className="input-icon" />
                <input 
                  type="text" 
                  id="statusVehicleNo"
                  className="status-input" 
                  placeholder="Enter Vehicle Number (e.g. MH01 AB 1234)"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                />
                <button type="submit" className="btn btn-primary search-btn glow-btn" disabled={isSearching}>
                  {isSearching ? <Loader2 size={18} className="spinner" /> : <Search size={18} />}
                  {isSearching ? 'Checking...' : 'Check Status'}
                </button>
              </div>
            </div>
          </form>
        </Card>
      </div>

      {hasSearched && (
        <div className="status-results animate-fade-in">
          <Card className={`glass-panel result-card ${statusParam === 'paid' ? 'status-paid-border' : 'status-pending-border'}`}>
            <div className="result-header">
              <h2 className="card-title mb-0">Status Results for {vehicleNo.toUpperCase()}</h2>
              {statusParam === 'paid' ? (
                <div className="badge badge-success">
                  <CheckCircle size={16} /> Paid
                </div>
              ) : (
                <div className="badge badge-warning">
                  <AlertCircle size={16} /> Pending
                </div>
              )}
            </div>

            <div className="status-info-grid">
              <div className="info-box">
                <span className="info-label">Owner Name</span>
                <span className="info-value">John Doe</span>
              </div>
              <div className="info-box">
                <span className="info-label">Vehicle Type</span>
                <span className="info-value">Motor Car (LMV)</span>
              </div>
              <div className="info-box">
                <span className="info-label">Registration Authority</span>
                <span className="info-value">RTO, State Transport Dept</span>
              </div>
              <div className="info-box">
                <span className="info-label">Last Paid Date</span>
                <span className="info-value">
                  <Calendar size={14} className="inline-icon" /> 
                  {statusParam === 'paid' ? '12-Aug-2023' : '10-Mar-2015'}
                </span>
              </div>
              <div className="info-box">
                <span className="info-label">Tax Validity</span>
                <span className="info-value">
                  {statusParam === 'paid' ? 'Lifetime (Up to 2038)' : 'Expired (March 2030)'}
                </span>
              </div>
              {statusParam === 'pending' && (
                <div className="info-box highlight-box warning-box">
                  <span className="info-label">Due Amount (inc. Penalty)</span>
                  <span className="info-value text-warning font-bold">₹4,500</span>
                </div>
              )}
            </div>

            <div className="status-actions">
              {statusParam === 'paid' ? (
                <button className="btn btn-outline status-action-btn border-primary">
                  <Download size={18} />
                  Download Receipt
                </button>
              ) : (
                <button className="btn btn-primary status-action-btn glow-btn">
                  <FileText size={18} />
                  Pay Now
                </button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RoadTaxStatus;
