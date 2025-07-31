import React, { useState } from "react";
import axios from "@/utils/axiosConfig";

const CreateStoreModal = ({ isOpen, onClose, businessId, onStoreCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    po_box: "",
    postal_code: "",
    county: "",
    location: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("/store", {
        ...formData,
        business_id: businessId,
      });
      onStoreCreated(response.data); 
      setFormData({
        name: "",
        country: "",
        po_box: "",
        postal_code: "",
        county: "",
        location: "",
      });
      onClose(); // Close the modal
    } catch (err) {
      setError("Failed to create store. Please try again.");
      console.error("Error creating store:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-[#011638] mb-4">Add New Store</h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#5e574d] mb-1">Store Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#d7d0c8] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#ec4e20]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#5e574d] mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#d7d0c8] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#ec4e20]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#5e574d] mb-1">PO Box</label>
            <input
              type="text"
              name="po_box"
              value={formData.po_box}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#d7d0c8] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#ec4e20]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#5e574d] mb-1">Postal Code</label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#d7d0c8] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#ec4e20]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#5e574d] mb-1">County</label>
            <input
              type="text"
              name="county"
              value={formData.county}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#d7d0c8] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#ec4e20]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#5e574d] mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#d7d0c8] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#ec4e20]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#5e574d] bg-[#f2f0ed] rounded hover:bg-[#e0dedc]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm text-white bg-[#011638] rounded hover:bg-[#000f2a] disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Store"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStoreModal;