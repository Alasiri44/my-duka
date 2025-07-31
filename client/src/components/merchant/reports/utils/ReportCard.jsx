import React from "react";

const ReportCard = ({ title, value, icon = null }) => (
  <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
    {icon && <div className="text-blue-600 text-xl">{icon}</div>}
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default ReportCard;
