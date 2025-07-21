// /pages/dashboards/merchant/Stores.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserShield,
  FaUser,
  FaTruckLoading,
  FaStoreAlt,
} from "react-icons/fa";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [entries, setEntries] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [storeRes, userRes, productRes, entryRes] = await Promise.all([
      fetch("http://localhost:3000/stores"),
      fetch("http://localhost:3000/users"),
      fetch("http://localhost:3000/products"),
      fetch("http://localhost:3000/stock_entries"),
    ]);

    const [storeData, userData, productData, entryData] = await Promise.all([
      storeRes.json(),
      userRes.json(),
      productRes.json(),
      entryRes.json(),
    ]);

    setStores(
      storeData.map((s) => ({
        ...s,
        id: Number(s.id),
        business_id: Number(s.business_id),
      }))
    );
    setUsers(userData.map((u) => ({ ...u, store_id: Number(u.store_id) })));
    setProducts(
      productData.map((p) => ({
        ...p,
        store_id: Number(p.store_id),
        id: Number(p.id),
      }))
    );
    setEntries(
      entryData.map((e) => ({
        ...e,
        product_id: Number(e.product_id),
        buying_price: Number(e.buying_price),
        quantity_received: Number(e.quantity_received),
      }))
    );
  };

  const getStoreStats = (storeId) => {
    const storeUsers = users.filter((u) => u.store_id === storeId);
    const storeAdmins = storeUsers.filter((u) => u.role === "admin").length;
    const clerks = storeUsers.filter((u) => u.role === "clerk").length;

    const storeProductIds = products
      .filter((p) => p.store_id === storeId)
      .map((p) => p.id);

    const unpaidDeliveries = entries.filter(
      (e) =>
        storeProductIds.includes(e.product_id) &&
        e.payment_status === "unpaid"
    ).length;

    return { storeAdmins, clerks, unpaidDeliveries };
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] p-6">
<div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-bold text-[#011638]">All Stores</h1>
  <button
    onClick={() => navigate("/merchant/dashboard/stores/new")}
    className="bg-[#011638] text-white px-4 py-2 text-sm rounded hover:bg-[#000f2a] transition"
  >
    + Add Store
  </button>
</div>      
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f2f0ed]">
        <p className="text-sm text-[#5e574d] mb-2">
  Showing {stores.length} store{stores.length !== 1 ? "s" : ""} across your businesses.
</p>
        {stores.length === 0 ? (
          <p className="text-[#5e574d]">No stores available.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store) => {
              const stats = getStoreStats(store.id);
              return (
                <li
                  key={store.id}
                  onClick={() => navigate(`/merchant/businesses/${store.business_id}/stores/${store.id}`)}
                  className="border border-[#d7d0c8] border-t-4 border-t-[#ec4e20] rounded p-4 hover:shadow-md cursor-pointer transition bg-white"
                >
                  <div className="flex items-center gap-2 text-[#011638] mb-1">
                    <FaStoreAlt />
                    <h3 className="text-lg font-semibold">{store.name}</h3>
                  </div>

                  <p className="text-sm text-[#5e574d]">{store.location}</p>

                  <div className="flex gap-6 text-sm text-[#5e574d] mt-3 items-center">
                    <span className="flex items-center gap-1">
                      <FaUserShield className="text-[#011638]" /> {stats.storeAdmins} Admin
                    </span>
                    <span className="flex items-center gap-1">
                      <FaUser className="text-[#011638]" /> {stats.clerks} Clerk
                    </span>
                    <span className="flex items-center gap-1">
                      <FaTruckLoading className="text-[#011638]" /> {stats.unpaidDeliveries} Unpaid
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Stores;
