import React from "react";

const UserActivityTable = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-left text-gray-600">User</th>
            <th className="py-2 px-4 border-b text-left text-gray-600">Email</th>
            <th className="py-2 px-4 border-b text-left text-gray-600">Role</th>
            <th className="py-2 px-4 border-b text-left text-gray-600">Created At</th>
            <th className="py-2 px-4 border-b text-left text-gray-600">Entries Made</th>
            <th className="py-2 px-4 border-b text-left text-gray-600">Exits Made</th>
            <th className="py-2 px-4 border-b text-left text-gray-600">Requests Made</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="py-2 px-4 border-b">{row.user || "N/A"}</td>
              <td className="py-2 px-4 border-b">{row.email || "N/A"}</td>
              <td className="py-2 px-4 border-b">{row.role || "N/A"}</td>
              <td className="py-2 px-4 border-b">{row.created_at || "N/A"}</td>
              <td className="py-2 px-4 border-b">{row.entries_made || 0}</td>
              <td className="py-2 px-4 border-b">{row.exits_made || 0}</td>
              <td className="py-2 px-4 border-b">{row.requests_made || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserActivityTable;