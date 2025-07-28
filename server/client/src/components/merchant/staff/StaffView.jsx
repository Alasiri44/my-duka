import React, { useEffect, useState } from "react";
import InviteStaffModal from "../../../components/merchant/staff/InviteStaffModal";
import StaffListPanel from "../../../components/merchant/staff/StaffListPanel";
import StaffDetailPanel from "../../../components/merchant/staff/StaffDetailPanel";
import { useOutletContext } from "react-router-dom";

const StaffView = () => {
  const { storeId } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((data) =>
        setUsers(data.filter((u) => Number(u.store_id) === Number(storeId)))
      );
  }, [storeId]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#011638]">Store Staff</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#011638] text-white px-4 py-2 text-sm rounded hover:bg-[#000f2a]"
        >
          + Invite Store Admin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StaffListPanel users={users} onSelect={setSelected} selectedId={selected?.id} />
        <StaffDetailPanel user={selected} />
      </div>

      {showModal && <InviteStaffModal storeId={storeId} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default StaffView;
