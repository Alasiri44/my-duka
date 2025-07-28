import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const BusinessSuppliersView = () => {
  const { businessId, business } = useOutletContext();
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({});
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!businessId) return;
    fetch(`http://localhost:5000/business/${businessId}/suppliers`)
      .then((res) => res.json())
      .then((data) => setSuppliers(data));
  }, [businessId]);

  const fieldList = [
    "name",
    "contact_name",
    "email",
    "phone_number",
    "country",
    "county",
    "location",
    "paybill_number",
    "till_number",
    "po_box",
    "postal_code",
  ];

  const handleAddSupplier = async () => {
    const payload = {
      ...newSupplier,
      business_id: businessId,
    };
    const res = await fetch("http://localhost:5000/supplier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const created = await res.json();
      setSuppliers((prev) => [...prev, created]);
      setNewSupplier({});
      setShowAddModal(false);
    }
  };

  const handleUpdateSupplier = async () => {
    const res = await fetch(
      `http://localhost:5000/supplier/${editingSupplier.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSupplier),
      }
    );
    if (res.ok) {
      const updated = await res.json();
      setSuppliers((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
      setEditingSupplier(null);
      setShowEditModal(false);
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (!window.confirm("Delete this supplier?")) return;
    await fetch(`http://localhost:5000/supplier/${id}`, { method: "DELETE" });
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] p-6 relative">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#011638]">Suppliers</h1>
          <p className="text-sm text-[#5e574d]">
            All vendors linked to <span className="font-medium">{business.name}</span>
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#011638] text-white px-4 py-2 text-sm rounded hover:bg-[#000f2a] transition"
        >
          + Add Supplier
        </button>
      </div>

      {/* Table View */}
      {suppliers.length === 0 ? (
        <p className="text-[#5e574d]">No suppliers found.</p>
      ) : (
        <div className="overflow-auto border border-[#f2f0ed] rounded-xl">
          <table className="w-full text-sm text-left min-w-[700px]">
            <thead className="bg-[#f2f0ed] text-[#011638]">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Contact</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Country</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id} className="border-t border-[#f2f0ed]">
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.contact_name || "—"}</td>
                  <td className="px-4 py-2">{s.email || "—"}</td>
                  <td className="px-4 py-2">{s.phone_number || "—"}</td>
                  <td className="px-4 py-2">{s.country || "—"}</td>
                  <td className="px-4 py-2 space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setEditingSupplier(s);
                        setShowEditModal(true);
                      }}
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl">
            <h2 className="text-lg font-bold text-[#011638] mb-4">Add Supplier</h2>
            <div className="grid grid-cols-2 gap-4">
              {fieldList.map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.replace("_", " ")}
                  value={newSupplier[field] || ""}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, [field]: e.target.value })
                  }
                  className="w-full border p-2 rounded text-sm"
                />
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setNewSupplier({});
                  setShowAddModal(false);
                }}
                className="text-sm text-[#5e574d]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSupplier}
                className="bg-[#011638] text-white px-4 py-2 rounded text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingSupplier && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl">
            <h2 className="text-lg font-bold text-[#011638] mb-4">Edit Supplier</h2>
            <div className="grid grid-cols-2 gap-4">
              {fieldList.map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.replace("_", " ")}
                  value={editingSupplier[field] || ""}
                  onChange={(e) =>
                    setEditingSupplier({
                      ...editingSupplier,
                      [field]: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded text-sm"
                />
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingSupplier(null);
                  setShowEditModal(false);
                }}
                className="text-sm text-[#5e574d]"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSupplier}
                className="bg-green-700 text-white px-4 py-2 rounded text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessSuppliersView;
