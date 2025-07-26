import React, { useEffect, useState } from "react";
import StaffImage from "../../../assets/StaffImage.svg";

const StaffDetailPanel = ({ user,role }) => {
  const [stats, setStats] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/users/${user.id}/stats`)
        .then((res) => res.json())
        .then(setStats);

      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone_number || "",
        role: user.role
      });
    }
  }, [user]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    fetch(`http://localhost:5000/user/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone,
      }),
    })
      .then((res) => res.json())
      .then(() => setShowEditModal(false));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-[#f2f0ed] rounded-xl border border-[#f2f0ed]">
        <img src={StaffImage} alt="No staff selected" className="w-60 h-60" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-6 rounded-xl border border-[#f2f0ed] shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={StaffImage}
            alt="Staff"
            className="w-20 h-20 rounded-full border border-[#d7d0c8]"
          />
          <div>
            <h3 className="text-lg font-semibold text-[#011638]">
              {user.first_name} {user.last_name}
            </h3>
            <p className="text-sm text-[#5e574d]">{user.email}</p>
            <p className="text-sm text-[#5e574d]">Phone: <span className="text-[#011638]">{user.phone_number || "N/A"}</span></p>
            <p className="text-sm text-[#5e574d] capitalize">Role: {user.role}</p>
            <p className="text-xs text-[#999999]">
              Joined on {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {stats ? (
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            {user.role === "clerk" && (
              <>
                <div>
                  <p className="text-[#5e574d]">Stock Entries</p>
                  <p className="font-medium text-[#011638]">{stats.entries}</p>
                </div>
                <div>
                  <p className="text-[#5e574d]">Stock Exits</p>
                  <p className="font-medium text-[#011638]">{stats.exits}</p>
                </div>
                <div>
                  <p className="text-[#5e574d]">Requests Made</p>
                  <p className="font-medium text-[#011638]">{stats.requests}</p>
                </div>
              </>
            )}
            <div>
              <p className="text-[#5e574d]">Approved Requests</p>
              <p className="font-medium text-[#011638]">{stats.approved}</p>
            </div>
            {user.role === "admin" && (
              <div>
                <p className="text-[#5e574d]">Clerks Supervised</p>
                <p className="font-medium text-[#011638]">{stats.supervised}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-[#5e574d]">Loading stats...</p>
        )}

 <div className="flex gap-2">
  {/* Deactivate */}
  {(role === "merchant" || (role === "admin" && user.role === "clerk")) && (
    <button className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
      Deactivate
    </button>
  )}

  {/* Remove */}
  {role === "merchant" && (
    <button className="px-4 py-2 text-sm border border-[#5e574d] text-[#011638] rounded hover:bg-[#f2f0ed]">
      Remove
    </button>
  )}

  {/* Edit - everyone can edit */}
  <button
    onClick={() => setShowEditModal(true)}
    className="px-4 py-2 text-sm border border-[#011638] text-[#011638] rounded hover:bg-[#f2f0ed]"
  >
    Edit
  </button>
</div>

      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold text-[#011638]">Edit Staff Info</h2>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-[#5e574d]">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2 text-[#011638]"
                />
              </div>
              <div>
                <label className="block text-[#5e574d]">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2 text-[#011638]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[#5e574d]">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full border rounded p-2 bg-[#f2f0ed] text-[#999]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[#5e574d]">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2 text-[#011638]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[#5e574d]">Role</label>
                <input
                  type="text"
                  value={formData.role}
                  disabled
                  className="w-full border rounded p-2 bg-[#f2f0ed] text-[#999]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm text-[#5e574d] border border-[#d7d0c8] rounded hover:bg-[#f2f0ed]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm text-white bg-[#011638] rounded hover:bg-[#000f2a]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StaffDetailPanel;
