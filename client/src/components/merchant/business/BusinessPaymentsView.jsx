// Updated BusinessPaymentsView.jsx

import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-hot-toast"; // use hot-toast as requested

const BusinessPaymentsView = () => {
  const { businessId, business, stores } = useOutletContext();
  const [entriesByBatch, setEntriesByBatch] = useState({});
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [totalToPay, setTotalToPay] = useState(0);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [mpesaPaybill, setMpesaPaybill] = useState("");
  const [accountReference, setAccountReference] = useState("");
  const [payerPhone, setPayerPhone] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [openBatchId, setOpenBatchId] = useState(null);

  useEffect(() => {
    async function fetchStockEntries() {
      const allEntries = [];
      for (const store of stores) {
        const res = await fetch(`http://127.0.0.1:5000/store/${store.id}/stock_entries`);
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
      toast.error("Only one batch can be selected at a time.");
      return;
    }

    const isSelected = selectedEntries.find((e) => e.id === entry.id);
    const updated = isSelected
      ? selectedEntries.filter((e) => e.id !== entry.id)
      : [...selectedEntries, entry];

    setSelectedEntries(updated);
    setTotalToPay(updated.reduce((sum, e) => sum + parseFloat(e.buying_price || 0), 0));
    setSelectedSupplier(updated[0]?.supplier || null);
  };

const handlePayment = async () => {
  const normalizePhone = (phone) => {
    return phone.startsWith("0") ? "254" + phone.slice(1) : phone;
  };

  if (!selectedEntries.length) return toast.error("No entries selected.");
  if (!selectedSupplier) return toast.error("Supplier not selected.");
  if (totalToPay <= 0) return toast.error("Amount is zero.");

  if (paymentMethod === "mpesa") {
    if (!mpesaPaybill || mpesaPaybill.length < 5)
      return toast.error("Enter a valid Paybill number.");
    if (!accountReference)
      return toast.error("Enter Account Reference.");
    if (!payerPhone || !/^(07|01)\d{8}$/.test(payerPhone))
      return toast.error("Enter valid payer Safaricom number.");
  }

  const payload = {
    business_id: businessId,
    direction: "out",
    entry_ids: selectedEntries.map((e) => e.id),
    amount: totalToPay,
    method: paymentMethod,
    mpesa_type: "paybill",
    mpesa_value: mpesaPaybill,
    payer_phone: normalizePhone(payerPhone),
    account_number: accountReference,
    supplier_id: selectedSupplier.id,
  };

  setIsProcessing(true);

  try {
    await toast.promise(
      fetch("http://localhost:5000/payments/mpesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(async (res) => {
        if (!res.ok) {
          const error = await res.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(error.error || "Payment failed.");
        }
        return res.json();
      }),
      {
        loading: "Sending STK Push...",
        success: (data) =>
          data?.daraja_response?.CustomerMessage ||
          "STK Push request sent successfully.",
        error: (err) => err.message || "Payment failed.",
      }
    );
  } finally {
    setIsProcessing(false);
  }
};

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-[#011638] mb-2">Supplier Payments</h1>
      <p className="text-[#5e574d] mb-6">Overview for <strong>{business?.name}</strong></p>

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
                setMpesaPaybill("");
                setAccountReference("");
                setPayerPhone("");
              }}
              className="w-full text-left px-4 py-3 font-semibold bg-[#f7f7f7] hover:bg-[#eee]"
            >
              Batch #{batchId} — {storeName} — {supplierName} — <span className="text-sm text-gray-500 font-normal">KES {unpaidTotal.toFixed(2)} unpaid</span>
            </button>

            {isOpen && (
              <div className="p-4 border-t overflow-x-auto">
                <table className="min-w-full text-sm mb-4">
                  <thead className="bg-[#f4f4f4] text-left">
                    <tr>
                      <th className="py-2 px-3">Product</th>
                      <th className="py-2 px-3">Qty</th>
                      <th className="py-2 px-3">Price</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map(entry => (
                      <tr key={entry.id} className="border-t">
                        <td className="py-1 px-3">{entry.product_name || `Product #${entry.product_id}`}</td>
                        <td className="py-1 px-3">{entry.quantity_received}</td>
                        <td className="py-1 px-3">KES {parseFloat(entry.buying_price).toFixed(2)}</td>
                        <td className="py-1 px-3">
                          {entry.payment_status === "paid"
                            ? <span className="text-green-600">Paid</span>
                            : <span className="text-red-600">Unpaid</span>}
                        </td>
                        <td className="py-1 px-3">
                          {entry.payment_status === "paid" ? (
                            <span className="text-gray-400 italic text-sm">Already Paid</span>
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
                    <p className="text-sm text-[#444]">Selected: <strong>{selectedEntries.length}</strong></p>
                    <p className="text-sm mb-2">Total: <strong>KES {totalToPay.toFixed(2)}</strong></p>

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
                          Paybill Number:
                          <input
                            type="text"
                            value={mpesaPaybill}
                            onChange={(e) => setMpesaPaybill(e.target.value)}
                            placeholder="Enter Paybill Number"
                            className="block mt-1 border p-2 rounded w-full"
                          />
                        </label>

                        <label className="block text-sm mb-2">
                          Account Reference:
                          <input
                            type="text"
                            value={accountReference}
                            onChange={(e) => setAccountReference(e.target.value)}
                            placeholder="Enter Account Reference"
                            className="block mt-1 border p-2 rounded w-full"
                          />
                        </label>

                        <label className="block text-sm mb-4">
                          Payer Phone Number:
                          <input
                            type="text"
                            value={payerPhone}
                            onChange={(e) => setPayerPhone(e.target.value)}
                            placeholder="e.g. 0712345678"
                            className="block mt-1 border p-2 rounded w-full"
                          />
                        </label>
                      </>
                    )}

                    <button
                         onClick={handlePayment}
                         disabled={isProcessing}
                         className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                       >
                         {isProcessing ? "Processing..." : "Pay"}
                       </button>
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
