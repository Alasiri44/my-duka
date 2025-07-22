import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../../../components/merchant/Sidebar";

const BusinessLayout = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth); // pull role from Redux
  const [businesses, setBusinesses] = useState([]);
  const [currentBusiness, setCurrentBusiness] = useState(null);



  useEffect(() => {
    fetch("http://localhost:3000/businesses")
      .then((res) => res.json())
      .then((data) => {
        const list = data.map((b) => ({ ...b, id: Number(b.id) }));
        setBusinesses(list);
        const found = list.find((b) => b.id === Number(id));
        setCurrentBusiness(found);
      });
  }, [id]);



  if (!currentBusiness) {
    return (
      <div className="p-10 text-center text-[#5e574d] text-lg">Loading business...</div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar businesses={businesses} currentId={Number(id)} />
      <main className="flex-1 bg-[#fdfdfd] p-6 overflow-y-auto">
        <Outlet context={{ currentBusiness, role: user?.role }} /> {/*role passed to StoreLayout */}
      </main>
    </div>
  );
};

export default BusinessLayout;
