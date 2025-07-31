import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../../../components/merchant/Sidebar";
import axios from "@/utils/axiosConfig";

const BusinessLayout = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [businesses, setBusinesses] = useState([]);
  const [stores, setStores] = useState([]);
  const [currentBusiness, setCurrentBusiness] = useState(null);

  useEffect(() => {
    axios
      .get(`/business/${id}`)
      .then((res) => {
        setCurrentBusiness(res.data);
        setStores(res.data.stores);
      })
      .catch((err) => {
        console.error("Failed to fetch business data:", err);
      });
  }, [id]);

  if (!currentBusiness) {
    return (
      <div className="p-10 text-center text-[#5e574d] text-lg">
        Loading business...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        businesses={businesses}
        currentId={currentBusiness?.id}
        stores={currentBusiness?.stores || []}
      />
      <main className="flex-1 bg-[#fdfdfd] p-6 overflow-y-auto">
        <Outlet
          context={{ businessId: Number(id), role: user?.role, business: currentBusiness, stores }}
        />
      </main>
    </div>
  );
};

export default BusinessLayout;