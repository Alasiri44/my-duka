import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import BatchList from "../BatchList";
import BatchDetailPanel from "../BatchDetailPanel";
import StockEntryTable from "../../../../components/shared/store/StockEntryTable";
import StockEntriesFilters from "../../../../components/shared/store/StockEntriesFilters";
import axios from "@/utils/axiosConfig";

const StockEntries = () => {
  const { store } = useOutletContext();
  const [entries, setEntries] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [groupedView, setGroupedView] = useState(true);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [batchSearch, setBatchSearch] = useState("");
  const [filterBatchStatus, setFilterBatchStatus] = useState("");

  const [filterProduct, setFilterProduct] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (filterProduct) queryParams.append("product_id", filterProduct);
    if (filterSupplier) queryParams.append("supplier_id", filterSupplier);
    if (filterStartDate) queryParams.append("start_date", filterStartDate);
    if (filterEndDate) queryParams.append("end_date", filterEndDate);

    const queryString = queryParams.toString();

    Promise.all([
      axios.get(`/store/${store.id}/stock_entries?${queryString}`),
      axios.get(`/store/${store.id}/users`),
      axios.get(`/store/${store.id}/products`),
      axios.get(`/business/${store.business_id}/suppliers`),
    ]).then(([entryRes, userRes, productRes, supplierRes]) => {
      setEntries(
        entryRes.data.map((e) => ({
          ...e,
          id: Number(e.id),
          quantity: Number(e.quantity),
          buying_price: parseFloat(e.buying_price) || 0,
        }))
      );
      setUsers(userRes.data.map((u) => ({ ...u, id: Number(u.id), store_id: Number(u.store_id) })));
      setProducts(productRes.data.map((p) => ({ ...p, id: Number(p.id) })));
      setSuppliers(supplierRes.data.map((s) => ({ ...s, id: Number(s.id) })));
    });
  }, [store.id, store.business_id, filterProduct, filterSupplier, filterStartDate, filterEndDate]);

  const storeEntries = useMemo(
    () => entries.filter((e) => Number(e.store_id) === Number(store.id)),
    [entries, store.id]
  );
  console.log("Current store ID:", store.id);

  const batches = useMemo(() => {
    const grouped = {};
    for (const entry of storeEntries) {
      const batchKey = entry.batch_id || `no-batch-${entry.id}`;
      if (!grouped[batchKey]) grouped[batchKey] = [];
      grouped[batchKey].push(entry);
    }

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
  }, [storeEntries, filterBatchStatus]);

  const selectedBatchEntries = batches[selectedBatchId] || [];

  const getProductName = (id) => products.find((p) => p.id === id)?.name || "—";
  const getClerkName = (id) => users.find((u) => u.id === id)?.first_name || "—";
  const getSupplierName = (id) => suppliers.find((s) => s.id === id)?.name || "—";
  const getFirstEntry = (entries) => entries[0];
  const getBatchTotal = (entries) =>
    entries.reduce((sum, e) => sum + e.buying_price * e.quantity_received, 0);

  const totalValue = storeEntries.reduce(
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
          entries={storeEntries}
          getProductName={getProductName}
          getClerkName={getClerkName}
          getSupplierName={getSupplierName}
        />
      )}
    </div>
  );
};

export default StockEntries;