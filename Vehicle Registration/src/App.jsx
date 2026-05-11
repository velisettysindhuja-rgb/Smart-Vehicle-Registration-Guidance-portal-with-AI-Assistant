import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import DashboardHome from './pages/DashboardHome';
import Service from './pages/Service';
import RoadTaxPayment from './pages/RoadTaxPayment';
import RoadTaxStatus from './pages/RoadTaxStatus';
import AIAssistantPage from './pages/AIAssistantPage';
import VehicleEntryForm from './pages/VehicleEntryForm';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('auth') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  useEffect(() => {
    // Read the user's explicit preference before enforcing theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Main Dashboard Layout covering Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            } 
          >
            {/* Dynamic Right Panel Content */}
            <Route index element={<DashboardHome />} />
            <Route path="service/:type" element={<Service />} />
            <Route path="tax-payment" element={<RoadTaxPayment />} />
            <Route path="tax-status" element={<RoadTaxStatus />} />
            <Route path="ai-assistant" element={<AIAssistantPage />} />
            <Route path="admin/add-vehicle" element={<VehicleEntryForm />} />
            <Route path="profile" element={<DashboardHome />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
