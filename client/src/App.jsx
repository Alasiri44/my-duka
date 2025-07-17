import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import SupplyRequestTable from './components/admin/SupplyRequestTable';
import ClerkManager from './components/admin/ClerkManager';


import ReportsChart from './components/admin/ReportsChart';

function App() {
  return (
    <div className="App">
      <h1> MyDuka Admin Dashboard</h1>

      {/* Navigation */}
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/admin/requests">Supply Requests</Link> |{' '}
        <Link to="/admin/clerks">Clerk Manager</Link> |{' '}
        <Link to="/admin/reports">Reports</Link>
      </nav>

      {/* Routes  */}
      <Routes>
        <Route path="/" element={<p>Welcome to the admin dashboard 👋</p>} />
        <Route path="/admin/requests" element={<SupplyRequestTable />} />
        <Route path="/admin/clerks" element={<ClerkManager />} />
        <Route path="/admin/reports" element={<ReportsChart />} />
      </Routes>
    </div>
  );
}

export default App;
