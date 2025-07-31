import React, { useState } from "react";
import axios from "@/utils/axiosConfig"; 

const InviteStaffModal = ({ storeId, role = "admin", onClose }) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await axios.post("/user", {
        ...form,
        store_id: Number(storeId),
        role,
        is_active: true,
      });

      if (res.status !== 200 && res.status !== 201) throw new Error("Failed to invite user");
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold text-[#011638] mb-4">
          Invite Store {role === "admin" ? "Admin" : "Clerk"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            required
            className="w-full border border-[#d7d0c8] p-2 rounded text-sm"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            required
            className="w-full border border-[#d7d0c8] p-2 rounded text-sm"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-[#d7d0c8] p-2 rounded text-sm"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm px-4 py-2 rounded border border-[#5e574d] text-[#011638] hover:bg-[#f2f0ed]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#011638] text-white text-sm px-4 py-2 rounded hover:bg-[#000f2a] disabled:opacity-50"
            >
              {submitting ? "Inviting..." : "Send Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteStaffModal;