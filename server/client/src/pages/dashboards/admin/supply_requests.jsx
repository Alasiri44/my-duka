import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminSupplyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [clerks, setClerks] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [reqRes, prodRes, userRes] = await Promise.all([
        axios.get('http://localhost:3001/supply_requests'),
        axios.get('http://localhost:3001/products'),
        axios.get('http://localhost:3001/users?role=clerk'),
      ]);

      setRequests(reqRes.data);
      setProducts(prodRes.data);
      setClerks(userRes.data);
    };

    fetchAll();
  }, []);

  const productMap = Object.fromEntries(products.map(p => [p.id, p.name]));
  const clerkMap = Object.fromEntries(clerks.map(c => [c.id, `${c.first_name} ${c.last_name}`]));

  const updateStatus = async (id, newStatus) => {
    await axios.patch(`http://localhost:3001/supply_requests/${id}`, { status: newStatus });
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Supply Requests</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Requested By</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{productMap[req.product_id]}</td>
                <td className="px-4 py-2">{req.quantity}</td>
                <td className="px-4 py-2">{clerkMap[req.requested_by]}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    req.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : req.status === 'declined'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-4 py-2 space-x-2">
                  {req.status === 'pending' && (
                    <>
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        onClick={() => updateStatus(req.id, 'approved')}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => updateStatus(req.id, 'declined')}
                      >
                        Decline
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSupplyRequests;
