import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import BatchList from "../../../components/shared/store/BatchList";
import BatchDetailPanel from "../../../components/shared/store/BatchDetailPanel";
import StockExitTable from "../../../components/shared/store/StockExitTable";
import StockEntriesFilters from "../../../components/shared/store/StockEntriesFilters";
import axios from "@/utils/axiosConfig";

const StockExits = () => {
  const { store } = useOutletContext();
  const [exits, setExits] = useState([]);
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
    Promise.all([
      axios.get("/stock_exits"),
      axios.get("/user"),
      axios.get("/product"),
      axios.get("/supplier"),
    ]).then(([exitRes, userRes, productRes, supplierRes]) => {
      setExits(
        exitRes.data.map((e) => ({
          ...e,
          clerk_id: Number(e.clerk_id ?? e.recorded_by),
          product_id: Number(e.product_id),
          quantity_sold: Number(e.quantity_sold ?? e.quantity ?? 0),
          selling_price: Number(e.selling_price ?? 0),
          supplier_id: Number(e.supplier_id ?? 1),
          payment_status: e.payment_status ?? "paid",
        }))
      );
      setUsers(userRes.data.map((u) => ({ ...u, id: Number(u.id), store_id: Number(u.store_id) })));
      setProducts(productRes.data.map((p) => ({ ...p, id: Number(p.id) })));
      setSuppliers(supplierRes.data.map((s) => ({ ...s, id: Number(s.id) })));
    });
  }, [store.id]);

  const clerkIds = useMemo(
    () => users.filter((u) => u.store_id === Number(store.id)).map((u) => u.id),
    [users, store.id]
  );

  const storeExits = useMemo(
    () => exits.filter((e) => clerkIds.includes(e.clerk_id)),
    [exits, clerkIds]
  );

  const filteredExits = useMemo(() => {
    return storeExits.filter((e) => {
      const productMatch = filterProduct ? e.product_id === Number(filterProduct) : true;
      const supplierMatch = filterSupplier ? e.supplier_id === Number(filterSupplier) : true;
      const dateMatch =
        (!filterStartDate || new Date(e.created_at) >= new Date(filterStartDate)) &&
        (!filterEndDate || new Date(e.created_at) <= new Date(filterEndDate));
      return productMatch && supplierMatch && dateMatch;
    });
  }, [storeExits, filterProduct, filterSupplier, filterStartDate, filterEndDate]);

  const batches = useMemo(() => {
    const grouped = {};
    for (const exit of filteredExits) {
      const batchKey = exit.batch_id || `no-batch-${exit.id}`;
      if (!grouped[batchKey]) grouped[batchKey] = [];
      grouped[batchKey].push(exit);
    }

    const filteredBatches = {};
    for (const [batchId, exits] of Object.entries(grouped)) {
      const allPaid = exits.every((e) => e.payment_status === "paid");

      if (
        filterBatchStatus === "" ||
        (filterBatchStatus === "paid" && allPaid) ||
        (filterBatchStatus === "unpaid" && !allPaid)
      ) {
        filteredBatches[batchId] = exits;
      }
    }

    return filteredBatches;
  }, [filteredExits, filterBatchStatus]);

  const selectedBatchExits = batches[selectedBatchId] || [];

  const getProductName = (id) => products.find((p) => p.id === id)?.name || "—";
  const getClerkName = (id) => users.find((u) => u.id === id)?.first_name || "—";
  const getSupplierName = (id) => suppliers.find((s) => s.id === id)?.name || "—";
  const getFirstExit = (exits) => exits[0];
  const getBatchTotal = (exits) =>
    exits.reduce((sum, e) => sum + e.selling_price * e.quantity, 0);

  const totalValue = filteredExits.reduce(
    (sum, e) => sum + e.selling_price * e.quantity_sold,
    0
  );

  return (
    <div className="bg-white p-6 rounded-xl border border-[#f2f0ed] shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#011638]">Stock Exits</h2>
        <button
          onClick={() => setGroupedView((prev) => !prev)}
          className="text-sm px-4 py-2 border rounded text-[#011638] border-[#011638] hover:bg-[#f2f0ed]"
        >
          {groupedView ? "Show All Exits" : "Show by Batch"}
        </button>
      </div>

      <div className="text-sm font-medium text-[#011638] mb-4">
        Total Sales Value: <span className="text-green-600">KES {totalValue.toFixed(2)}</span>
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
            getFirstEntry={getFirstExit}
            getBatchTotal={getBatchTotal}
          />
          <BatchDetailPanel
            selectedBatchId={selectedBatchId}
            selectedBatchEntries={selectedBatchExits}
            getProductName={getProductName}
            getClerkName={getClerkName}
            getSupplierName={getSupplierName}
          />
        </div>
      ) : (
        (() => {
          console.log('StockExitTable exits:', filteredExits);
          return (
            <StockExitTable
              exits={filteredExits}
              getProductName={getProductName}
              getClerkName={getClerkName}
              getSupplierName={getSupplierName}
            />
          );
        })()
      )}
    </div>
  );
};

export default StockExits;