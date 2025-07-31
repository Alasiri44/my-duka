import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "@/utils/axiosConfig";

const AddBusinessModal = ({ onClose, onBusinessAdded }) => {
  const { user } = useSelector((state) => state.auth);
  const merchantId = user.id;

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    country: "",
    po_box: "",
    postal_code: "",
    county: "",
    location: "",
    merchant_id: merchantId,
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Basic client-side validation
    if (!formData.name || !formData.industry || !formData.country) {
      setError("Please fill in all required fields (Name, Industry, Country)");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post("/business", formData);
      onBusinessAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create business");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4 md:mx-0">
        <h2 className="text-lg font-semibold text-[#011638] mb-4">Add New Business</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#5e574d] mb-1" htmlFor="name">
              Business Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-[#d7d0c8] rounded text-sm text-[#011638] focus:outline-none focus:ring-2 focus:ring-[#011638]"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#5e574d] mb-1" htmlFor="industry">
              Industry <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className="w-full p-2 border border-[#d7d0c8] rounded text-sm text-[#011638] focus:outline-none focus:ring-2 focus:ring-[#011638]"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#5e574d] mb-1" htmlFor="country">
              Country <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full p-2 border border-[#d7d0c8] rounded text-sm text-[#011638] focus:outline-none focus:ring-2 focus:ring-[#011638]"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#5e574d] mb-1" htmlFor="po_box">
              PO Box
            </label>
            <input
              type="text"
              id="po_box"
              name="po_box"
              value={formData.po_box}
              onChange={handleInputChange}
              className="w-full p-2 border border-[#d7d0c8] rounded text-sm text-[#011638] focus:outline-none focus:ring-2 focus:ring-[#011638]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#5e574d] mb-1" htmlFor="postal_code">
              Postal Code
            </label>
            <input
              type="text"
              id="postal_code"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleInputChange}
              className="w-full p-2 border border-[#d7d0c8] rounded text-sm text-[#011638] focus:outline-none focus:ring-2 focus:ring-[#011638]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#5e574d] mb-1" htmlFor="county">
              County
            </label>
            <input
              type="text"
              id="county"
              name="county"
              value={formData.county}
              onChange={handleInputChange}
              className="w-full p-2 border border-[#d7d0c8] rounded text-sm text-[#011638] focus:outline-none focus:ring-2 focus:ring-[#011638]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#5e574d] mb-1" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-2 border border-[#d7d0c8] rounded text-sm text-[#011638] focus:outline-none focus:ring-2 focus:ring-[#011638]"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#5e574d] border border-[#d7d0c8] rounded hover:bg-[#f2f0ed]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm text-white bg-[#011638] rounded hover:bg-[#000f2a] ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Business"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBusinessModal;