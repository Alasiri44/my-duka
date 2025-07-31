import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import InviteStaffModal from "../../../components/merchant/staff/InviteStaffModal";
import StaffListPanel from "../../../components/merchant/staff/StaffListPanel";
import StaffDetailPanel from "../../../components/merchant/staff/StaffDetailPanel";
import axios from "@/utils/axiosConfig";

const StaffView = () => {
  const { storeId, role } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (storeId) {
      axios.get(`/stores/${storeId}/users`).then((res) => setUsers(res.data));
    }
  }, [storeId]);

  const inviteLabel = role === "merchant" ? "Store Admin" : "Store Clerk";
  const inviteRole = role === "merchant" ? "admin" : "clerk";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#011638]">Store Staff</h2>
        {role !== "clerk" && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#011638] text-white px-4 py-2 text-sm rounded hover:bg-[#000f2a]"
          >
            + Invite {inviteLabel}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StaffListPanel users={users} onSelect={setSelected} selectedId={selected?.id} />
        <StaffDetailPanel user={selected} role={role} />
      </div>

      {showModal && (
        <InviteStaffModal
          storeId={storeId}
          role={inviteRole}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default StaffView;