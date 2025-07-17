import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import SupplyRequestTable from './components/admin/SupplyRequestTable';
import ClerkManager from './pages/dashboards/admin';
import AdminHome from './pages/dashboards/admin';


// import ReportsChart from './components/admin/ReportsChart';

function App() {
  const user = {
    name: "Test",
    role: "admin"
  }
  return (
    <div className="App">
      <h1>My Duka Dashboard</h1>

      {/* Navigation */}
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/admin/requests">Supply Requests</Link> |{' '}
        <Link to="/admin/clerks">Clerk Manager</Link> |{' '}
        <Link to="/admin/reports">Reports</Link>
      </nav>

      {/* Routes  */}
      <Routes >
        <Route path="/" element={<p>Welcome to the My Duka 👋</p>} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/suplly_requeuets" element={<AdminHome />} />
        <Route path="/admin/requests" element={<SupplyRequestTable />} />
        <Route path="/admin/clerks" element={<ClerkManager />} />
        {/* <Route path="/admin/reports" element={<ReportsChart />} /> */}
      </Routes>
    </div>
  );
}

export default App;
