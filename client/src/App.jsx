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
}
