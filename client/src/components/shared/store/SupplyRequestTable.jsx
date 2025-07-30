import React from 'react';

const statusColors = {
  pending: 'text-yellow-600 bg-yellow-100',
  approved: 'text-green-600 bg-green-100',
  denied: 'text-red-600 bg-red-100',
};

const SupplyRequestTable = ({ requests, getProductName, getSupplierName, getRequesterName, onApprove, onDecline }) => {
  return (
    <div className="overflow-x-auto bg-white rounded shadow-md">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2">Supplier</th>
            <th className="px-4 py-2">Requester</th>
            <th className="px-4 py-2">Qty</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Note</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{getProductName(req.product_id)}</td>
              <td className="px-4 py-2">
                {(() => {
                  const name = getSupplierName ? getSupplierName(req.supplier_id) : null;
                  return name || '-';
                })()}
              </td>
              <td className="px-4 py-2">
                {(() => {
                  const name = getRequesterName ? getRequesterName(req) : null;
                  return name || '-';
                })()}
              </td>
              <td className="px-4 py-2">{req.quantity}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[req.status] || 'bg-gray-200 text-gray-700'}`}>
                  {req.status}
                </span>
              </td>
              <td className="px-4 py-2">{req.note || '-'}</td>
              <td className="px-4 py-2">{new Date(req.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-2 space-x-2">
                {req.status === 'waiting' && (
                  <>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                      onClick={() => onApprove && onApprove(req.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                      onClick={() => onDecline && onDecline(req.id)}
                    >
                      Decline
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplyRequestTable;
