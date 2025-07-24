import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const StockExitForm = ({ clerkId, storeId, onSubmitSuccess }) => {
  const [products, setProducts] = useState([]);
  const [formItems, setFormItems] = useState([
    { product_id: "", quantity: "", selling_price: "", reason: "sold" },
  ]);
  const [party, setParty] = useState("");
  const [created_at, setCreatedAt] = useState(dayjs().format("YYYY-MM-DD"));

  useEffect(() => {
    // Fetch only products for this store
    axios
      .get(`http://localhost:3000/products?store_id=${storeId}`)
      .then((res) => {
        setProducts(res.data);
      });
  }, [storeId]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formItems];
    updatedItems[index][field] = value;
    setFormItems(updatedItems);
  };

  const addItem = () => {
    setFormItems([
      ...formItems,
      { product_id: "", quantity: "", selling_price: "", reason: "sold" },
    ]);
  };

  const removeItem = (index) => {
    const updatedItems = [...formItems];
    updatedItems.splice(index, 1);
    setFormItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Create the batch (for this store)
      const batchRes = await axios.post("http://localhost:3000/batches", {
        store_id: storeId,
        direction: "out",
        party,
        created_by: clerkId,
        created_at: new Date(created_at).toISOString(),
      });

      const batchId = batchRes.data.id;

      // Step 2: Create stock exits tied to the batch
      const exitRequests = formItems.map((item) =>
        axios.post("http://localhost:3000/stockExits", {
          product_id: item.product_id,
          quantity: parseFloat(item.quantity),
          selling_price: parseFloat(item.selling_price),
          reason: item.reason,
          batch_id: batchId,
          recorded_by: clerkId,
          created_at: new Date(created_at).toISOString(),
        })
      );

      await Promise.all(exitRequests);

      alert("Stock exits recorded successfully!");
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      console.error("Submission failed", err);
      alert("Failed to record stock exits.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-[#011638] mb-4">Record Stock Exit</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Party</label>
        <input
          type="text"
          value={party}
          onChange={(e) => setParty(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Exit Date</label>
        <input
          type="date"
          value={created_at}
          onChange={(e) => setCreatedAt(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {formItems.map((item, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded p-4 bg-gray-50 space-y-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Product</label>
              <select
                value={item.product_id}
                onChange={(e) =>
                  handleItemChange(index, "product_id", parseInt(e.target.value))
                }
                className="w-full border rounded px-2 py-1"
                required
              >
                <option value="">-- Select Product --</option>
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", parseFloat(e.target.value))
                }
                className="w-full border rounded px-2 py-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Selling Price</label>
              <input
                type="number"
                step="0.01"
                value={item.selling_price}
                onChange={(e) =>
                  handleItemChange(index, "selling_price", parseFloat(e.target.value))
                }
                className="w-full border rounded px-2 py-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Reason</label>
              <select
                value={item.reason}
                onChange={(e) => handleItemChange(index, "reason", e.target.value)}
                className="w-full border rounded px-2 py-1"
              >
                <option value="sold">Sold</option>
                <option value="damaged">Damaged</option>
                <option value="expired">Expired</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>

          {formItems.length > 1 && (
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-red-500 text-sm mt-2"
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={addItem}
          className="bg-[#011638] text-white px-4 py-2 rounded"
        >
          + Add Another Product
        </button>
        <button
          type="submit"
          className="bg-[#ec4e20] hover:bg-orange-600 text-white px-6 py-2 rounded"
        >
          Submit Exit
        </button>
      </div>
    </form>
  );
};

export default StockExitForm;
