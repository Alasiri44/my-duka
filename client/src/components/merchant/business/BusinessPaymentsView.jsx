import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const BusinessPaymentsView = () => {
  const { businessId, business, stores } = useOutletContext();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entriesByBatch, setEntriesByBatch] = useState({});
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [totalToPay, setTotalToPay] = useState(0);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [mpesaOption, setMpesaOption] = useState(null);
  const [mpesaValue, setMpesaValue] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [openBatchId, setOpenBatchId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/payments")
      .then((res) => res.json())
      .then((data) => {
        setPayments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch payments:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    async function fetchStockEntries() {
      const allEntries = [];
      for (const store of stores) {
        const res = await fetch(`http://localhost:5000/store/${store.id}/stock_entries`);
        const entries = await res.json();
        allEntries.push(...entries);
      }
      const unpaidByBatch = {};
      for (const entry of allEntries) {
        if (!unpaidByBatch[entry.batch_id]) unpaidByBatch[entry.batch_id] = [];
        unpaidByBatch[entry.batch_id].push(entry);
      }
      setEntriesByBatch(unpaidByBatch);
    }
    if (stores?.length) fetchStockEntries();
  }, [stores]);

  const toggleEntry = (entry) => {
    if (
      selectedEntries.length > 0 &&
      selectedEntries[0].batch_id !== entry.batch_id
    ) {
      alert("You can only select entries from one batch at a time.");
      return;
    }

    const isSelected = selectedEntries.find((e) => e.id === entry.id);
    let updated;
    if (isSelected) {
      updated = selectedEntries.filter((e) => e.id !== entry.id);
    } else {
      updated = [...selectedEntries, entry];
    }
    setSelectedEntries(updated);
    setTotalToPay(
      updated.reduce((sum, e) => sum + parseFloat(e.buying_price || 0), 0)
    );
    if (updated.length > 0) {
      setSelectedSupplier(updated[0].supplier);
    } else {
      setSelectedSupplier(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#011638] mb-2">Supplier Payments</h1>
      <p className="text-[#5e574d] mb-6">Overview of payments for <strong>{business?.name}</strong></p>

      {Object.entries(entriesByBatch).map(([batchId, entries]) => {
        const storeName = stores.find(s => s.id === entries[0]?.store_id)?.name || "Unknown Store";
        const supplierName = entries[0]?.supplier?.name || "Unknown Supplier";
        const isOpen = openBatchId === batchId;
        const unpaidTotal = entries.filter(e => e.payment_status !== "paid")
          .reduce((sum, e) => sum + parseFloat(e.buying_price || 0), 0);

        return (
          <div key={batchId} className="mb-4 border rounded-xl bg-white">
            <button
              onClick={() => {
                setOpenBatchId(isOpen ? null : batchId);
                setSelectedEntries([]);
                setSelectedSupplier(null);
                setTotalToPay(0);
                setPaymentMethod("cash");
                setMpesaOption(null);
                setMpesaValue("");
                setAccountNumber("");
              }}
              className="w-full text-left px-4 py-3 font-semibold bg-[#f7f7f7] hover:bg-[#eee]"
            >
              Batch #{batchId} — {storeName} — {supplierName} — <span className="text-sm font-normal text-gray-500">KES {unpaidTotal.toFixed(2)} unpaid</span>
            </button>
            {isOpen && (
              <div className="p-4 border-t overflow-x-auto">
                <table className="min-w-full text-sm mb-4">
                  <thead className="bg-[#f4f4f4] text-left">
                    <tr>
                      <th className="py-2 px-3">Product</th>
                      <th className="py-2 px-3">Quantity</th>
                      <th className="py-2 px-3">Buying Price</th>
                      <th className="py-2 px-3">Payment Status</th>
                      <th className="py-2 px-3">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry.id} className="border-t">
                        <td className="py-1 px-3">{entry.product_name || `Product #${entry.product_id}`}</td>
                        <td className="py-1 px-3">{entry.quantity_received}</td>
                        <td className="py-1 px-3">KES {parseFloat(entry.buying_price).toFixed(2)}</td>
                        <td className="py-1 px-3">
                          {entry.payment_status === "paid"
                            ? <span className="text-green-600">Paid</span>
                            : entry.payment_status === "partial"
                            ? <span className="text-yellow-600">Partial</span>
                            : <span className="text-red-600">Unpaid</span>}
                        </td>
                        <td className="py-1 px-3">
                          {entry.payment_status === "paid" ? (
                            <span className="text-sm text-gray-400 italic">Already Paid</span>
                          ) : (
                            <input
                              type="checkbox"
                              checked={selectedEntries.some(e => e.id === entry.id)}
                              onChange={() => toggleEntry(entry)}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {selectedEntries.length > 0 && (
                  <div className="bg-[#f9f9f9] p-4 rounded-xl mt-4">
                    <h4 className="text-md font-bold mb-2 text-[#011638]">Payment Summary</h4>
                    <p className="text-sm text-[#444]">Selected Entries: <strong>{selectedEntries.length}</strong></p>
                    <p className="text-sm mb-2">Total to Pay: <strong>KES {totalToPay.toFixed(2)}</strong></p>

                    <label className="block text-sm mb-2">
                      Payment Method:
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="block mt-1 border p-2 rounded w-full"
                      >
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="mpesa">M-Pesa</option>
                      </select>
                    </label>

                    {paymentMethod === "mpesa" && (
                      <>
                        <label className="block text-sm mb-2">
                          Pay To:
                          <select
                            value={mpesaOption || ""}
                            onChange={(e) => setMpesaOption(e.target.value)}
                            className="block mt-1 border p-2 rounded w-full"
                          >
                            <option value="">-- Select Option --</option>
                            <option value="paybill">Paybill ({selectedSupplier?.paybill_number || "custom"})</option>
                            <option value="till">Till ({selectedSupplier?.till_number || "custom"})</option>
                            <option value="phone">Phone ({selectedSupplier?.phone_number || "custom"})</option>
                          </select>
                        </label>

                        {mpesaOption && (
                          <label className="block text-sm mb-4">
                            {mpesaOption === "paybill" ? "Paybill Number" : mpesaOption === "till" ? "Till Number" : "Phone Number"}:
                            <input
                              type="text"
                              value={mpesaValue}
                              onChange={(e) => setMpesaValue(e.target.value)}
                              placeholder={`Enter ${mpesaOption} number`}
                              className="block mt-1 border p-2 rounded w-full"
                            />
                          </label>
                        )}

                        {mpesaOption === "paybill" && (
                          <label className="block text-sm mb-4">
                            Account Number:
                            <input
                              type="text"
                              value={accountNumber}
                              onChange={(e) => setAccountNumber(e.target.value)}
                              placeholder="Enter Account Number"
                              className="block mt-1 border p-2 rounded w-full"
                            />
                          </label>
                        )}
                      </>
                    )}

                    <button className="bg-[#011638] text-white px-4 py-2 rounded">Pay</button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BusinessPaymentsView;
