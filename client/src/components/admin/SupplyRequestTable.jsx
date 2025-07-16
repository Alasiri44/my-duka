import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSupplyRequests, updateRequestStatus } from '../../store/supplyRequestsSlice';


const SupplyRequestTable = () => {
  const dispatch = useDispatch();
  const { list: requests, status } = useSelector((state) => state.supplyRequests);


  useEffect(() => {
    dispatch(fetchSupplyRequests());
  }, [dispatch]);

  
  const handleAction = (id, action) => {
    dispatch(updateRequestStatus({ id, status: action }));
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (requests.length === 0) return <p>No supply requests found.</p>;

  return (
    <div>
      <h2>Supply Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Requested By</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.product_name}</td>
              <td>{req.quantity_requested}</td>
              <td>{req.clerk_name}</td>
              <td>{req.status}</td>
              <td>
                {req.status === 'pending' ? (
                  <>
                    <button onClick={() => handleAction(req.id, 'approved')}>Approve</button>
                    <button onClick={() => handleAction(req.id, 'declined')}>Decline</button>
                  </>
                ) : (
                  <span>{req.status}</span>
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
