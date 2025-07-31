import React from 'react';
import SalesChart from './charts/SalesCharts';
import ProductStatusChart from './charts/ProductStatusChart';
import RevenueChart from './charts/RevenueChart';
import { useOutletContext } from 'react-router-dom';

const Reports = () => {
  const { storeId } = useOutletContext();

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-gray-700">Store Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SalesChart storeId={storeId} />
        <ProductStatusChart storeId={storeId} />
        <RevenueChart storeId={storeId} />
      </div>
    </div>
  );
};

export default Reports;
