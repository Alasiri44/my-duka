import React, { useEffect, useState, useCallback } from "react";
import axios from "@/utils/axiosConfig";
import { useOutletContext } from "react-router-dom";

const BusinessProductsView = () => {
  const { businessId, business } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productForm, setProductForm] = useState({ name: "", category_id: "", description: "", selling_price: "" });
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [activeTab, setActiveTab] = useState("products");
  const [isFormExpanded, setIsFormExpanded] = useState(true);
  const [productCategoryFilter, setProductCategoryFilter] = useState("");
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY === 0) {
      setShowHeader(true); // Show header at the top
    } else if (currentScrollY > lastScrollY) {
      setShowHeader(false); // Hide header when scrolling down
    } else if (currentScrollY < lastScrollY) {
      setShowHeader(true); // Show header when scrolling up
    }
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    fetchAll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, businessId]);

  const fetchAll = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        axios.get("/product"),
        axios.get("/category"),
      ]);
      setProducts(pRes.data);
      setCategories(cRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch products or categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductChange = (e) => setProductForm({ ...productForm, [e.target.name]: e.target.value });
  const handleCategoryChange = (e) => setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.category_id || !productForm.selling_price) {
      alert("Please fill all required fields");
      return;
    }
    if (isNaN(productForm.selling_price) || Number(productForm.selling_price) <= 0) {
      alert("Selling price must be a valid positive number");
      return;
    }
    try {
      await axios.post("/product", { ...productForm, quantity: 0 });
      setProductForm({ name: "", category_id: "", description: "", selling_price: "" });
      fetchAll();
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Please try again.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await axios.delete(`/product/${id}`);
        fetchAll();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name) {
      alert("Category name is required");
      return;
    }
    try {
      if (editingCategoryId) {
        await axios.patch(`/category/${editingCategoryId}`, categoryForm);
      } else {
        await axios.post("/category", {
          ...categoryForm,
          business_id: businessId,
        });
      }
      setCategoryForm({ name: "", description: "" });
      setEditingCategoryId(null);
      fetchAll();
    } catch (error) {
      console.error("Error creating/updating category:", error);
      alert("Failed to create/update category. Please try again.");
    }
  };

  const handleEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setCategoryForm({ name: cat.name, description: cat.description });
    setActiveTab("categories");
    setIsFormExpanded(true); // Expand form when editing
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Delete this category?")) {
      try {
        await axios.delete(`/category/${id}`);
        fetchAll();
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category. Please try again.");
      }
    }
  };

  const filteredProducts = products.filter(
    (prod) => !productCategoryFilter || prod.category_id === Number(productCategoryFilter)
  );

  return (
    <div className="min-h-screen bg-[#fdfdfd] relative">
      {showHeader && (
        <div className="sticky top-0 bg-[#fdfdfd] z-10 shadow-sm p-6 transition-all duration-300">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#011638]">Product Catalog</h1>
              <p className="text-sm text-[#5e574d]">
                Manage your products and categories under <span className="font-medium">{business?.name}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("products")}
                className={`px-4 py-2 rounded text-sm ${activeTab === "products" ? "bg-[#011638] text-white" : "bg-gray-200 text-[#011638]"}`}
                aria-selected={activeTab === "products"}
                aria-label="View Products"
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={`px-4 py-2 rounded text-sm ${activeTab === "categories" ? "bg-[#011638] text-white" : "bg-gray-200 text-[#011638]"}`}
                aria-selected={activeTab === "categories"}
                aria-label="View Categories"
              >
                Categories
              </button>
              <button
                onClick={() => setIsFormExpanded(prev => !prev)}
                className="text-sm text-[#011638] underline"
                aria-label={isFormExpanded ? "Collapse Form" : "Expand Form"}
              >
                {isFormExpanded ? "Collapse Form" : "Expand Form"}
              </button>
            </div>
          </div>
          <div
            className={`mt-4 max-w-md overflow-hidden transition-all duration-300 ease-in-out ${
              isFormExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {activeTab === "products" ? (
              <form onSubmit={handleCreateProduct} className="space-y-3 bg-white shadow-md p-4 rounded">
                <h3 className="font-medium text-[#011638]">Add New Product</h3>
                <input
                  name="name"
                  placeholder="Product Name"
                  value={productForm.name}
                  onChange={handleProductChange}
                  required
                  className="w-full border p-2 rounded"
                  aria-label="Product Name"
                />
                <select
                  name="category_id"
                  value={productForm.category_id}
                  onChange={handleProductChange}
                  required
                  className="w-full border p-2 rounded"
                  aria-label="Product Category"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <input
                  name="description"
                  placeholder="Description"
                  value={productForm.description}
                  onChange={handleProductChange}
                  className="w-full border p-2 rounded"
                  aria-label="Product Description"
                />
                <input
                  name="selling_price"
                  type="number"
                  placeholder="Selling Price"
                  value={productForm.selling_price}
                  onChange={handleProductChange}
                  required
                  className="w-full border p-2 rounded"
                  aria-label="Product Selling Price"
                />
                <button
                  type="submit"
                  className="bg-[#011638] text-white px-4 py-2 rounded hover:bg-[#002855]"
                  disabled={isLoading}
                >
                  Add Product
                </button>
              </form>
            ) : (
              <form onSubmit={handleCreateCategory} className="space-y-3 bg-white shadow-md p-4 rounded">
                <h3 className="font-medium text-[#011638]">{editingCategoryId ? "Edit Category" : "Add New Category"}</h3>
                <input
                  name="name"
                  placeholder="Category Name"
                  value={categoryForm.name}
                  onChange={handleCategoryChange}
                  required
                  className="w-full border p-2 rounded"
                  aria-label="Category Name"
                />
                <input
                  name="description"
                  placeholder="Description"
                  value={categoryForm.description}
                  onChange={handleCategoryChange}
                  className="w-full border p-2 rounded"
                  aria-label="Category Description"
                />
                <button
                  type="submit"
                  className="bg-[#011638] text-white px-4 py-2 rounded hover:bg-[#002855]"
                  disabled={isLoading}
                >
                  {editingCategoryId ? "Update Category" : "Add Category"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="p-6">
        {activeTab === "products" && (
          <>
            <div className="mb-4">
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="border border-[#d7d0c8] px-3 py-2 rounded text-sm"
                aria-label="Filter Products by Category"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="overflow-auto border border-[#f2f0ed] rounded-xl">
              <table className="w-full text-sm text-left min-w-[600px]">
                <thead className="bg-[#f2f0ed] text-[#011638]">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="border-t border-[#f2f0ed]">
                      <td className="px-4 py-2">{prod.name}</td>
                      <td className="px-4 py-2">{prod.category?.name || "—"}</td>
                      <td className="px-4 py-2">Ksh {prod.selling_price}</td>
                      <td className="px-4 py-2">{prod.description}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="text-red-600 text-sm hover:underline"
                          aria-label={`Delete product ${prod.name}`}
                          disabled={isLoading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "categories" && (
          <div className="overflow-auto border border-[#f2f0ed] rounded-xl">
            <table className="w-full text-sm text-left min-w-[600px]">
              <thead className="bg-[#f2f0ed] text-[#011638]">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-t border-[#f2f0ed]">
                    <td className="px-4 py-2">{cat.name}</td>
                    <td className="px-4 py-2">{cat.description}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEditCategory(cat)}
                        className="text-blue-600 text-sm hover:underline"
                        aria-label={`Edit category ${cat.name}`}
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-red-600 text-sm hover:underline"
                        aria-label={`Delete category ${cat.name}`}
                        disabled={isLoading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessProductsView;