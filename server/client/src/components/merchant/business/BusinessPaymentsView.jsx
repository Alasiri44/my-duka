import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const BusinessPaymentsView = () => {
  const { currentBusiness } = useOutletContext();
  const [entries, setEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [clerks, setClerks] = useState([]);
  const [stores, setStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/stock_entries").then((res) => res.json()),
      fetch("http://localhost:3000/products").then((res) => res.json()),
      fetch("http://localhost:3000/suppliers").then((res) => res.json()),
      fetch("http://localhost:3000/users").then((res) => res.json()),
      fetch("http://localhost:3000/stores").then((res) => res.json()),
    ]).then(([entryData, productData, supplierData, userData, storeData]) => {
      const businessStores = storeData
        .filter((s) => Number(s.business_id) === currentBusiness.id)
        .map((s) => Number(s.id));

      const businessClerks = userData
        .filter((u) => businessStores.includes(Number(u.store_id)))
        .map((u) => Number(u.id));

      const relevantEntries = entryData
        .map((e) => ({
          ...e,
          id: Number(e.id),
          quantity: Number(e.quantity),
          amount_paid: Number(e.amount_paid || 0),
          product_id: Number(e.product_id),
          supplier_id: Number(e.supplier_id),
          clerk_id: Number(e.clerk_id),
        }))
        .filter((e) => businessClerks.includes(e.clerk_id));

      setEntries(relevantEntries);
      setProducts(productData.map((p) => ({ ...p, id: Number(p.id) })));
      setSuppliers(supplierData.map((s) => ({ ...s, id: Number(s.id) })));
      setClerks(userData.map((u) => ({ ...u, id: Number(u.id) })));
      setStores(storeData.map((s) => ({ ...s, id: Number(s.id) })));
    });
  }, [currentBusiness.id]);

  const getStatus = (entry) => {
    const totalDue = entry.unit_price * entry.quantity;
    if (entry.amount_paid === 0) return "Unpaid";
    if (entry.amount_paid < totalDue) return "Partial";
    return "Paid";
  };

  const filteredEntries = entries.filter((e) => {
    const supplier = suppliers.find((s) => s.id === e.supplier_id);
    const status = getStatus(e);
    const matchesSearch = supplier?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "" || status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPaid = filteredEntries.reduce((sum, e) => sum + e.amount_paid, 0);

  return (
    <div className="min-h-screen bg-[#fdfdfd] p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#011638]">Payments</h1>
          <p className="text-sm text-[#5e574d]">
            Stock payments across stores in <span className="font-medium">{currentBusiness.name}</span>
          </p>
        </div>
        <div className="bg-[#011638] text-white px-4 py-2 rounded text-sm font-medium">
          Total Paid: KES {totalPaid.toLocaleString()}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search supplier name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-[#d7d0c8] px-3 py-2 rounded text-sm"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-[#d7d0c8] px-3 py-2 rounded text-sm"
        >
          <option value="">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>

      {/* Table */}
      {filteredEntries.length === 0 ? (
        <p className="text-[#5e574d]">No payment records match your filters.</p>
      ) : (
        <div className="overflow-auto border border-[#f2f0ed] rounded-xl">
          <table className="w-full text-sm text-left min-w-[720px]">
            <thead className="bg-[#f2f0ed] text-[#011638]">
              <tr>
                <th className="px-4 py-2">Supplier</th>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Paid (KES)</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((e) => {
                const supplier = suppliers.find((s) => s.id === e.supplier_id);
                const product = products.find((p) => p.id === e.product_id);
                const status = getStatus(e);
                return (
                  <tr key={e.id} className="border-t border-[#f2f0ed]">
                    <td className="px-4 py-2">{supplier?.name || "—"}</td>
                    <td className="px-4 py-2">{product?.name || "—"}</td>
                    <td className="px-4 py-2">{e.quantity}</td>
                    <td className="px-4 py-2">{e.amount_paid.toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          status === "Paid"
                            ? "text-green-600 bg-green-100"
                            : status === "Partial"
                            ? "text-yellow-700 bg-yellow-100"
                            : "text-red-600 bg-red-100"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs text-[#5e574d]">
                      {new Date(e.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BusinessPaymentsView;
