import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";

const ClerkLayout = () => {
  const { id } = useParams(); // store ID from route
  const [clerk, setClerk] = useState(null);
  const [store, setStore] = useState(null);

  const clerkId = 2; // 🔒 Hardcoded for now — update with real login logic later

  // Fetch clerk and their store
  useEffect(() => {
    fetch(`http://localhost:3001/users/${clerkId}`)
      .then((res) => res.json())
      .then((data) => {
        setClerk(data);
        return fetch(`http://localhost:3001/stores/${data.store_id}`);
      })
      .then((res) => res.json())
      .then((storeData) => {
        setStore(storeData);
      })
      .catch((err) => {
        console.error("Error loading clerk or store", err);
      });
  }, []);

  if (!clerk || !store) {
    return (
      <div className="p-10 text-center text-gray-600">
        Loading clerk dashboard...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar with clerk/store info */}
      <Sidebar user={clerk} store={store} />

      {/* Main content area */}
      <main className="flex-1 bg-[#fdfdfd] overflow-y-auto">
        {/* Clerk header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              Welcome, {clerk.first_name} {clerk.last_name}
            </h1>
            <p className="text-sm text-gray-500">
              Store: {store.name} – {store.location}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            <p>Email: {clerk.email}</p>
            <p className="text-xs">Clerk ID: {clerk.id}</p>
          </div>
        </div>

        {/* Route children will be rendered here */}
        <div className="p-6">
          <Outlet context={{ clerk, store }} />
        </div>
      </main>
    </div>
  );
};

export default ClerkLayout;
