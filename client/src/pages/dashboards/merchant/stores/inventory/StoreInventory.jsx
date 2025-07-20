import React, { useEffect, useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";

const StoreInventory = () => {
  const { store } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [entries, setEntries] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [sortByStock, setSortByStock] = useState(null); // "asc" | "desc"

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/products").then((res) => res.json()),
      fetch("http://localhost:3000/stock_entries").then((res) => res.json()),
      fetch("http://localhost:3000/users").then((res) => res.json()),
      fetch("http://localhost:3000/categories").then((res) => res.json()),
    ]).then(([productData, entryData, userData, categoryData]) => {
      setProducts(
        productData.map((p) => ({
          ...p,
          id: Number(p.id),
          category_id: Number(p.category_id),
        }))
      );
      setEntries(
        entryData.map((e) => ({
          ...e,
          product_id: Number(e.product_id),
          clerk_id: Number(e.clerk_id),
          quantity_received: Number(e.quantity_received),
        }))
      );
      setUsers(
        userData.map((u) => ({
          ...u,
          id: Number(u.id),
          store_id: Number(u.store_id),
        }))
      );
      setCategories(categoryData.map((c) => ({ ...c, id: Number(c.id) })));
    });
  }, [store.id]);

  const clerkIds = useMemo(() => {
    return users.filter((u) => u.store_id === Number(store.id)).map((u) => u.id);
  }, [users, store.id]);

  const storeEntries = useMemo(() => {
    return entries.filter((e) => clerkIds.includes(e.clerk_id));
  }, [entries, clerkIds]);

  const productMap = useMemo(() => {
    const relevantProductIds = [...new Set(storeEntries.map((e) => e.product_id))];
    return products.filter((p) => relevantProductIds.includes(p.id));
  }, [products, storeEntries]);

  const productStats = useMemo(() => {
    const map = {};
    storeEntries.forEach((e) => {
      if (!map[e.product_id]) map[e.product_id] = 0;
      map[e.product_id] += e.quantity_received;
    });
    return map;
  }, [storeEntries]);

  const getCategoryName = (id) => {
    return categories.find((c) => c.id === id)?.name || "Uncategorized";
  };

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase();
    let result = productMap.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        getCategoryName(p.category_id).toLowerCase().includes(query)
    );

    if (sortByStock === "asc") {
      result = result.sort(
        (a, b) => (productStats[a.id] || 0) - (productStats[b.id] || 0)
      );
    } else if (sortByStock === "desc") {
      result = result.sort(
        (a, b) => (productStats[b.id] || 0) - (productStats[a.id] || 0)
      );
    }

    return result;
  }, [productMap, productStats, search, sortByStock, categories]);

  return (
   <div className="bg-white p-6 rounded-xl border border-[#f2f0ed] shadow-sm">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
    <input
      type="text"
      placeholder="Search by name or category..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border border-[#d7d0c8] px-3 py-2 rounded w-full sm:w-64 text-sm"
    />
    <div className="flex items-center gap-2">
      <label className="text-sm text-[#5e574d]">Sort by Stock:</label>
      <select
        value={sortByStock || ""}
        onChange={(e) => setSortByStock(e.target.value || null)}
        className="border border-[#d7d0c8] px-2 py-1 rounded text-sm"
      >
        <option value="">None</option>
        <option value="asc">Low → High</option>
        <option value="desc">High → Low</option>
      </select>
    </div>
  </div>

  <div className="flex justify-between items-center mb-4">
  <h2 className="text-lg font-semibold text-[#011638]">Inventory</h2>
  <button className="px-3 py-2 bg-[#011638] text-white text-sm rounded hover:bg-[#000f2a]">
    Export CSV
  </button>
</div>

<div className="overflow-x-auto border border-[#d7d0c8] rounded-lg max-h-[500px]">
  <table className="w-full text-sm border-separate border-spacing-0">
    <thead className="sticky top-0 bg-[#f2f0ed] text-[#011638] shadow-sm z-10">
      <tr>
        <th className="text-left px-3 py-2 border-b border-[#d7d0c8]">Name</th>
        <th className="text-left px-3 py-2 border-b border-[#d7d0c8]">Category</th>
        <th className="text-left px-3 py-2 border-b border-[#d7d0c8]">Description</th>
        <th className="text-left px-3 py-2 border-b border-[#d7d0c8]">Unit Cost (KES)</th>
        <th className="text-left px-3 py-2 border-b border-[#d7d0c8]">Quantity on Hand</th>
      </tr>
    </thead>
    <tbody>
      {filteredProducts.length === 0 ? (
        <tr>
          <td colSpan="5" className="text-center text-[#5e574d] py-10">
            <p className="text-sm">No matching products in this store.</p>
            <p className="text-xs text-[#999] mt-1">Try changing the search or sorting options.</p>
          </td>
        </tr>
      ) : (
        filteredProducts.map((product) => {
          const stock = productStats[product.id] || 0;

          return (
            <tr
  key={product.id}
  className="border-t border-[#f2f0ed] even:bg-[#f9f9f9] odd:bg-white hover:bg-[#f2f2f2] transition"
>
              <td className="px-3 py-2">{product.name}</td>
              <td className="px-3 py-2">{getCategoryName(product.category_id)}</td>
              <td className="px-3 py-2">{product.description || "—"}</td>
              <td className="px-3 py-2">
                KES {Number(product.selling_price).toFixed(2)}
              </td>
              <td className="px-3 py-2">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    stock === 0
                      ? "bg-red-100 text-red-700"
                      : stock < 10
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {stock}
                </span>
              </td>
            </tr>
          );
        })
      )}
    </tbody>
  </table>
</div>

</div>

  );
};

export default StoreInventory;
