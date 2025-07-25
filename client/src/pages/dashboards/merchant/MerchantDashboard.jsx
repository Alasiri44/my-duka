import React, { useEffect, useState } from "react";
import SummaryCards from "../../../components/merchant/SummaryCards";
import BusinessTable from "../../../components/merchant/BusinessTable";
import RecentActivity from "../../../components/merchant/RecentActivity";
import QuickActions from "../../../components/merchant/QuickActions";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";




const MerchantDashboard = () => {
  const [businesses, setBusinesses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

const { user } = useSelector((state) => state.auth);

  const merchantId =user.id;


const handleLogout = () => {
  localStorage.removeItem("user");
  navigate("/login");
};

  
useEffect(() => {
  document.title = `Welcome, ${user?.first_name || "Merchant"}!`;
}, [user]);


  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [
        bizRes,
        storeRes,
        userRes,
        entryRes,
        productRes,
        supplierRes
      ] = await Promise.all([
        fetch(`http://localhost:3000/businesses?merchant_id=${merchantId}`),
        fetch("http://localhost:3000/stores"),
        fetch("http://localhost:3000/users"),
        fetch("http://localhost:3000/stock_entries"),
        fetch("http://localhost:3000/products"),
        fetch("http://localhost:3000/suppliers"),
      ]);

      const [
        businessList,
        storeList,
        userList,
        stockEntries,
        productList,
        supplierList
      ] = await Promise.all([
        bizRes.json(),
        storeRes.json(),
        userRes.json(),
        entryRes.json(),
        productRes.json(),
        supplierRes.json(),
      ]);

      // Standardize IDs: convert all to numbers
      const businesses = businessList.map((b) => ({
        ...b,
        id: Number(b.id),
        merchant_id: Number(b.merchant_id),
      }));

      const stores = storeList.map((s) => ({
        ...s,
        id: Number(s.id),
        business_id: Number(s.business_id),
      }));

      const products = productList.map((p) => ({
        ...p,
        id: Number(p.id),
        store_id: Number(p.store_id),
        category_id: Number(p.category_id),
      }));

      const entries = stockEntries.map((e) => ({
        ...e,
        id: Number(e.id),
        product_id: Number(e.product_id),
        clerk_id: Number(e.clerk_id),
        supplier_id: Number(e.supplier_id),
      }));

      const suppliers = supplierList.map((s) => ({
        ...s,
        id: Number(s.id),
        business_id: Number(s.business_id),
      }));

      // Build lookup maps
      const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
      const supplierMap = Object.fromEntries(suppliers.map((s) => [s.id, s.name]));

      // Get merchant store IDs
      const merchantBusinessIds = businesses.map((b) => b.id);
      const merchantStores = stores.filter((s) =>
        merchantBusinessIds.includes(s.business_id)
      );
      const merchantStoreIds = merchantStores.map((s) => s.id);

      // Filter entries for products that belong to merchant stores
      const merchantStockEntries = entries.filter((entry) => {
        const product = productMap[entry.product_id];
        return product && merchantStoreIds.includes(product.store_id);
      });

      // Calculate summary info
      const unpaidEntries = merchantStockEntries.filter(
        (e) => e.payment_status === "unpaid"
      );

      const outstandingAmount = unpaidEntries.reduce((sum, e) => {
        return sum + (e.buying_price * e.quantity_received);
      }, 0);

      const summaryData = {
        totalBusinesses: businesses.length,
        totalStores: merchantStoreIds.length,
        unpaidDeliveries: unpaidEntries.length,
        outstandingAmount,
      };

      // Generate recent activity
      const recent = merchantStockEntries
        .slice()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .map((entry) => {
          const product = productMap[entry.product_id];
          const supplierName = supplierMap[entry.supplier_id] || "Unknown Supplier";
          const productName = product?.name || "Unknown Product";
          return {
            message: `Received ${entry.quantity_received} x ${productName} from ${supplierName}`,
            timestamp: entry.created_at,
          };
        });

      // Enhance business info
      const enhancedBusinesses = businesses.map((biz) => {
        const bizStores = stores.filter((s) => s.business_id === biz.id);
        const storeIds = bizStores.map((s) => s.id);

        const storeProducts = products.filter((p) =>
          storeIds.includes(p.store_id)
        );
        const productIds = storeProducts.map((p) => p.id);

        const spend = entries
          .filter((e) => productIds.includes(e.product_id))
          .reduce((sum, e) => sum + e.buying_price * e.quantity_received, 0);

        return {
          ...biz,
          status: "Active",
          store_count: storeIds.length,
          monthly_spend: spend,
        };
      });

      // Set all states
      setBusinesses(enhancedBusinesses);
      setRecentActivity(recent);
      setSummary(summaryData);
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
