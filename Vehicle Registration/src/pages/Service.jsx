import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileCheck, CreditCard, ListChecks, ArrowLeft, MessageSquare, Upload, CheckCircle, MapPin, Car, IndianRupee } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Card from '../components/Card';
import './Service.css';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", 
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const Service = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [applicantName, setApplicantName] = useState('');
  const [vehicleIdentifier, setVehicleIdentifier] = useState('');
  const [vehicleType, setVehicleType] = useState('Motorcycle');
  const [stateName, setStateName] = useState('Telangana');
  const [vehicleCost, setVehicleCost] = useState(100000);

  const isRegistration = type === 'registration';
  
  const title = isRegistration ? "New Vehicle Registration" : "Vehicle Ownership Transfer";

  const documents = isRegistration ? [
    "Vehicle Invoice",
    "Insurance Certificate",
    "Form 20",
    "ID Proof",
    "Address Proof"
  ] : [
    "Original RC",
    "Form 29 & Form 30",
    "Insurance Certificate",
    "ID Proof of Buyer and Seller",
    "Address Proof"
  ];

  const handleFileUpload = async (event, doc) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadedDocs(prev => ({ ...prev, [doc]: { status: 'error', message: 'File size must be strictly under 5MB.' } }));
      return;
    }

    setUploadedDocs(prev => ({ ...prev, [doc]: { status: 'validating' } }));

    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = reader.result.split(',')[1];
      
      try {
        const response = await fetch('/api/validate-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            docType: doc,
            mimeType: file.type,
            fileBase64: base64String
          })
        });

        const data = await response.json();
        if (data.valid) {
          setUploadedDocs(prev => ({ ...prev, [doc]: { status: 'success', message: data.message } }));
        } else {
          setUploadedDocs(prev => ({ ...prev, [doc]: { status: 'error', message: data.message || `Invalid document. Please upload a valid ${doc}` } }));
        }
      } catch (error) {
        console.error("Validation failed", error);
        setUploadedDocs(prev => ({ ...prev, [doc]: { status: 'error', message: 'Failed to connect to validation server.' } }));
      }
    };
    reader.readAsDataURL(file);
    
    // Reset file input so user can try again if they want
    event.target.value = null;
  };

  const allUploaded = documents.every(doc => uploadedDocs[doc]?.status === 'success');
  const missingDocs = documents.filter(doc => uploadedDocs[doc]?.status !== 'success');

  // Fee Calculation Logic
  let basicFee = 0;
  let taxRate = 0;
  let smartCardFee = 200;
  let otherCharges = 0;
  let totalCost = 0;

  // Set tax rates based on state
  switch(stateName) {
    case 'Karnataka': taxRate = 0.10; break;
    case 'Telangana':
    case 'Andhra Pradesh': taxRate = 0.09; break;
    case 'Tamil Nadu': taxRate = 0.08; break;
    case 'Maharashtra': taxRate = 0.07; break;
    case 'Delhi': taxRate = 0.06; break;
    default: taxRate = 0.08;
  }

  const twoWheelers = ['Motorcycle', 'Scooter', 'Moped', 'Electric Two Wheeler', 'Electric Two Wheeler (EV)'];
  const cars = ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Electric Car', 'Electric Car (EV)'];
  const isSmallVehicle = twoWheelers.includes(vehicleType) || ['Auto Rickshaw', 'E-Rickshaw', 'Electric Three Wheeler (EV)'].includes(vehicleType);
  const isCar = cars.includes(vehicleType);

  if (isRegistration) {
    basicFee = isSmallVehicle ? 300 : (isCar ? 600 : 1000);
    const roadTax = vehicleCost * taxRate;
    otherCharges = 400; // Average of 300-500
    totalCost = basicFee + roadTax + smartCardFee + otherCharges;
  } else {
    basicFee = isSmallVehicle ? 200 : 500;
    otherCharges = 350; // Average of 200-500
    totalCost = basicFee + smartCardFee + otherCharges;
  }

  const processSteps = isRegistration ? [
    "Fill application form",
    "Upload documents",
    "Pay registration fees",
    "Visit RTO for verification"
  ] : [
    "Submit Form 29 & 30",
    "Upload required documents",
    "Pay transfer fees",
    "RC updated with new owner details"
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProceed = async () => {
    if (!applicantName.trim() || (!isRegistration && !vehicleIdentifier.trim())) {
      alert("Please ensure Name and Vehicle details are filled out.");
      return;
    }
    if (!allUploaded) {
      alert("Please upload all missing documents first.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const targetCollection = isRegistration ? 'vehicles' : 'transfers';
      await addDoc(collection(db, targetCollection), {
        user: localStorage.getItem('username') || 'Unknown User',
        applicantName: applicantName.trim(),
        vehicleIdentifier: vehicleIdentifier.trim() || 'NEW-REGISTRATION',
        type: isRegistration ? 'Registration' : 'Ownership Transfer',
        vehicleType,
        stateName,
        vehicleCost: isRegistration ? vehicleCost : null,
        totalEstimatedCost: totalCost,
        submissionTime: new Date().toISOString()
      });
      alert(isRegistration ? "Registration application submitted successfully!" : "Transfer application submitted successfully!");
      
      // Clear form fields
      setUploadedDocs({});
      setApplicantName('');
      setVehicleIdentifier('');
      setVehicleType('Motorcycle');
      setStateName('Telangana');
      if (isRegistration) setVehicleCost(100000);
      
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("There was an error submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAI = () => {
    alert("AI Assistant: Hello! Please use the floating chatbot icon in the bottom right corner for immediate guidance!");
  };

  return (
    <div className="service-container animate-fade-in container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="service-header text-center">
        <h1 className="service-page-title">{title}</h1>
      </div>

      <div className="form-selectors" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="form-group">
          <label className="form-label">📝 Applicant Full Name</label>
          <input 
            type="text"
            id="applicantName"
            className="form-select"
            placeholder="Legal Name"
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
          />
        </div>

        {!isRegistration && (
          <div className="form-group">
            <label className="form-label"><Car size={16} /> Target Vehicle No</label>
            <input 
              type="text"
              id="vehicleIdentifier"
              className="form-select"
              placeholder="e.g. MH01 AB 1234"
              value={vehicleIdentifier}
              onChange={(e) => setVehicleIdentifier(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label"><Car size={16} /> Vehicle Type</label>
          <select 
            id="vehicleType"
            className="form-select" 
            value={vehicleType} 
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <optgroup label="Two Wheelers">
              <option value="Motorcycle">Motorcycle</option>
              <option value="Scooter">Scooter</option>
              <option value="Moped">Moped</option>
              <option value="Electric Two Wheeler">Electric Two Wheeler</option>
            </optgroup>
            <optgroup label="Cars">
              <option value="Hatchback">Hatchback</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="MUV">MUV</option>
              <option value="Electric Car">Electric Car</option>
            </optgroup>
            <optgroup label="Commercial Vehicles">
              <option value="Taxi">Taxi</option>
              <option value="Auto Rickshaw">Auto Rickshaw</option>
              <option value="E-Rickshaw">E-Rickshaw</option>
              <option value="Pickup Vehicle">Pickup Vehicle</option>
              <option value="Goods Vehicle (Truck)">Goods Vehicle (Truck)</option>
              <option value="Light Commercial Vehicle (LCV)">Light Commercial Vehicle (LCV)</option>
              <option value="Heavy Commercial Vehicle (HCV)">Heavy Commercial Vehicle (HCV)</option>
            </optgroup>
            <optgroup label="Passenger Vehicles">
              <option value="Bus">Bus</option>
              <option value="Mini Bus">Mini Bus</option>
              <option value="School Bus">School Bus</option>
              <option value="Tourist Bus">Tourist Bus</option>
            </optgroup>
            <optgroup label="Utility Vehicles">
              <option value="Tractor">Tractor</option>
            </optgroup>
            <optgroup label="Electric Vehicles">
              <option value="Electric Car (EV)">Electric Car (EV)</option>
              <option value="Electric Two Wheeler (EV)">Electric Two Wheeler (EV)</option>
              <option value="Electric Three Wheeler (EV)">Electric Three Wheeler (EV)</option>
            </optgroup>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label"><MapPin size={16} /> Select State</label>
          <select 
            id="stateName"
            className="form-select" 
            value={stateName} 
            onChange={(e) => setStateName(e.target.value)}
          >
            {INDIAN_STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        {isRegistration && (
          <div className="form-group">
            <label className="form-label"><IndianRupee size={16} /> Vehicle Cost</label>
            <input 
              type="number"
              id="vehicleCost"
              className="form-select" 
              value={vehicleCost}
              onChange={(e) => setVehicleCost(Number(e.target.value))}
              min="0"
            />
          </div>
        )}
      </div>

      <div className="service-content-grid">
        
        {/* Section 1: Documents */}
        <Card className="service-detail-card">
          <div className="card-header">
            <div className="icon-box"><FileCheck size={24} /></div>
            <h2>Documents Required</h2>
          </div>
          <ul className="doc-list">
            {documents.map((doc, i) => (
              <li key={i} className="doc-upload-item">
                <div className="doc-info">
                  <span className="bullet"></span>
                  {doc}
                </div>
                <div className="validation-container">
                  {uploadedDocs[doc]?.status === 'success' ? (
                    <span className="text-success"><CheckCircle size={16} /> Uploaded</span>
                  ) : uploadedDocs[doc]?.status === 'validating' ? (
                    <span className="validating-text"><div className="validation-spinner"></div> Validating...</span>
                  ) : (
                    <label className={`btn-upload ${uploadedDocs[doc]?.status === 'error' ? 'border-error' : ''}`}>
                      <Upload size={14} /> Upload
                      <input type="file" accept=".jpg,.jpeg,.png,.pdf" hidden onChange={(e) => handleFileUpload(e, doc)} />
                    </label>
                  )}
                  {uploadedDocs[doc]?.status === 'error' && (
                    <div className="text-error">{uploadedDocs[doc].message}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          
          <div className="upload-status">
            {allUploaded ? (
              <p className="text-success">
                ✅ {isRegistration ? "All documents uploaded successfully. You are now ready for vehicle registration." : "All documents uploaded successfully. You are ready for ownership transfer process."}
              </p>
            ) : (
              <p className="text-warning"><strong>Missing:</strong> {missingDocs.join(', ')}</p>
            )}
          </div>
        </Card>

        {/* Section 2: Fee Details */}
        <Card className="service-detail-card">
          <div className="card-header">
            <div className="icon-box"><CreditCard size={24} /></div>
            <h2>Fee Breakdown</h2>
          </div>
          <div className="fee-list">
            {isRegistration ? (
              <>
                <div className="fee-item">
                  <span className="fee-label">Basic Registration Fee</span>
                  <span className="fee-amount">₹{basicFee.toLocaleString()}</span>
                </div>
                <div className="fee-item highlight-fee">
                  <span className="fee-label">Road Tax ({(taxRate * 100).toFixed(0)}% of ₹{vehicleCost.toLocaleString()})</span>
                  <span className="fee-amount">₹{(vehicleCost * taxRate).toLocaleString()}</span>
                </div>
                <div className="fee-item">
                  <span className="fee-label">Smart Card Fee</span>
                  <span className="fee-amount">₹{smartCardFee.toLocaleString()}</span>
                </div>
                <div className="fee-item">
                  <span className="fee-label">Other Charges</span>
                  <span className="fee-amount">₹{otherCharges.toLocaleString()}</span>
                </div>
              </>
            ) : (
              <>
                <div className="fee-item">
                  <span className="fee-label">Ownership Transfer Fee</span>
                  <span className="fee-amount">₹{basicFee.toLocaleString()}</span>
                </div>
                <div className="fee-item">
                  <span className="fee-label">Smart Card Fee</span>
                  <span className="fee-amount">₹{smartCardFee.toLocaleString()}</span>
                </div>
                <div className="fee-item">
                  <span className="fee-label">Other Charges</span>
                  <span className="fee-amount">₹{otherCharges.toLocaleString()}</span>
                </div>
              </>
            )}
            
            <div className="fee-total">
               <span className="fee-label font-bold">Total Estimated Cost</span>
               <span className="fee-amount font-bold text-primary">
                 ₹{totalCost.toLocaleString()}
               </span>
            </div>
          </div>
          <div className="disclaimer-text">
             <p className="text-muted text-sm mt-3">
               * Fees are approximate and vary based on specific vehicle type, vehicle cost, and state government regulations.
             </p>
          </div>
        </Card>

        {/* Section 3: Process Steps */}
        <Card className="service-detail-card">
          <div className="card-header">
            <div className="icon-box"><ListChecks size={24} /></div>
            <h2>Process Steps</h2>
          </div>
          <div className="steps-list">
            {processSteps.map((step, i) => (
              <div key={i} className="step-item">
                <div className="step-number">{i + 1}</div>
                <div className="step-text">{step}</div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      <div className="service-actions">
        <button className="btn btn-outline ai-btn" onClick={handleAI}>
          <MessageSquare size={18} /> Ask AI Assistant
        </button>
        <button 
          className="btn btn-primary proceed-btn" 
          onClick={handleProceed}
          disabled={!allUploaded || isSubmitting}
          style={{ opacity: (allUploaded && !isSubmitting) ? 1 : 0.6 }}
        >
          {isSubmitting ? "Submitting..." : (isRegistration ? "Submit Registration Application" : "Proceed with Transfer (Submit)")}
        </button>
      </div>

    </div>
  );
};

export default Service;
