import SupplyRequestTable from '../components/admin/SupplyRequestTable';
import ClerkManager from '../components/admin/ClerkManager';
import ReportsChart from '../components/admin/ReportsChart';


function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <SupplyRequestTable />
      <ClerkManager />
      <ReportsChart />
    </div>
  );
}
