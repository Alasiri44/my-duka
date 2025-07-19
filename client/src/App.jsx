<<<<<<< HEAD
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
=======
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/dashboards/clerk/ClerkDash'
import Inventory from './pages/dashboards/clerk/Inventory'
import ProductDetail from './pages/dashboards/clerk/ProductDetail'
import AddProduct from './pages/dashboards/clerk/AddProduct'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory/:productId" element={<ProductDetail />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="*" element={<h1 className="text-center text-xl mt-10">404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  )
>>>>>>> b13f461e65b6ffb4cdcff93a7bc231f65e4747dd
}
