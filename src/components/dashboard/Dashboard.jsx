import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import ChangePassword from './ChangePassword';
import ValidateTransaction from './ValidateTransaction';
import CreateExpense from './CreateExpense';
import AddTransaction from './AddTransaction';
import TransactionHistory from './TransactionHistory';
import Transactions from '../../pages/Transactions';
import PendingExpenses from './PendingExpenses';
import { useSelector } from 'react-redux';
import { FaBars } from 'react-icons/fa';

const Dashboard = () => {
  const [currentView, setCurrentView] = useState("transaction-history");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);  // Reference for sidebar
  const overlayRef = useRef(null);  // Reference for overlay

  // Get user info from Redux store
  // eslint-disable-next-line no-unused-vars
  const { userInfo } = useSelector((state) => state.userLogin);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);  // Toggle sidebar open/close
  };

  // Render content based on selected view
  const renderContent = () => {
    switch (currentView) {
      case "home":
        return <Transactions />;
      case "add-transaction":
        return <AddTransaction />;
      case "transaction-history":
        return <TransactionHistory />;
      case "validate-transaction":
        return <ValidateTransaction />;
      case "Depense":
        return <CreateExpense />;
      case "modify-password":
        return <ChangePassword />;
      case "ValidateByPresidentAndPco":
        return <PendingExpenses />;
      default:
        return <div>404 - View Not Found</div>;
    }
  };

  // Handle outside click to close sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !overlayRef.current.contains(event.target)) {
        setSidebarOpen(false);  // Close sidebar if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="p-2 text-fiord hover:text-gray-700 fixed top-4 left-4 z-50"
      >
        <FaBars />
      </button>

      {/* Sidebar Component */}
      <Sidebar
        onMenuClick={setCurrentView}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main content area */}
      <div className="flex-grow p-2 mt-10 transition-all duration-500">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
