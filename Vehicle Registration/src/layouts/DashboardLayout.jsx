import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ChatbotFrontend from '../components/ChatbotFrontend';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const location = useLocation();
  const isAIPage = location.pathname === '/ai-assistant';

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <main className="dashboard-main panel-scroll">
        <Outlet />
      </main>
      {!isAIPage && <ChatbotFrontend />}
    </div>
  );
};

export default DashboardLayout;
