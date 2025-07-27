import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

const StockExitForm = ({ clerkId = 2 }) => {
  const [clerk, setClerk] = useState(null);
  const [storeId, setStoreId] = useState(null);
  const [products, setProducts] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [party, setParty] = useState('');
  const [createdAt, setCreatedAt] = useState(new Date().toISOString().slice(0, 10));

  const [exits, setExits] = useState([
    {
      product_id: '',
      quantity: '',
      selling_price: '',
      reason: 'sold',
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const user = (await axios.get(`${API_URL}/user/${clerkId}`)).data;
      setClerk(user);
      setStoreId(user.store_id);

      const productRes = await axios.get(`${API_URL}/product?store_id=${user.store_id}`);
      setProducts(productRes.data);
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
      // Create the out batch
      const batchRes = await axios.post(`${API_URL}/batches`, {
        store_id: storeId,
        direction: 'out',
        party,
        created_by: clerkId,
        created_at: new Date(createdAt).toISOString(),
      });

      const createdBatchId = batchRes.data.id;

      // Post exits
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

        await axios.post(`${API_URL}/stock_exits`, payload);
      }

      setSuccessMsg('Stock exits submitted successfully!');
      setExits([{ product_id: '', quantity: '', selling_price: '', reason: 'sold' }]);
      setParty('');
    } catch (err) {
      console.error(err.response ? err.response.data : err);
      alert('Submission failed');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white shadow rounded space-y-6"
    >
      <h2 className="text-2xl font-bold">Stock Exit Batch</h2>
      {successMsg && <p className="text-green-600">{successMsg}</p>}

      {/* Party and Date */}
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

      {/* Exits */}
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

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
      >
        Submit Exit Batch
      </button>
    </form>
  );
};

export default StockExitForm;