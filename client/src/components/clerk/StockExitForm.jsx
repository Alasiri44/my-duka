import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PaymentModal from '../shared/payments/PaymentModal';

const API_URL = 'http://127.0.0.1:5000';

const user = JSON.parse(localStorage.getItem('user'));
const clerkId = user?.id;

const StockExitForm = () => {
  const [clerk, setClerk] = useState(null);
  const [storeId, setStoreId] = useState(null);
  const [products, setProducts] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [party, setParty] = useState('');
  const [createdAt, setCreatedAt] = useState(new Date().toISOString().slice(0, 10));
  const [exits, setExits] = useState([
    { product_id: '', quantity: '', selling_price: '', reason: 'sold' },
  ]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [saleInfo, setSaleInfo] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = (await axios.get(`${API_URL}/user/${clerkId}`)).data;
        setClerk(user);
        setStoreId(user.store_id);
        const productRes = await axios.get(`${API_URL}/product?store_id=${user.store_id}`);
        setProducts(productRes.data);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    fetchData();
  }, [clerkId]);

  const handleExitChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...exits];
    updated[index][name] = value;
    setExits(updated);
  };

  const addExit = () => {
    setExits([...exits, { product_id: '', quantity: '', selling_price: '', reason: 'sold' }]);
  };

  const removeExit = (index) => {
    const updated = [...exits];
    updated.splice(index, 1);
    setExits(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSuccessMsg('');

      if (!storeId || !clerkId) {
        alert('User data not loaded. Please refresh and try again.');
        return;
      }

      const batchRes = await axios.post(`${API_URL}/batches`, {
        store_id: storeId,
        direction: 'out',
        party,
        created_by: clerkId,
        created_at: new Date(createdAt).toISOString(),
      });
      const createdBatchId = batchRes.data.id;

      let total = 0;
      for (const exit of exits) {
        const payload = {
          store_id: storeId,
          product_id: Number(exit.product_id),
          quantity: Number(exit.quantity),
          selling_price: Number(exit.selling_price),
          reason: exit.reason,
          batch_id: createdBatchId,
          recorded_by: clerkId,
          created_at: new Date(createdAt).toISOString(),
        };
        if (exit.reason === 'sold') {
          total += Number(exit.quantity) * Number(exit.selling_price);
        }
        await axios.post(`${API_URL}/stock_exits`, payload);
      }

      const hasSale = exits.some((exit) => exit.reason === 'sold');
      if (hasSale) {
        if (!paymentMethod) {
          alert('Please select a payment method.');
          return;
        }
        if (!storeId || !clerkId || !paymentMethod || !total) {
          alert('Missing required sale fields.');
          return;
        }

        const salePayload = {
          store_id: storeId,
          recorded_by: clerkId,
          payment_method: paymentMethod,
          total_amount: Number(total.toFixed(2)),
          created_at: new Date(createdAt).toISOString(),
        };

        if (customerName?.trim()) salePayload.customer_name = customerName.trim();
        if (customerContact?.trim()) salePayload.customer_contact = customerContact.trim();
        if (notes?.trim()) salePayload.notes = notes.trim();

        console.log('Sale payload:', salePayload);

        const saleRes = await axios.post(`${API_URL}/sales`, salePayload);
        setSaleInfo(saleRes.data);
        setPaymentAmount(total);
        setShowPaymentModal(true);
      }

      setSuccessMsg('Stock exits and sale created. Please record payment.');
      setExits([{ product_id: '', quantity: '', selling_price: '', reason: 'sold' }]);
      setParty('');
      setCustomerName('');
      setCustomerContact('');
      setNotes('');
      setPaymentMethod('');
    } catch (err) {
      const message = err.response?.data?.error || 'Submission failed';
      alert(`Error: ${message}`);
      console.error('Submission error:', err.response ? err.response.data : err);
    }
  };


  const handlePaymentSubmit = async (paymentData) => {
    try {
      await axios.post(`${API_URL}/payments`, {
        ...paymentData,
        sale_id: saleInfo?.id,
        store_id: storeId,
        created_by: clerkId,
        created_at: new Date().toISOString(),
      });
      setShowPaymentModal(false);
      setSuccessMsg('Payment recorded successfully!');
    } catch (err) {
      console.error('Payment error:', err.response ? err.response.data : err);
      alert('Payment failed');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow rounded space-y-6">
        <h2 className="text-2xl font-bold">Stock Exit Batch</h2>
        {successMsg && <p className="text-green-600">{successMsg}</p>}

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Party (e.g. James Taylor)"
            value={party}
            onChange={(e) => setParty(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="date"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {exits.map((exit, index) => (
          <div key={index} className="border p-4 bg-gray-50 rounded space-y-4">
            <h3 className="font-semibold text-lg">Item {index + 1}</h3>
            <select
              name="product_id"
              value={exit.product_id}
              onChange={(e) => handleExitChange(index, e)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Select Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="quantity"
                value={exit.quantity}
                placeholder="Quantity"
                onChange={(e) => handleExitChange(index, e)}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="number"
                name="selling_price"
                value={exit.selling_price}
                placeholder="Selling Price"
                onChange={(e) => handleExitChange(index, e)}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <select
              name="reason"
              value={exit.reason}
              onChange={(e) => handleExitChange(index, e)}
              className="w-full border p-2 rounded"
            >
              <option value="sold">Sold</option>
              <option value="damaged">Damaged</option>
              <option value="expired">Expired</option>
              <option value="lost">Lost</option>
            </select>
            {exits.length > 1 && (
              <button
                type="button"
                onClick={() => removeExit(index)}
                className="text-red-500 text-sm"
              >
                Remove Item
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addExit}
          className="w-full py-2 bg-orange-400 text-white rounded hover:bg-orange-600"
        >
          + Add Another Item
        </button>

        {exits.some((exit) => exit.reason === 'sold') && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">-- Select Payment Method --</option>
                <option value="Mpesa">Mpesa</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
              </select>
            </div>

            {paymentMethod === 'Mpesa' && (
              <div>
                <label className="block text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                />
                <p className="text-blue-600 text-sm mt-1">
                  Phone number will be used for M-Pesa payment request.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Customer Name (optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
          disabled={!storeId || !clerkId}
        >
          Submit Exit Batch
        </button>
      </form>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={paymentAmount}
        direction="out"
        paymentMethod={paymentMethod}
        onSubmit={handlePaymentSubmit}
      />
    </>
  );
};

export default StockExitForm;
