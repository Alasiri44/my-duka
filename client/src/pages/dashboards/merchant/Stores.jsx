import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  FaUserShield,
  FaUser,
  FaTruckLoading,
  FaStoreAlt,
} from "react-icons/fa";
import axios from "@/utils/axiosConfig";
import CreateStoreModal from "./CreateStoreModal";

const Stores = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Use 'id' to match route parameter
  const { stores, setStores } = useOutletContext(); // Assume setStores is passed from BusinessLayout
  const [storeStats, setStoreStats] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch stats for each store
  useEffect(() => {
    const fetchStoreStats = async () => {
      const stats = {};
      for (const store of stores) {
        try {
          const response = await axios.get(`/store/${store.id}/overview`);
          stats[store.id] = response.data.summary;
        } catch (error) {
          console.error(`Failed to fetch stats for store ${store.id}:`, error);
          stats[store.id] = {
            admin_count: 0,
            clerk_count: 0,
            unpaid_deliveries: 0,
          };
        }
      }
      setStoreStats(stats);
    };

    if (stores.length > 0) {
      fetchStoreStats();
    }
  }, [stores]);

  // Handle store creation
  const handleStoreCreated = async (newStore) => {
    try {
      // Refresh stores by fetching from the backend
      const response = await axios.get(`/business/${id}`);
      setStores(response.data.stores);
    } catch (error) {
      console.error("Failed to refresh stores:", error);
      // Fallback: Add new store to local state
      setStores((prev) => [...prev, newStore]);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#011638]">All Stores</h1>
        <button
          onClick={() => setIsModalOpen(true)}
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
              const stats = storeStats[store.id] || {
                admin_count: 0,
                clerk_count: 0,
                unpaid_deliveries: 0,
              };
              return (
                <li
                  key={store.id}
                  onClick={() => {
                    navigate(`/merchant/businesses/${id}/stores/${store.id}`);
                  }}
                  className="border border-[#d7d0c8] border-t-4 border-t-[#ec4e20] rounded p-4 hover:shadow-md cursor-pointer transition bg-white"
                >
                  <div className="flex items-center gap-2 text-[#011638] mb-1">
                    <FaStoreAlt />
                    <h3 className="text-lg font-semibold">{store.name}</h3>
                  </div>

                  <p className="text-sm text-[#5e574d]">{store.location}</p>

                  <div className="flex gap-6 text-sm text-[#5e574d] mt-3 items-center">
                    <span className="flex items-center gap-1">
                      <FaUserShield className="text-[#011638]" /> {stats.admin_count} Admin
                    </span>
                    <span className="flex items-center gap-1">
                      <FaUser className="text-[#011638]" /> {stats.clerk_count} Clerk
                    </span>
                    <span className="flex items-center gap-1">
                      <FaTruckLoading className="text-[#011638]" /> {stats.unpaid_deliveries} Unpaid
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <CreateStoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        businessId={id}
        onStoreCreated={handleStoreCreated}
      />
    </div>
  );
};

export default Stores;