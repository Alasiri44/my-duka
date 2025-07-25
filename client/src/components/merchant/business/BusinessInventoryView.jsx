import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const BusinessInventoryView = () => {
  const { currentBusiness } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [stockEntries, setStockEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/products").then((res) => res.json()),
      fetch("http://localhost:3000/stock_entries").then((res) => res.json()),
    ]).then(([productData, entryData]) => {
      const typedProducts = productData.map((p) => ({
        ...p,
        id: Number(p.id),
        business_id: Number(p.business_id || 1), // placeholder
      }));

      const typedEntries = entryData.map((e) => ({
        ...e,
        id: Number(e.id),
        product_id: Number(e.product_id),
        quantity: Number(e.quantity),
      }));

      const businessProducts = typedProducts.filter(
        (p) => p.business_id === currentBusiness.id
      );

      setProducts(businessProducts);
      setStockEntries(typedEntries);
    });
  }, [currentBusiness.id]);

  const getProductStock = (productId) => {
    return stockEntries
      .filter((entry) => entry.product_id === productId)
      .reduce((sum, e) => sum + e.quantity, 0);
  };

  const filteredProducts = products.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "" || p.category === filterCategory;
    return matchesName && matchesCategory;
  });

  const uniqueCategories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-[#fdfdfd] p-6">
      <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#011638]">Inventory</h1>
          <p className="text-sm text-[#5e574d]">
            Products tracked under <span className="font-medium">{currentBusiness.name}</span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search product name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-[#d7d0c8] px-3 py-2 rounded text-sm flex-1 min-w-[200px]"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-[#d7d0c8] px-3 py-2 rounded text-sm"
        >
          <option value="">All Categories</option>
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {filteredProducts.length === 0 ? (
        <p className="text-[#5e574d]">No products match your filters.</p>
      ) : (
        <div className="overflow-auto border border-[#f2f0ed] rounded-xl">
          <table className="w-full text-sm text-left min-w-[600px]">
            <thead className="bg-[#f2f0ed] text-[#011638]">
              <tr>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Unit</th>
                <th className="px-4 py-2">Total Stock</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id} className="border-t border-[#f2f0ed]">
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.category}</td>
                  <td className="px-4 py-2">{p.unit}</td>
                  <td className="px-4 py-2 font-semibold text-[#011638]">{getProductStock(p.id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BusinessInventoryView;
