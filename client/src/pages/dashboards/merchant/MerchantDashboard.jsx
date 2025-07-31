import React, { useEffect, useState } from "react";
import SummaryCards from "../../../components/merchant/SummaryCards";
import BusinessTable from "../../../components/merchant/BusinessTable";
import RecentActivity from "../../../components/merchant/RecentActivity";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../../redux/slices/authSlice";
import axios from "@/utils/axiosConfig";

const MerchantDashboard = () => {
  const [businesses, setBusinesses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const merchantId = user.id;

  const handleLogout = async () => {
    try {
      await axios.delete("/logout");
      dispatch(clearUser());
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const loadDashboardData = async () => {
    try {
      const res = await axios.get(`/merchant/${merchantId}/dashboard`);
      const data = res.data;
      setBusinesses(data.businesses);
      setRecentActivity(data.recent_activity);
      setSummary(data.summary);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [merchantId]);

  if (!summary) {
    return (
      <div className="p-10 text-center text-[#5e574d] text-lg">Loading dashboard...</div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfdfd] px-6 md:px-8 lg:px-12 py-12 space-y-12 relative">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md mb-12 fixed top-0 left-0 right-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-[#011638]">
            Welcome back, {user?.first_name || "Merchant"}!
          </h1>
          <p className="text-sm text-[#5e574d]">Manage your businesses and inventory</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2 bg-[#f2f0ed] rounded-full border border-[#d7d0c8] hover:bg-[#e0dedc] transition"
          >
            <div className="w-8 h-8 bg-[#011638] text-white rounded-full flex items-center justify-center text-sm font-semibold">
              {user?.first_name?.charAt(0).toUpperCase() || "M"}
            </div>
            <span className="text-sm text-[#011638] font-medium">{user?.first_name || "Merchant"}</span>
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#d7d0c8] rounded shadow-lg z-50">
              <button
                onClick={() => navigate("/merchant/profile")}
                className="block w-full text-left px-4 py-2 text-sm text-[#011638] hover:bg-[#f2f0ed]"
              >
                View Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#f2f0ed]"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 space-y-12">
        <SummaryCards summary={summary} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <BusinessTable businesses={businesses} refreshBusinesses={loadDashboardData} />
          <RecentActivity activities={recentActivity} />
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;