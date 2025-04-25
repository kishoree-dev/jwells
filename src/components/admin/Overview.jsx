import React from 'react';

const Overview = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-black text-2xl font-semibold">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
          <p className="text-3xl font-bold text-indigo-600">1,234</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Active Orders</h3>
          <p className="text-3xl font-bold text-green-600">56</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600">89</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
