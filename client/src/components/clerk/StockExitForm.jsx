import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from "@/utils/axiosConfig";
import { toast } from "react-hot-toast";

const StockExitForm = () => {
  const { clerk, store } = useOutletContext();
  const { user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [party, setParty] = useState('');
  const [createdAt, setCreatedAt] = useState(new Date().toISOString().slice(0, 10));
  const [exits, setExits] = useState([
    { product_id: '', quantity: '', selling_price: '', reason: 'sold' },
  ]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [notes, setNotes] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [stockEntryIds, setStockEntryIds] = useState([]); // New state for stock entry IDs

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, inventoryRes] = await Promise.all([
          axios.get(`/product?store_id=${store.id}`),
          axios.get(`/store/${store.id}/inventory`)
        ]);
        setProducts(productRes.data);
        const inventoryMap = {};
        inventoryRes.data.forEach(item => {
          inventoryMap[item.id] = item.quantity_on_hand;
        });
        setInventory(inventoryMap);
      } catch (err) {
        toast.error('Error loading data');
        console.error('Fetch Data Error:', err);
      }
    };
    fetchData();
  }, [store.id]);

  useEffect(() => {
    const total = exits.reduce((sum, exit) => {
      return exit.reason === 'sold' && exit.quantity && exit.selling_price
        ? sum + Number(exit.quantity) * Number(exit.selling_price)
        : sum;
    }, 0);
    setTotalAmount(total.toFixed(2));
  }, [exits]);

  const handleExitChange = (index, field, value) => {
    const updated = [...exits];
    updated[index][field] = value;

    if (field === 'product_id' && value) {
      const product = products.find(p => p.id === Number(value));
      if (product) {
        updated[index].selling_price = product.selling_price || '';
      }
    }

    if (field === 'quantity' && value) {
      const productId = updated[index].product_id;
      const available = inventory[productId] || 0;
      if (Number(value) > available) {
        toast.error(`Quantity exceeds available stock (${available}) for selected product`);
        updated[index].quantity = available;
      }
    }

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

  const normalizePhone = (phone) => {
    return phone.startsWith("0") ? "254" + phone.slice(1) : phone;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSuccessMsg('');
      setStockEntryIds([]); // Reset stock entry IDs

      if (!store?.id || !user?.id) {
        toast.error('User or store data not loaded. Please refresh and try again.');
        console.error('Missing store or user:', { store, user });
        return;
      }

      if (!party.trim()) {
        toast.error('Party field is required.');
        return;
      }

      for (const exit of exits) {
        if (!exit.product_id || !exit.quantity || !exit.selling_price) {
          toast.error('Please fill all required fields for each item.');
          return;
        }
        const available = inventory[exit.product_id] || 0;
        if (Number(exit.quantity) > available) {
          toast.error(`Quantity exceeds available stock for product ID ${exit.product_id}`);
          return;
        }
      }

      const batchPayload = {
        store_id: store.id,
        direction: 'out',
        party: party.trim(),
        created_by: user.id,
        created_at: new Date(createdAt).toISOString(),
      };
      console.log('Batch Payload:', batchPayload);

      const batchRes = await axios.post(`/batches`, batchPayload, {
        withCredentials: true,
      });
      if (batchRes.status !== 201) {
        throw new Error(batchRes.data?.error || 'Failed to create batch');
      }
      const createdBatchId = batchRes.data.id;

      const entryIds = [];
      for (const exit of exits) {
        const payload = {
          store_id: store.id,
          product_id: Number(exit.product_id),
          quantity: Number(exit.quantity),
          selling_price: Number(exit.selling_price),
          reason: exit.reason,
          batch_id: createdBatchId,
          recorded_by: user.id,
          created_at: new Date(createdAt).toISOString(),
        };
        console.log('Stock Exit Payload:', payload);
        const stockExitRes = await axios.post(`/stock_exits`, payload, { withCredentials: true });
        if (stockExitRes.status !== 201) {
          throw new Error(stockExitRes.data?.error || 'Failed to create stock exit');
        }
        entryIds.push(stockExitRes.data.id); // Assuming response includes the created stock entry ID
      }
      setStockEntryIds(entryIds); // Store entry IDs for M-Pesa payment

      const hasSale = exits.some((exit) => exit.reason === 'sold');
      if (hasSale && paymentMethod === 'Mpesa') {
        setSuccessMsg('Stock exits recorded. Click "Initiate M-Pesa Payment" to proceed.');
      } else {
        setSuccessMsg('Stock exits recorded successfully.');
        resetForm();
      }
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Submission failed';
      toast.error(`Error: ${message}`);
      console.error('Submission Error:', err.response?.data || err);
    }
  };

  const handleMpesaPayment = async () => {
    try {
      if (!customerContact || !/^(07|01)\d{8}$/.test(customerContact)) {
        toast.error('Enter valid payer Safaricom number.');
        return;
      }

      const total = exits.reduce((sum, exit) => {
        return exit.reason === 'sold' && exit.quantity && exit.selling_price
          ? sum + Number(exit.quantity) * Number(exit.selling_price)
          : sum;
      }, 0);

      const paymentPayload = {
        business_id: store.id,
        direction: 'out',
        entry_ids: stockEntryIds,
        amount: Number(total.toFixed(2)),
        method: 'mpesa',
        mpesa_value: '600000',
        payer_phone: normalizePhone(customerContact),
        account_number: '7599'
      };
      console.log('Payment Payload:', paymentPayload);

      await toast.promise(
        axios.post('/payments/mpesa', paymentPayload, {
          withCredentials: true,
          timeout: 10000,
        }).then((res) => {
          console.log('M-Pesa Response:', { status: res.status, data: res.data });
          if (res.status !== 200 && res.status !== 201) {
            throw new Error(res.data?.error || 'Payment failed.');
          }
          return res.data;
        }),
        {
          loading: 'Sending STK Push...',
          success: (data) => data?.daraja_response?.CustomerMessage || 'STK Push request sent successfully.',
          error: (err) => err.response?.data?.error || err.message || 'Payment failed.',
        }
      );

      setSuccessMsg('Payment processed successfully.');
      resetForm();
    } catch (err) {
      console.error('M-Pesa Payment Error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config,
      });
      const message = err.response?.data?.error || err.message || 'Payment failed';
      toast.error(`Error: ${message}`);
    }
  };

  const resetForm = () => {
    setExits([{ product_id: '', quantity: '', selling_price: '', reason: 'sold' }]);
    setParty('');
    setCustomerName('');
    setCustomerContact('');
    setNotes('');
    setPaymentMethod('');
    setStockEntryIds([]); // Reset stock entry IDs
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-2xl font-bold">Stock Exit Batch</h2>
      {successMsg && <p className="text-green-600">{successMsg}</p>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Party *</label>
            <input
              type="text"
              placeholder="Party (e.g. James Taylor)"
              value={party}
              onChange={(e) => setParty(e.target.value)}
              className="w-full border p-2 rounded"
              required
              minLength={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input
              type="date"
              value={createdAt}
              onChange={(e) => setCreatedAt(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>

        <div className="overflow-x-auto mt-6">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 text-left">Product</th>
                <th className="py-2 px-3 text-left">Available</th>
                <th className="py-2 px-3 text-left">Quantity</th>
                <th className="py-2 px-3 text-left">Selling Price</th>
                <th className="py-2 px-3 text-left">Reason</th>
                <th className="py-2 px-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exits.map((exit, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-3">
                    <select
                      value={exit.product_id}
                      onChange={(e) => handleExitChange(index, 'product_id', e.target.value)}
                      className="w-full border p-2 rounded"
                      required
                    >
                      <option value="">-- Select Product --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Stock: {inventory[p.id] || 0})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-3">{inventory[exit.product_id] || 0}</td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      value={exit.quantity}
                      onChange={(e) => handleExitChange(index, 'quantity', e.target.value)}
                      className="w-full border p-2 rounded"
                      placeholder="Qty"
                      required
                      min="1"
                    />
                  </td>
                  <td className="py-2 px-3">{exit.selling_price || 'N/A'}</td>
                  <td className="py-2 px-3">
                    <select
                      value={exit.reason}
                      onChange={(e) => handleExitChange(index, 'reason', e.target.value)}
                      className="w-full border p-2 rounded"
                    >
                      <option value="sold">Sold</option>
                      <option value="damaged">Damaged</option>
                      <option value="expired">Expired</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                  <td className="py-2 px-3">
                    {exits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExit(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addExit}
          className="w-full py-2 bg-orange-400 text-white rounded hover:bg-orange-600 mt-4"
        >
          + Add Another Item
        </button>

        {exits.some((exit) => exit.reason === 'sold') && (
          <div className="space-y-4 mt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Payment Method *</label>
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
                <button
                  type="button"
                  onClick={handleMpesaPayment}
                  className="mt-6 py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
                  disabled={!store.id || !user.id || stockEntryIds.length === 0}
                >
                  Initiate M-Pesa Payment
                </button>
              )}
            </div>

            {paymentMethod === 'Mpesa' && (
              <div>
                <label className="block text-sm font-medium">Phone Number *</label>
                <input
                  type="tel"
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="e.g. 0712345678"
                  required
                />
                <p className="text-blue-600 text-sm mt-1">
                  Phone number will be used for M-Pesa payment request to Paybill 600000, Account 7599.
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

            <div className="text-right">
              <p className="text-lg font-semibold">Total: KES {totalAmount}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold mt-4"
          disabled={!store.id || !user.id || !party.trim() || !exits.every(exit => exit.product_id && exit.quantity && exit.selling_price)}
        >
          Submit Exit Batch
        </button>
      </form>
    </div>
  );
};

export default StockExitForm;