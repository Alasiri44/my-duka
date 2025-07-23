import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const BusinessSuppliersView = () => {
  const { currentBusiness } = useOutletContext();
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/suppliers")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data
          .map((s) => ({ ...s, id: Number(s.id), business_id: Number(s.business_id || 1) }))
          .filter((s) => s.business_id === currentBusiness.id);
        setSuppliers(filtered);
      });
  }, [currentBusiness.id]);

  const filteredSuppliers = suppliers.filter((s) => {
    const query = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      (s.email && s.email.toLowerCase().includes(query)) ||
      (s.phone && s.phone.includes(query))
    );
  });

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newSupplier = {
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
      business_id: currentBusiness.id,
      created_at: new Date().toISOString(),
    };

    const res = await fetch("http://localhost:3000/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSupplier),
    });

    if (res.ok) {
      const added = await res.json();
      setSuppliers((prev) => [...prev, added]);
      setShowAddModal(false);
    }
  };

  const handleUpdateSupplier = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updated = {
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
    };

    const res = await fetch(`http://localhost:3000/suppliers/${editingSupplier.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      const updatedSupplier = await res.json();
      setSuppliers((prev) =>
        prev.map((s) => (s.id === updatedSupplier.id ? updatedSupplier : s))
      );
      setEditingSupplier(null);
    }
  };

  const handleDeleteSupplier = async (supplierId) => {
    const confirmed = window.confirm("Are you sure you want to delete this supplier?");
    if (!confirmed) return;

    const res = await fetch(`http://localhost:3000/suppliers/${supplierId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setSuppliers((prev) => prev.filter((s) => s.id !== supplierId));
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] p-6 relative">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#011638]">Suppliers</h1>
          <p className="text-sm text-[#5e574d]">
            Contacts who supply stock to <span className="font-medium">{currentBusiness.name}</span>
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#011638] text-white px-4 py-2 text-sm rounded hover:bg-[#000f2a] transition"
        >
          + Add Supplier
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, phone, or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-[#d7d0c8] px-4 py-2 rounded text-sm w-full max-w-md"
        />
      </div>

      {/* Table */}
      {filteredSuppliers.length === 0 ? (
        <p className="text-[#5e574d]">No suppliers found.</p>
      ) : (
        <div className="overflow-auto border border-[#f2f0ed] rounded-xl">
          <table className="w-full text-sm text-left min-w-[600px]">
            <thead className="bg-[#f2f0ed] text-[#011638]">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Date Added</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((s) => (
                <tr key={s.id} className="border-t border-[#f2f0ed]">
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.phone || "—"}</td>
                  <td className="px-4 py-2">{s.email || "—"}</td>
                  <td className="px-4 py-2 text-[#5e574d] text-xs">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => setEditingSupplier(s)}
                      className="text-xs px-3 py-1 rounded border border-[#011638] text-[#011638] hover:bg-[#011638] hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSupplier(s.id)}
                      className="text-xs px-3 py-1 rounded bg-[#ec4e20] text-white"
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

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-lg font-bold text-[#011638] mb-4">Add Supplier</h2>
            <form onSubmit={handleAddSupplier}>
              <div className="space-y-3">
                <input name="name" required placeholder="Supplier Name" className="w-full border p-2 rounded" />
                <input name="phone" placeholder="Phone (optional)" className="w-full border p-2 rounded" />
                <input name="email" type="email" placeholder="Email (optional)" className="w-full border p-2 rounded" />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="text-sm text-[#5e574d]">Cancel</button>
                <button type="submit" className="bg-[#011638] text-white px-4 py-2 rounded text-sm">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Supplier Modal */}
      {editingSupplier && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-lg font-bold text-[#011638] mb-4">Edit Supplier</h2>
            <form onSubmit={handleUpdateSupplier}>
              <div className="space-y-3">
                <input
                  name="name"
                  defaultValue={editingSupplier.name}
                  required
                  placeholder="Supplier Name"
                  className="w-full border p-2 rounded"
                />
                <input
                  name="phone"
                  defaultValue={editingSupplier.phone}
                  placeholder="Phone"
                  className="w-full border p-2 rounded"
                />
                <input
                  name="email"
                  defaultValue={editingSupplier.email}
                  type="email"
                  placeholder="Email"
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingSupplier(null)} className="text-sm text-[#5e574d]">Cancel</button>
                <button type="submit" className="bg-[#011638] text-white px-4 py-2 rounded text-sm">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessSuppliersView;
