import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SupplyRequestTable from '../../../components/shared/store/SupplyRequestTable.jsx';

const AdminSupplyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [requesters, setRequesters] =  useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [reqRes, prodRes, SuppRes, requesterRes] = await Promise.all([
          axios.get('http://127.0.0.1:5000/supply_request'),
          axios.get('http://127.0.0.1:5000/product'),
          axios.get('http://127.0.0.1:5000/supplier'),
          axios.get('http://127.0.0.1:5000/user')
        ]);
        console.log('Supply requests:', reqRes.data);
        console.log('Products:', prodRes.data);
        setRequests(reqRes.data);
        setProducts(prodRes.data);
        setSuppliers(SuppRes.data);
        setRequesters(requesterRes.data);
      } catch (error) {
        console.error('Error fetching supply requests or products:', error);
      }
    };
    fetchAll();
  }, []);

  const productMap = Object.fromEntries(products.map(p => [p.id, p.name]));
  const supplierMap = Object.fromEntries(suppliers.map(p =>[p.id, p.name]));
  const requesterMap = Object.fromEntries(requesters.map(u => [u.user_id, `${u.first_name} ${u.last_name}`]));
  const handleApprove = async (id) => {
    try {
      const res = await axios.patch(`http://127.0.0.1:5000/supply_request/${id}`, {
        status: 'approved'
      });
      // Update the UI by replacing the updated request in the list
      setRequests(prev =>
        prev.map(req => (req.id === id ? { ...req, status: 'approved' } : req))
      );
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleDecline = async (id) => {
    try {
      const res = await axios.patch(`http://127.0.0.1:5000/supply_request/${id}`, {
        status: 'denied'
      });
      setRequests(prev =>
        prev.map(req => (req.id === id ? { ...req, status: 'denied' } : req))
      );
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Supply Requests</h2>
      <div className="overflow-x-auto">
        <SupplyRequestTable
          requests={requests}
          getProductName={id => productMap[id] || 'Unknown'}
          getSupplierName={id => supplierMap[id] || '-'}
          getRequesterName={req => `${req.requester_first_name} ${req.requester_last_name}`}
          onApprove={handleApprove}
          onDecline={handleDecline}
        />
      </div>
    </div>
  );
};

export default AdminSupplyRequests;