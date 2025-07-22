import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const [businesses, setBusinesses] = useState([]);
  const [store, setStore] = useState(null);

  useEffect(() => {
    // Fetch business list
    fetch("http://localhost:3000/businesses")
      .then((res) => res.json())
      .then((data) => setBusinesses(data.map((b) => ({ ...b, id: Number(b.id) }))));
  }, []);

  useEffect(() => {
    // Fetch the store assigned to this admin/clerk
    if (user?.store_id) {
      fetch(`http://localhost:3000/stores/${user.store_id}`)
        .then((res) => res.json())
        .then((data) => setStore(data));
    }
  }, [user?.store_id]);

  if (!store) {
    return <div className="p-10 text-center text-[#5e574d] text-lg">Loading store...</div>;
  }

  const currentBusinessId = Number(store.business_id);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        user={user}
        store={store}
        businesses={businesses}
        currentId={currentBusinessId}
      />
      <main className="flex-1 bg-[#fdfdfd] p-6 overflow-y-auto">
        <Outlet context={{ store, storeId: store.id, role: user.role }} />
      </main>
    </div>
  );
};

export default AdminLayout;
