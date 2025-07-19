import React from "react";

const RecentActivity = ({ activities }) => {
  return (
    <div className="bg-[#f2f0ed] border border-[#5e574d] rounded-xl p-6">
      <h2 className="text-lg font-semibold text-[#011638] mb-4">Recent Activity</h2>
      {activities.length === 0 ? (
        <p className="text-sm text-[#999999]">No recent activity found.</p>
      ) : (
        <ul className="space-y-3">
          {activities.map((activity, idx) => (
            <li
              key={idx}
              className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#ec4e20] hover:bg-[#fdfafa] transition"
            >
              <div className="text-[#5e574d] font-medium">{activity.message}</div>
              <div className="text-xs text-[#999999] mt-1">
                {new Date(activity.timestamp).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivity;
