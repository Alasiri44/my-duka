import React from "react";

const NoDataFallback = ({ message = "No data available." }) => (
  <div className="text-center text-gray-500 py-6">
    <p>{message}</p>
  </div>
);

export default NoDataFallback;
