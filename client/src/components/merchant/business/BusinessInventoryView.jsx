import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "@/utils/axiosConfig"; 

const BusinessInventoryView = () => {
  const { business, stores } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStoreId, setFilterStoreId] = useState("");

  useEffect(() => {
    const url = filterStoreId
      ? `/store/${filterStoreId}/inventory`
      : `/business/${business.id}/inventory`;

    axios
      .get(url)
      .then((res) => {
        if (filterStoreId) {
          // enrich each item with category name
          const enrichWithCategory = async () => {
            const enriched = await Promise.all(
              res.data.map(async (item) => {
                try {
                  const categoryRes = await axios.get(`/category/${item.category_id}`);
                  return {
                    ...item,
                    category: {
                      id: item.category_id,
                      name: categoryRes.data.name,
                    },
                  };
                } catch {
                  return {
                    ...item,
                    category: {
                      id: item.category_id,
                      name: "Uncategorized",
                    },
                  };
                }
              })
            );
            setProducts(enriched);
          };
          enrichWithCategory();
        } else {
          setProducts(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch inventory data:", err);
      });
  }, [business.id, filterStoreId]);

  const filteredProducts = products.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "" || p.category?.name === filterCategory;
    return matchesName && matchesCategory;
  });

  const uniqueCategories = [...new Set(products.map((p) => p.category?.name))];

  return (
    <div className="min-h-screen bg-[#fdfdfd] p-6">
      <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#011638]">Inventory</h1>
          <p className="text-sm text-[#5e574d]">
            Products tracked under <span className="font-medium">{business.name}</span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select
          value={filterStoreId}
          onChange={(e) => setFilterStoreId(e.target.value)}
          className="border border-[#d7d0c8] px-3 py-2 rounded text-sm"
        >
          <option value="">All Stores</option>
          {stores.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
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
                <th className="px-4 py-2">Stock</th>
                <th className="px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id} className="border-t border-[#f2f0ed]">
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.category?.name || "Uncategorized"}</td>
                  <td className="px-4 py-2">{p.quantity_on_hand}</td>
                  <td className="px-4 py-2">{p.selling_price !== undefined ? `Ksh ${Number(p.selling_price).toFixed(2)}` : "N/A"}</td>
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