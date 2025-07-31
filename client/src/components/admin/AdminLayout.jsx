import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import axios from "@/utils/axiosConfig"; 

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const [store, setStore] = useState(null);
  
  useEffect(() => {
    if (user?.store_id) {
      axios
        .get(`/store/${user.store_id}`)
        .then((res) => setStore(res.data))
        .catch((err) => console.error("Failed to load store:", err));
    }
  }, [user?.store_id]);

  if (!store) {
    return <div className="p-10 text-center text-[#5e574d] text-lg">Loading store...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={user} store={store} business={store.business} />
      <main className="flex-1 bg-[#fdfdfd] p-6 overflow-y-auto">
       <Outlet context={{ store, storeId: store.id, role: user.role, business: store.business }} />
      </main>
    </div>
  );
};

export default AdminLayout;