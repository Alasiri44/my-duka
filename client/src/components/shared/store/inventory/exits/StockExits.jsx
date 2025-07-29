import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ExitTable from "../../../../../components/shared/store/inventory/exits/ExitTable";
import ExitFilters from "../../../../../components/shared/store/inventory/exits/ExitFilters";
import ExitBatchList from "../../../../../components/shared/store/inventory/exits/ExitBatchList";
import ExitBatchDetailPanel from "../../../../../components/shared/store/inventory/exits/ExitBatchDetailPanel";

const StockExits = () => {
  const { store } = useOutletContext();
  const [exits, setExits] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [groupedView, setGroupedView] = useState(true);
  const [selectedBatchId, setSelectedBatchId] = useState(null);

  const [filterProduct, setFilterProduct] = useState("");
  const [filterClerk, setFilterClerk] = useState("");
  const [filterReason, setFilterReason] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams({ store_id: store.id });
    if (filterProduct) queryParams.append("product_id", filterProduct);
    if (filterClerk) queryParams.append("recorded_by", filterClerk);
    if (filterReason) queryParams.append("reason", filterReason);

    Promise.all([
      fetch(`http://127.0.0.1:5000/stock_exits?${queryParams}`).then((res) => res.json()),
      fetch(`http://127.0.0.1:5000/store/${store.id}/products`).then((res) => res.json()),
      fetch(`http://127.0.0.1:5000/store/${store.id}/users`).then((res) => res.json()),
      fetch(`http://127.0.0.1:5000/store/${store.id}/batches?direction=out`).then((res) => res.json()),
    ]).then(([exitData, productData, userData, batchData]) => {
      setExits(
        exitData.map((e) => ({
          ...e,
          id: Number(e.id),
          quantity: Number(e.quantity),
          selling_price: parseFloat(e.selling_price) || 0,
        }))
      );
      setProducts(productData.map((p) => ({ ...p, id: Number(p.id) })));
      setUsers(userData.map((u) => ({ ...u, id: Number(u.id) })));
      setBatches(batchData.map((b) => ({ ...b, id: Number(b.id) })));
    });
  }, [store.id, filterProduct, filterClerk, filterReason]);

  const getProductName = (id) => products.find((p) => p.id === id)?.name || "—";
  const getClerkName = (id) => {
    const u = users.find((u) => u.id === id);
    return u ? `${u.first_name} ${u.last_name}` : "—";
  };

  const storeExits = useMemo(() => {
    return exits.filter((e) => e.store_id === Number(store.id));
  }, [exits, store.id]);

  const groupedBatches = useMemo(() => {
    const result = {};
    for (const exit of storeExits) {
      const key = exit.batch_id || `no-batch-${exit.id}`;
      if (!result[key]) result[key] = [];
      result[key].push(exit);
    }
    return result;
  }, [storeExits]);

  const selectedBatchExits = groupedBatches[selectedBatchId] || [];

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

      <ExitFilters
        products={products}
        users={users}
        filterProduct={filterProduct}
        setFilterProduct={setFilterProduct}
        filterClerk={filterClerk}
        setFilterClerk={setFilterClerk}
        filterReason={filterReason}
        setFilterReason={setFilterReason}
      />

      {groupedView ? (
        <div className="flex flex-col md:flex-row gap-4">
          <ExitBatchList
            groupedBatches={groupedBatches}
            selectedBatchId={selectedBatchId}
            setSelectedBatchId={setSelectedBatchId}
            getProductName={getProductName}
          />
          <ExitBatchDetailPanel
            selectedBatchId={selectedBatchId}
            selectedBatchExits={selectedBatchExits}
            getProductName={getProductName}
            getClerkName={getClerkName}
          />
        </div>
      ) : (
        <ExitTable
          exits={storeExits}
          getProductName={getProductName}
          getClerkName={getClerkName}
        />
      )}
    </div>
  );
};

export default StockExits;
