import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

const StockEntryForm = ({ clerkId = 2 }) => {
  const [clerk, setClerk] = useState(null);
  const [storeId, setStoreId] = useState(null);
  const [batchId, setBatchId] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  const [entries, setEntries] = useState([
    {
      product_id: '',
      new_product_name: '',
      category_id: '',
      new_category: '',
      quantity_received: '',
      buying_price: '',
      payment_status: 'paid',
      payment_method: 'Cash',
      transaction_code: '',
      supplier_id: '',
      new_supplier_name: '',
      spoilt: '',
      isNewProduct: false,
      isNewCategory: false,
      isNewSupplier: false,
    },
  ]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const user = (await axios.get(`${API_URL}/users/${clerkId}`)).data;
      setClerk(user);
      setStoreId(user.store_id);

      const [productRes, categoryRes, supplierRes, batchRes] = await Promise.all([
        axios.get(`${API_URL}/products?store_id=${user.store_id}`),
        axios.get(`${API_URL}/categories?store_id=${user.store_id}`),
        axios.get(`${API_URL}/suppliers?store_id=${user.store_id}`),
        axios.get(`${API_URL}/batches?store_id=${user.store_id}`)
      ]);

      setProducts(productRes.data);
      setCategories(categoryRes.data);
      setSuppliers(supplierRes.data);
      setBatchId(batchRes.data.length > 0 ? batchRes.data.slice(-1)[0].id + 1 : 1);
    };

    fetchInitialData();
  }, [clerkId]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newEntries = [...entries];

    if (name === 'product_id') {
      newEntries[index].isNewProduct = value === 'new';
    }
    if (name === 'category_id') {
      newEntries[index].isNewCategory = value === 'new';
    }
    if (name === 'supplier_id') {
      newEntries[index].isNewSupplier = value === 'new';
    }

    newEntries[index][name] = value;
    setEntries(newEntries);
  };

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        product_id: '',
        new_product_name: '',
        category_id: '',
        new_category: '',
        quantity_received: '',
        buying_price: '',
        payment_status: 'paid',
        payment_method: 'Cash',
        transaction_code: '',
        supplier_id: '',
        new_supplier_name: '',
        spoilt: '',
        isNewProduct: false,
        isNewCategory: false,
        isNewSupplier: false,
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (const entry of entries) {
        let categoryId = entry.category_id;
        let productId = entry.product_id;
        let supplierId = entry.supplier_id;

        // New category
        if (entry.isNewCategory && entry.new_category) {
          const res = await axios.post(`${API_URL}/categories`, {
            name: entry.new_category,
            store_id: storeId,
          });
          categoryId = res.data.id;
        }

        // New product
        if (entry.isNewProduct && entry.new_product_name) {
          const res = await axios.post(`${API_URL}/products`, {
            name: entry.new_product_name,
            category_id: categoryId,
            store_id: storeId,
          });
          productId = res.data.id;
        }

        // New supplier
        if (entry.isNewSupplier && entry.new_supplier_name) {
          const res = await axios.post(`${API_URL}/suppliers`, {
            name: entry.new_supplier_name,
            store_id: storeId,
          });
          supplierId = res.data.id;
        }

        // Submit stock entry
        const payload = {
          product_id: Number(productId),
          clerk_id: clerkId,
          batch_id: batchId,
          supplier_id: Number(supplierId),
          quantity_received: Number(entry.quantity_received),
          buying_price: Number(entry.buying_price),
          spoilt: Number(entry.spoilt || 0),
          payment_status: entry.payment_status,
          payment_method: entry.payment_method,
          transaction_code: entry.transaction_code || null,
          store_id: storeId,
          created_at: new Date().toISOString(),
        };

        await axios.post(`${API_URL}/stock_entries`, payload);
      }

      setSuccessMsg('Batch submitted successfully!');
      setEntries([entries[0]]); // reset
    } catch (err) {
      console.error(err);
      alert('Submission failed. Check console for errors.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-2xl font-bold">Stock Entry Batch</h2>
      {successMsg && <p className="text-green-600">{successMsg}</p>}

      {entries.map((entry, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3 bg-gray-50">
          <h3 className="font-semibold text-lg">Product {index + 1}</h3>

          <select name="product_id" value={entry.product_id} onChange={(e) => handleChange(index, e)} className="w-full border p-2 rounded">
            <option value="">-- Select Product --</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            <option value="new">+ Add New Product</option>
          </select>
          {entry.isNewProduct && (
            <>
              <input type="text" name="new_product_name" placeholder="New product name" value={entry.new_product_name} onChange={(e) => handleChange(index, e)} className="w-full border p-2 rounded" />
              <select name="category_id" value={entry.category_id} onChange={(e) => handleChange(index, e)} className="w-full border p-2 rounded mt-2">
                <option value="">-- Select Category --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                <option value="new">+ Add New Category</option>
              </select>
              {entry.isNewCategory && (
                <input type="text" name="new_category" placeholder="New category name" value={entry.new_category} onChange={(e) => handleChange(index, e)} className="w-full border p-2 rounded mt-2" />
              )}
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <input type="number" name="quantity_received" placeholder="Quantity Received" value={entry.quantity_received} onChange={(e) => handleChange(index, e)} className="w-full border p-2 rounded" required />
            <input type="number" name="buying_price" placeholder="Buying Price" value={entry.buying_price} onChange={(e) => handleChange(index, e)} className="w-full border p-2 rounded" required />
          </div>

          <select name="supplier_id" value={entry.supplier_id} onChange={(e) => handleChange(index, e)} className="w-full border p-2 rounded">
            <option value="">-- Select Supplier --</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            <option value="new">+ Add New Supplier</option>
          </select>
          {entry.isNewSupplier && (
            <input type="text" name="new_supplier_name" placeholder="New supplier name" value={entry.new_supplier_name} onChange={(e) => handleChange(index, e)} className="w-full border p-2 rounded mt-2" />
          )}

          <div className="grid grid-cols-2 gap-4">
            <select name="payment_status" value={entry.payment_status} onChange={(e) => handleChange(index, e)} className="w-full border p-2 rounded">
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
            <select name="payment_method" value={entry.payment_method} onChange={(e) => handleChange(index, e)} className="w-full border p-2 rounded">
              <option value="Cash">Cash</option>
              <option value="Mpesa">Mpesa</option>
              <option value="Bank">Bank</option>
            </select>
          </div>

          {(entry.payment_method === 'Mpesa' || entry.payment_method === 'Bank') && (
            <input type="text" name="transaction_code" placeholder="Transaction Code" value={entry.transaction_code} onChange={(e) => handleChange(index, e)} className="w-full border p-2 rounded" required />
          )}

          <input type="number" name="spoilt" placeholder="Spoilt (optional)" value={entry.spoilt} onChange={(e) => handleChange(index, e)} className="w-full border p-2 rounded" />
        </div>
      ))}

      <button type="button" onClick={addEntry} className="w-full py-2 bg-orange-400 text-white rounded hover:bg-orange-600">
        + Add Another Product
      </button>

      <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">
        Submit Batch
      </button>
    </form>
  );
};

export default StockEntryForm;
