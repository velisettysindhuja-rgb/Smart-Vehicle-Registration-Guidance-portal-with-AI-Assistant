import React, { useState } from 'react';
import { IndianRupee, Car, MapPin, Calendar, Fuel, CreditCard, Smartphone, Building, CheckCircle } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Card from '../components/Card';
import './RoadTaxPayment.css';

const INDIAN_STATES = [
  "Andhra Pradesh", "Delhi", "Karnataka", "Maharashtra", "Tamil Nadu", "Telangana"
];

const RoadTaxPayment = () => {
  const [vehicleNo, setVehicleNo] = useState('');
  const [vehicleType, setVehicleType] = useState('Car');
  const [stateName, setStateName] = useState('Telangana');
  const [regDate, setRegDate] = useState('');
  const [fuelType, setFuelType] = useState('Petrol');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isCalculated, setIsCalculated] = useState(false);

  // Mock calculation values
  const baseTax = 2500;
  const stateTax = 1200;
  const greenTax = 300;
  const penalty = 0;
  const totalAmount = baseTax + stateTax + greenTax + penalty;

  const handleCalculate = (e) => {
    e.preventDefault();
    if (vehicleNo && regDate) {
      setIsCalculated(true);
    } else {
      alert("Please fill all required fields.");
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'payments'), {
        user: localStorage.getItem('username') || 'Unknown User',
        vehicleNo: vehicleNo.trim().toUpperCase(),
        vehicleType,
        fuelType,
        stateName,
        registrationDate: regDate,
        paymentMethod,
        amountPaid: totalAmount,
        timestamp: new Date().toISOString()
      });
      
      alert(`Success! Payment of ₹${totalAmount} processed via ${paymentMethod.toUpperCase()} and recorded to Database.`);
      
      // Clear form
      setVehicleNo('');
      setVehicleType('Car');
      setStateName('Telangana');
      setRegDate('');
      setFuelType('Petrol');
      setPaymentMethod('');
      setIsCalculated(false);
    } catch (error) {
      console.error('Error saving payment: ', error);
      alert('Payment initialization failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tax-container animate-fade-in container">
      <div className="tax-header text-center">
        <h1 className="tax-page-title glow-text">Road Tax Payment</h1>
        <p className="text-muted mt-2">Calculate and pay your vehicle road tax securely.</p>
      </div>

      <div className="tax-grid">
        {/* Left Column: Input Details */}
        <div className="tax-input-section">
          <Card className="tax-card glass-panel">
            <h2 className="card-title">Vehicle Details</h2>
            <form onSubmit={handleCalculate} className="tax-form">
              <div className="form-group">
                <label className="form-label">Vehicle Number</label>
                <div className="input-with-icon">
                  <Car size={18} className="input-icon" />
                  <input 
                    type="text" 
                    id="vehicleNo"
                    className="tax-input" 
                    placeholder="e.g. TS09 XY 1234"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Vehicle Type</label>
                  <select id="vehicleType" className="tax-select" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                    <option>Motorcycle</option>
                    <option>Car</option>
                    <option>Commercial</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Fuel Type</label>
                  <select id="fuelType" className="tax-select" value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>Electric</option>
                    <option>CNG</option>
                  </select>
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">State</label>
                  <select id="stateName" className="tax-select" value={stateName} onChange={(e) => setStateName(e.target.value)}>
                    {INDIAN_STATES.map(st => <option key={st}>{st}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Registration Date</label>
                  <input 
                    type="date" 
                    id="regDate"
                    className="tax-input" 
                    value={regDate}
                    onChange={(e) => setRegDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary tax-btn w-100">
                Calculate Tax
              </button>
            </form>
          </Card>
        </div>

        {/* Right Column: Breakdown & Payment */}
        <div className="tax-summary-section">
          {isCalculated ? (
            <div className="animate-fade-in flex-col gap-6">
              {/* Tax Breakdown */}
              <Card className="tax-card glass-panel highlight-border">
                <h2 className="card-title">Tax Breakdown</h2>
                <div className="fee-list mt-4">
                  <div className="fee-item">
                    <span>Base Tax</span>
                    <span>₹{baseTax}</span>
                  </div>
                  <div className="fee-item">
                    <span>State Tax</span>
                    <span>₹{stateTax}</span>
                  </div>
                  <div className="fee-item">
                    <span>Green Tax</span>
                    <span>₹{greenTax}</span>
                  </div>
                  <div className="fee-item">
                    <span>Penalty</span>
                    <span>₹{penalty}</span>
                  </div>
                  <div className="fee-total">
                    <span className="font-bold">Total Payable</span>
                    <span className="font-bold text-primary text-xl">₹{totalAmount}</span>
                  </div>
                </div>
              </Card>

              {/* Payment Section */}
              <Card className="tax-card glass-panel">
                <h2 className="card-title">Select Payment Method</h2>
                <div className="payment-options mt-4">
                  <label className={`payment-method ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                    <input type="radio" name="payment" hidden onChange={() => setPaymentMethod('upi')} />
                    <Smartphone size={20} />
                    <span>UPI</span>
                    {paymentMethod === 'upi' && <CheckCircle className="check-icon" size={16} />}
                  </label>
                  <label className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}>
                    <input type="radio" name="payment" hidden onChange={() => setPaymentMethod('card')} />
                    <CreditCard size={20} />
                    <span>Credit / Debit Card</span>
                    {paymentMethod === 'card' && <CheckCircle className="check-icon" size={16} />}
                  </label>
                  <label className={`payment-method ${paymentMethod === 'netbanking' ? 'selected' : ''}`}>
                    <input type="radio" name="payment" hidden onChange={() => setPaymentMethod('netbanking')} />
                    <Building size={20} />
                    <span>Net Banking</span>
                    {paymentMethod === 'netbanking' && <CheckCircle className="check-icon" size={16} />}
                  </label>
                </div>

                <button 
                  className="btn btn-primary tax-btn w-100 mt-4 glow-btn"
                  onClick={handlePayment}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing Payment...' : `Proceed to Pay ₹${totalAmount}`}
                </button>
              </Card>
            </div>
          ) : (
            <div className="empty-state glass-panel">
              <IndianRupee size={48} className="text-muted opacity-50 mb-4" />
              <h3 className="text-muted">Enter details to calculate tax</h3>
              <p className="text-sm mt-2">Fill the form and click Calculate to view your tax breakdown and proceed with payment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadTaxPayment;
