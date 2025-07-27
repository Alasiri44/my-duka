import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import BatchList from "../BatchList";
import BatchDetailPanel from "../BatchDetailPanel";
import StockEntryTable from "../../../../components/shared/store/StockEntryTable";
import StockEntriesFilters from "../../../../components/shared/store/StockEntriesFilters";

const StockEntries = () => {
  const { store } = useOutletContext();
  const [entries, setEntries] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [groupedView, setGroupedView] = useState(true);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [batchSearch, setBatchSearch] = useState("");
  const [filterBatchStatus, setFilterBatchStatus] = useState(""); // new

  const [filterProduct, setFilterProduct] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`http://127.0.0.1:5000/stock_entries?store_id=${store.id}`).then((r) => r.json()),
      fetch("http://127.0.0.1:5000/user").then((r) => r.json()),
      fetch("http://127.0.0.1:5000/product").then((r) => r.json()),
      fetch("http://127.0.0.1:5000/supplier").then((r) => r.json()),
    ]).then(([entryData, userData, productData, supplierData]) => {
      setEntries(
        entryData.map((e) => ({
          ...e,
          clerk_id: Number(e.clerk_id),
          product_id: Number(e.product_id),
          quantity_received: Number(e.quantity_received),
          buying_price: Number(e.buying_price),
        }))
      );
      setUsers(userData.map((u) => ({ ...u, id: Number(u.id), store_id: Number(u.store_id) })));
      setProducts(productData.map((p) => ({ ...p, id: Number(p.id) })));
      setSuppliers(supplierData.map((s) => ({ ...s, id: Number(s.id) })));
    });
  }, [store.id]);

  const clerkIds = useMemo(
    () => users.filter((u) => u.store_id === Number(store.id)).map((u) => u.id),
    [users, store.id]
  );

  const storeEntries = useMemo(
    () => entries.filter((e) => clerkIds.includes(e.clerk_id)),
    [entries, clerkIds]
  );

  const filteredEntries = useMemo(() => {
    return storeEntries.filter((e) => {
      const productMatch = filterProduct ? e.product_id === Number(filterProduct) : true;
      const supplierMatch = filterSupplier ? e.supplier_id === Number(filterSupplier) : true;
      const dateMatch =
        (!filterStartDate || new Date(e.created_at) >= new Date(filterStartDate)) &&
        (!filterEndDate || new Date(e.created_at) <= new Date(filterEndDate));
      return productMatch && supplierMatch && dateMatch;
    });
  }, [storeEntries, filterProduct, filterSupplier, filterStartDate, filterEndDate]);

  const batches = useMemo(() => {
    const grouped = {};
    for (const entry of filteredEntries) {
      const batchKey = entry.batch_id || `no-batch-${entry.id}`;
      if (!grouped[batchKey]) grouped[batchKey] = [];
      grouped[batchKey].push(entry);
    }

    // ✅ Apply batch status filter
    const filteredBatches = {};
    for (const [batchId, entries] of Object.entries(grouped)) {
      const allPaid = entries.every((e) => e.payment_status === "paid");

      if (
        filterBatchStatus === "" ||
        (filterBatchStatus === "paid" && allPaid) ||
        (filterBatchStatus === "unpaid" && !allPaid)
      ) {
        filteredBatches[batchId] = entries;
      }
    }

    return filteredBatches;
  }, [filteredEntries, filterBatchStatus]);

  const selectedBatchEntries = batches[selectedBatchId] || [];

  const getProductName = (id) => products.find((p) => p.id === id)?.name || "—";
  const getClerkName = (id) => users.find((u) => u.id === id)?.first_name || "—";
  const getSupplierName = (id) => suppliers.find((s) => s.id === id)?.name || "—";
  const getFirstEntry = (entries) => entries[0];
  const getBatchTotal = (entries) =>
    entries.reduce((sum, e) => sum + e.buying_price * e.quantity_received, 0);

  const totalValue = filteredEntries.reduce(
    (sum, e) => sum + e.buying_price * e.quantity_received,
    0
  );

  return (
    <div className="bg-white p-6 rounded-xl border border-[#f2f0ed] shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#011638]">Stock Entries</h2>
        <button
          onClick={() => setGroupedView((prev) => !prev)}
          className="text-sm px-4 py-2 border rounded text-[#011638] border-[#011638] hover:bg-[#f2f0ed]"
        >
          {groupedView ? "Show All Entries" : "Show by Batch"}
        </button>
      </div>

      <div className="text-sm font-medium text-[#011638] mb-4">
        Total Stock Value: <span className="text-green-600">KES {totalValue.toFixed(2)}</span>
      </div>

      <StockEntriesFilters
        products={products}
        suppliers={suppliers}
        filterProduct={filterProduct}
        filterSupplier={filterSupplier}
        filterStartDate={filterStartDate}
        filterEndDate={filterEndDate}
        onProductChange={setFilterProduct}
        onSupplierChange={setFilterSupplier}
        onStartDateChange={setFilterStartDate}
        onEndDateChange={setFilterEndDate}
        batchSearch={batchSearch}
        onBatchSearchChange={setBatchSearch}
        showBatchSearch={groupedView}
        filterBatchStatus={filterBatchStatus}
        onBatchStatusChange={setFilterBatchStatus}
      />

      {groupedView ? (
        <div className="flex flex-col md:flex-row gap-4">
          <BatchList
            batches={batches}
            selectedBatchId={selectedBatchId}
            onSelectBatch={setSelectedBatchId}
            searchTerm={batchSearch}
            getFirstEntry={getFirstEntry}
            getBatchTotal={getBatchTotal}
          />
          <BatchDetailPanel
            selectedBatchId={selectedBatchId}
            selectedBatchEntries={selectedBatchEntries}
            getProductName={getProductName}
            getClerkName={getClerkName}
            getSupplierName={getSupplierName}
          />
        </div>
      ) : (
        <StockEntryTable
          entries={filteredEntries}
          getProductName={getProductName}
          getClerkName={getClerkName}
          getSupplierName={getSupplierName}
        />
      )}
    </div>
  );
};

export default StockEntries;
