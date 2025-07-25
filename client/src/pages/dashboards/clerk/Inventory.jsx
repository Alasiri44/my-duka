import React from "react";
import StoreInventory from "../../../components/shared/store/inventory/StoreInventory"; 
import { useOutletContext } from "react-router-dom";

const ClerkInventory = () => {
  const { store, clerk } = useOutletContext();

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex items-center justify-between border-b pb-2">
        <div>
          <h1 className="text-xl font-semibold text-[#011638]">
            {store.name} Inventory
          </h1>
          <p className="text-sm text-gray-500">Managed by Clerk: {clerk?.first_name} {clerk?.last_name}</p>
        </div>
      </div>

      {/* Store Inventory */}
      <StoreInventory />
    </div>
  );
};

export default ClerkInventory;
