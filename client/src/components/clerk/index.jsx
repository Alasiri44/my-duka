import React, { useEffect, useState } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";

const ClerkLayout = () => {
  const { id } = useParams();
  const [businesses, setBusinesses] = useState([]);
  const [currentBusiness, setCurrentBusiness] = useState(null);
    const { user, store } = useSelector((state) => state.auth);


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

  // if (!currentBusiness) {
  //   return (
  //     <div className="p-10 text-center text-[#5e574d] text-lg">Loading business...</div>
  //   );
  // }

  return (
    <div className="flex h-screen overflow-hidden">
       <Sidebar user={user} store={store} businesses={businesses} currentId={Number(id)} />
      <main className="flex-1 bg-[#fdfdfd] p-6 overflow-y-auto">
        {/* <Outlet context={{ currentBusiness }} /> */}
        <Outlet />
      </main>
    </div>
  );
};

export default ClerkLayout;
