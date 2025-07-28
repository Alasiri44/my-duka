import React, { useEffect, useState } from "react";
import SummaryCards from "../../../components/merchant/SummaryCards";
import BusinessTable from "../../../components/merchant/BusinessTable";
import RecentActivity from "../../../components/merchant/RecentActivity";
import QuickActions from "../../../components/merchant/QuickActions";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../../redux/slices/authSlice";




const MerchantDashboard = () => {
  const [businesses, setBusinesses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

const { user } = useSelector((state) => state.auth);

  const merchantId =user.id;

const handleLogout = () => {
  fetch('http://127.0.0.1:5000/logout', {
    method: 'DELETE',
    credentials: 'include',
  }).then(() => {
    dispatch(clearUser());
    navigate('/login');
  });
};


  useEffect(() => {
    loadDashboardData();
  }, [merchantId]);

  const loadDashboardData = async () => {
  try {
    const res = await fetch(`http://127.0.0.1:5000/merchant/${merchantId}/dashboard`);
    const data = await res.json();

    setBusinesses(data.businesses);
    setRecentActivity(data.recent_activity);
    setSummary(data.summary);
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
};



  if (!summary) {
    return (
      <div className="p-10 text-center text-[#5e574d] text-lg">Loading dashboard...</div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfdfd] px-0 py-8 space-y-8">

<div className="flex items-center justify-between gap-4 shadow-xl/5 flex-wrap  mb-6">
  <div>
    <h1 className="text-2xl font-bold text-[#011638]">
      Welcome back, {user?.first_name || "Merchant"}!
    </h1>
    <p className="text-sm text-[#5e574d]">Manage your businesses and inventory</p>
  </div>

  {/* Avatar + Dropdown */}
  <div className="relative bottom-2 right-2">
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
          onClick={() => navigate("/profile")}
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


      <SummaryCards summary={summary} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BusinessTable businesses={businesses} />
        <RecentActivity activities={recentActivity} />
      </div>

      <QuickActions />
    </div>
  );
};

export default MerchantDashboard;
