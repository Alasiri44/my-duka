import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupplyRequestModal = ({ isOpen, onClose, product, clerkId, onSubmit }) => {
  const [quantity, setQuantity] = useState(0);
  const [note, setNote] = useState('');
  const [requestDate, setRequestDate] = useState(new Date().toISOString().split('T')[0]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (product?.selling_price) {
      setTotalAmount(quantity * product.selling_price);
    }
  }, [quantity, product]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/supplier');
        setSuppliers(res.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleSubmit = async () => {
    const newRequest = {
      product_id: product.id,
      requester_id: clerkId,
      quantity,
      status: 'waiting',
      reviewed_by: null,
      created_at: new Date(requestDate).toISOString(),
      reviewed_at: null,
      note,
      supplier_id: Number(selectedSupplierId),
    };

    try {
      await axios.post('http://127.0.0.1:5000/supply_request', newRequest, {headers: { 'Content-Type': 'multipart/form-data' }});
      onSubmit?.();
      onClose();
    } catch (error) {
      console.error('Failed to submit supply request:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded shadow-md w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Request Supply for {product?.name}</h2>

        <label className="block text-sm text-gray-700 mb-1">Select Supplier</label>
        <select
          value={selectedSupplierId}
          onChange={(e) => setSelectedSupplierId(e.target.value)}
          className="w-full border rounded px-2 py-1 mb-4"
        >
          <option value="">-- Select Supplier --</option>
          {suppliers.map(supplier => (
            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
          ))}
        </select>

        <label className="block text-sm text-gray-700 mb-1">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full border rounded px-2 py-1 mb-4"
        />

        <label className="block text-sm text-gray-700 mb-1">Total Amount (KES)</label>
        <div className="w-full border px-2 py-1 rounded bg-gray-100 mb-4">
          {isNaN(totalAmount) ? 'KES 0' : `KES ${totalAmount.toFixed(2)}`}
        </div>

        <label className="block text-sm text-gray-700 mb-1">Request Date</label>
        <input
          type="date"
          value={requestDate}
          onChange={(e) => setRequestDate(e.target.value)}
          className="w-full border rounded px-2 py-1 mb-4"
        />

        <label className="block text-sm text-gray-700 mb-1">Note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full border rounded px-2 py-1 mb-4"
        ></textarea>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!quantity || !selectedSupplierId}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplyRequestModal;
