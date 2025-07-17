// /pages/business/Overview.jsx
import React from "react";
import { useOutletContext } from "react-router-dom";

const BusinessOverview = () => {
  const { currentBusiness } = useOutletContext();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#011638] mb-2">Business Overview</h1>
      <p className="text-[#5e574d]">Welcome to {currentBusiness.name}'s dashboard.</p>
    </div>
  );
};

export default BusinessOverview;
