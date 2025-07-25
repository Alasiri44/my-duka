import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const BusinessStaffView = () => {
  const { currentBusiness } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filterRole, setFilterRole] = useState("");
  const [filterStoreId, setFilterStoreId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeTransferId, setActiveTransferId] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/users").then((res) => res.json()),
      fetch("http://localhost:3000/stores").then((res) => res.json()),
    ]).then(([userData, storeData]) => {
      const typedStores = storeData
        .map((s) => ({ ...s, id: Number(s.id), business_id: Number(s.business_id) }))
        .filter((s) => s.business_id === currentBusiness.id);

      const typedUsers = userData
        .map((u) => ({ ...u, id: Number(u.id), store_id: Number(u.store_id) }))
        .filter((u) => typedStores.some((s) => s.id === u.store_id));

      setStores(typedStores);
      setUsers(typedUsers);
    });
  }, [currentBusiness.id]);

  const handleToggleActive = async (user) => {
    const action = user.is_active ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} this staff member?`)) return;

    const updatedUser = { ...user, is_active: !user.is_active };

    await fetch(`http://localhost:3000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: updatedUser.is_active }),
    });

    setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
  };

  const handleTransfer = async (userId, newStoreId) => {
    if (!window.confirm("Are you sure you want to transfer this staff to another store?")) return;

    await fetch(`http://localhost:3000/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ store_id: Number(newStoreId) }),
    });

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, store_id: Number(newStoreId) } : u))
    );
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newUser = {
      first_name: form.first_name.value,
      last_name: form.last_name.value,
      email: form.email.value,
      role: form.role.value,
      store_id: Number(form.store_id.value),
      password_hash: "default123", // placeholder
      is_active: true,
      created_at: new Date().toISOString(),
    };

    const res = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (res.ok) {
      const added = await res.json();
      setUsers((prev) => [...prev, added]);
      setShowInviteModal(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      matchesSearch &&
      (filterRole === "" || u.role === filterRole) &&
      (filterStoreId === "" || u.store_id === Number(filterStoreId))
    );
  });

  return (
    <div className="min-h-screen bg-[#fdfdfd] p-6 relative">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#011638]">All Staff</h1>
          <p className="text-sm text-[#5e574d]">
            Across all stores under <span className="font-medium">{currentBusiness.name}</span>
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="bg-[#011638] text-white px-4 py-2 text-sm rounded hover:bg-[#000f2a] transition"
        >
          + Invite Staff
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-[#d7d0c8] px-3 py-2 rounded text-sm flex-1 min-w-[200px]"
        />

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

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border border-[#d7d0c8] px-3 py-2 rounded text-sm"
        >
          <option value="">All Roles</option>
          <option value="admin">Admins</option>
          <option value="clerk">Clerks</option>
        </select>
      </div>

      {/* Table View */}
      {filteredUsers.length === 0 ? (
        <p className="text-[#5e574d]">No staff match your filters.</p>
      ) : (
        <div className="overflow-auto border border-[#f2f0ed] rounded-xl">
          <table className="w-full text-sm text-left min-w-[600px]">
            <thead className="bg-[#f2f0ed] text-[#011638]">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Store</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const store = stores.find((s) => s.id === user.store_id);
                return (
                  <React.Fragment key={user.id}>
                    <tr className="border-t border-[#f2f0ed]">
                      <td className="px-4 py-2">{user.first_name} {user.last_name}</td>
                      <td className="px-4 py-2 text-[#5e574d]">{user.email}</td>
                      <td className="px-4 py-2 capitalize">{user.role}</td>
                      <td className="px-4 py-2">{store?.name || "—"}</td>
                      <td className="px-4 py-2 font-medium">
                        <span className={`text-xs px-2 py-1 rounded ${user.is_active ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}>
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-2 space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(user)}
                          className={`text-xs px-3 py-1 rounded ${user.is_active ? "bg-[#ec4e20] text-white" : "bg-[#011638] text-white"}`}
                        >
                          {user.is_active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => setActiveTransferId((prev) => (prev === user.id ? null : user.id))}
                          className="text-xs px-3 py-1 rounded border border-[#011638] text-[#011638] hover:bg-[#011638] hover:text-white"
                        >
                          Transfer
                        </button>
                      </td>
                    </tr>

                    {activeTransferId === user.id && (
                      <tr>
                        <td colSpan="6" className="px-4 py-2 bg-[#f9f9f9]">
                          <select
                            defaultValue=""
                            onChange={(e) => {
                              const newStoreId = e.target.value;
                              if (!newStoreId) return;
                              const targetStore = stores.find((s) => s.id === Number(newStoreId));
                              const confirmed = window.confirm(
                                `Transfer ${user.first_name} ${user.last_name} to ${targetStore?.name}?`
                              );
                              if (confirmed) {
                                handleTransfer(user.id, newStoreId);
                                setActiveTransferId(null);
                              }
                            }}
                            className="border border-[#d7d0c8] px-2 py-1 rounded text-sm"
                          >
                            <option value="" disabled>Select branch to transfer to</option>
                            {stores.filter((s) => s.id !== user.store_id).map((s) => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/40  flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-lg font-bold text-[#011638] mb-4">Invite Staff</h2>
            <form onSubmit={handleInviteSubmit}>
              <div className="space-y-3">
                <input name="first_name" required placeholder="First Name" className="w-full border p-2 rounded" />
                <input name="last_name" required placeholder="Last Name" className="w-full border p-2 rounded" />
                <input name="email" required type="email" placeholder="Email" className="w-full border p-2 rounded" />
                <select name="role" required className="w-full border p-2 rounded">
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="clerk">Clerk</option>
                </select>
                <select name="store_id" required className="w-full border p-2 rounded">
                  <option value="">Select Store</option>
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setShowInviteModal(false)} className="text-sm text-[#5e574d]">Cancel</button>
                <button type="submit" className="bg-[#011638] text-white px-4 py-2 rounded text-sm">Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessStaffView;
