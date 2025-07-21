import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import StoreCharts from "./StoreCharts";

const StoreOverview = () => {
  const { store } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/users").then((res) => res.json()),
      fetch("http://localhost:3000/products").then((res) => res.json()),
      fetch("http://localhost:3000/stock_entries").then((res) => res.json()),
    ]).then(([userData, productData, entryData]) => {
      const storeId = Number(store.id);

      const typedUsers = userData.map((u) => ({
        ...u,
        id: Number(u.id),
        store_id: Number(u.store_id),
      }));

      const typedProducts = productData.map((p) => ({
        ...p,
        id: Number(p.id),
        store_id: Number(p.store_id),
      }));

      const typedEntries = entryData.map((e) => ({
        ...e,
        product_id: Number(e.product_id),
        buying_price: Number(e.buying_price),
        quantity_received: Number(e.quantity_received),
        created_at: e.created_at,
      }));

      const storeProductIds = typedProducts
        .filter((p) => p.store_id === storeId)
        .map((p) => p.id);

      const filteredEntries = typedEntries.filter((e) =>
        storeProductIds.includes(e.product_id)
      );

      const relevantProducts = typedProducts.filter((p) =>
        filteredEntries.some((e) => e.product_id === p.id)
      );

      setUsers(typedUsers.filter((u) => u.store_id === storeId));
      setProducts(relevantProducts);
      setEntries(filteredEntries);
    });
  }, [store.id]);

  const adminCount = users.filter((u) => u.role === "admin").length;
  const clerkCount = users.filter((u) => u.role === "clerk").length;
  const storeProductIds = products.map((p) => p.id);

  const unpaidDeliveries = entries.filter(
    (e) => storeProductIds.includes(e.product_id) && e.payment_status === "unpaid"
  );

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#011638] mb-2">Store Overview</h2>
      <p className="text-sm text-[#5e574d] mb-4">
        Welcome to <span className="font-medium">{store.name}</span>'s dashboard.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div className="bg-[#f2f0ed] border border-[#d7d0c8] p-4 rounded shadow-sm">
          <p className="text-[#5e574d]">Location</p>
          <p className="text-[#011638] font-medium">{store.location}</p>
        </div>

        <div className="bg-[#f2f0ed] border border-[#d7d0c8] p-4 rounded shadow-sm">
          <p className="text-[#5e574d]">Created</p>
          <p className="text-[#011638] font-medium">
            {new Date(store.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-[#f2f0ed] border border-[#d7d0c8] p-4 rounded shadow-sm">
          <p className="text-[#5e574d]">Total Products</p>
          <p className="text-[#011638] font-medium">{products.length}</p>
        </div>

        <div className="bg-[#f2f0ed] border border-[#d7d0c8] p-4 rounded shadow-sm">
          <p className="text-[#5e574d]">Admins</p>
          <p className="text-[#011638] font-medium">{adminCount}</p>
        </div>

        <div className="bg-[#f2f0ed] border border-[#d7d0c8] p-4 rounded shadow-sm">
          <p className="text-[#5e574d]">Clerks</p>
          <p className="text-[#011638] font-medium">{clerkCount}</p>
        </div>

        <div className="bg-[#f2f0ed] border border-[#d7d0c8] p-4 rounded shadow-sm">
          <p className="text-[#5e574d]">Unpaid Deliveries</p>
          <p className="text-[#ec4e20] font-semibold">{unpaidDeliveries.length}</p>
        </div>
      </div>

      {/* Chart Section */}
      <StoreCharts entries={entries} products={products} />
    </div>
  );
};

export default StoreOverview;
