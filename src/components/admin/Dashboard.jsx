import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Overview from "./Overview";
import Products from "./Products";
import Orders from './Orders';

function Dashboard({ onBackToProfile }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");

  const handleBackToProfile = () => {
    onBackToProfile();
    localStorage.setItem('showAdminContent', 'false');
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 h-screen bg-white border-r border-gray-200">
          <div className="p-6">
            {/* Back Button */}
            <button
              onClick={handleBackToProfile}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
            >
              <FaArrowLeft />
              <span>Back to Profile</span>
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-8">Admin Panel</h1>
            <nav className="space-y-4">
              <button
                onClick={() => setActiveTab("products")}
                className={`w-full px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${activeTab === "products"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <span className="material-icons-outlined"></span>
                <span>Products</span>
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full px-4 py-3 rounded-lg flex items-center space-x-3 transition-all 
                  ${activeTab === "orders" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <span>Orders</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-screen overflow-y-auto">
            {activeTab === "products" && <Products />}
            {activeTab === "orders" && <Orders />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
