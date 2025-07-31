import React, { useEffect, useState } from 'react';
import AddClerk from '../../pages/dashboards/admin/AddClerk'; 
import { useSelector, useDispatch } from 'react-redux';
import {fetchClerks, deleteClerk, deactivateClerk,} from '../../store/clerksSlice';

const ClerkManager = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false); 
  const { list: clerks, status } = useSelector((state) => state.clerks);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchClerks());
  }, [dispatch]);

  const currentStoreId = user?.store_id;

  const filteredClerks = clerks.filter(
    (u) => u.store_id === currentStoreId
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this clerk?')) {
      dispatch(deleteClerk(id));
    }
  };

  const handleDeactivate = (id) => {
    dispatch(deactivateClerk(id));
  };

  if (status === 'loading') return <p>Loading clerks...</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Clerk Manager</h2>

      <button
        onClick={() => setShowForm((prev) => !prev)}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        {showForm ? 'Close Form' : '+ Add Clerk'}
      </button>

      {showForm && (
        <AddClerk
          onClerkAdded={() => {
            dispatch(fetchClerks());
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}

      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClerks.map((clerk) => (
            <tr key={clerk.id} className="border-t">
              <td className="p-2">{clerk.first_name} {clerk.last_name}</td>
              <td className="p-2">{clerk.email}</td>
              <td className="p-2">{clerk.is_active ? 'Active' : 'Inactive'}</td>
              <td className="p-2 flex gap-2">
                {clerk.is_active && (
                  <button
                    onClick={() => handleDeactivate(clerk.id)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                  >
                    Deactivate
                  </button>
                )}
                <button
                  onClick={() => handleDelete(clerk.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClerkManager;
