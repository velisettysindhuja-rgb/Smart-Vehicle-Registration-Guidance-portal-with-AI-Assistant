import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Car, User, Hash, Activity, Save, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../components/Card';
import './VehicleEntryForm.css';

const VehicleEntryForm = () => {
  const [formData, setFormData] = useState({
    ownerName: '',
    vehicleNumber: '',
    vehicleModel: '',
    status: 'Active'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when typing
    if (errorMessage) setErrorMessage('');
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.ownerName.trim() || !formData.vehicleNumber.trim() || !formData.vehicleModel.trim() || !formData.status) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await addDoc(collection(db, 'vehicles'), {
        ownerName: formData.ownerName.trim(),
        vehicleNumber: formData.vehicleNumber.trim().toUpperCase(),
        vehicleModel: formData.vehicleModel.trim(),
        status: formData.status,
        createdAt: new Date().toISOString()
      });

      setSuccessMessage('Vehicle successfully registered in the database!');
      setFormData({
        ownerName: '',
        vehicleNumber: '',
        vehicleModel: '',
        status: 'Active'
      });
    } catch (error) {
      console.error('Error adding document: ', error);
      setErrorMessage('Failed to save vehicle data. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="vehicle-form-container animate-fade-in container">
      <div className="form-header text-center">
        <h1 className="page-title">Direct Vehicle Entry</h1>
        <p className="text-muted">Manually enter vehicle records directly into the central Firestore database.</p>
      </div>

      <div className="form-content-wrapper">
        <Card className="vehicle-entry-card glass-panel">
          
          {successMessage && (
            <div className="alert success-alert animate-fade-in">
              <CheckCircle size={20} />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="alert error-alert animate-fade-in">
              <AlertCircle size={20} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="vehicle-entry-form">
            <div className="form-group row">
              <div className="input-icon-wrapper">
                <User className="input-icon" size={18} />
                <label className="form-label">Owner Name</label>
              </div>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                className="form-input"
                placeholder="Enter full legal name"
                value={formData.ownerName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group row">
              <div className="input-icon-wrapper">
                <Hash className="input-icon" size={18} />
                <label className="form-label">Vehicle Number</label>
              </div>
              <input
                type="text"
                id="vehicleNumber"
                name="vehicleNumber"
                className="form-input"
                placeholder="e.g. AP 09 BS 1234"
                value={formData.vehicleNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-group row">
              <div className="input-icon-wrapper">
                <Car className="input-icon" size={18} />
                <label className="form-label">Vehicle Model</label>
              </div>
              <input
                type="text"
                id="vehicleModel"
                name="vehicleModel"
                className="form-input"
                placeholder="e.g. Honda City VX"
                value={formData.vehicleModel}
                onChange={handleChange}
              />
            </div>

            <div className="form-group row">
              <div className="input-icon-wrapper">
                <Activity className="input-icon" size={18} />
                <label className="form-label">Registration Status</label>
              </div>
              <select
                id="status"
                name="status"
                className="form-input form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Expired">Expired</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div className="form-actions mt-4">
              <button 
                type="submit" 
                className="btn btn-primary submit-record-btn w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex-center">Saving to Database... <span className="spinner ml-2"></span></span>
                ) : (
                  <span className="flex-center"><Save size={18} className="mr-2" /> Add Vehicle Record</span>
                )}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default VehicleEntryForm;
