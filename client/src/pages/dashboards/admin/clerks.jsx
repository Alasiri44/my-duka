import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchClerks,
  deactivateClerk,
  deleteClerk,
  addClerk
} from '../../store/clerksSlice';
import axios from 'axios';

const Clerks = () => {
  const dispatch = useDispatch();
  const { list: clerks, status } = useSelector((state) => state.clerks);
  const [storeMap, setStoreMap] = useState({});
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    store_id: '',
    password_hash: '',
    role: 'clerk',
    is_active: true
  });

  useEffect(() => {
    dispatch(fetchClerks());
    axios.get('http://localhost:3001/stores').then((res) => {
      const map = {};
      res.data.forEach((store) => {
        map[store.id] = store.name;
      });
      setStoreMap(map);
    });
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addClerk({ ...formData, store_id: parseInt(formData.store_id) }));
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      store_id: '',
      password_hash: '',
      role: 'clerk',
      is_active: true
    });
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Add New Clerk</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
          required
        />
        <select
          name="store_id"
          value={formData.store_id}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Store</option>
          {Object.entries(storeMap).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
        <input
          type="password"
          name="password_hash"
          placeholder="Password"
          value={formData.password_hash}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Clerk
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Clerk List</h2>
      {status === 'loading' ? (
        <p className="text-gray-500">Loading clerks...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Store</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clerks.map((clerk) => (
                <tr key={clerk.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{clerk.first_name} {clerk.last_name}</td>
                  <td className="px-4 py-2">{clerk.email}</td>
                  <td className="px-4 py-2">{storeMap[clerk.store_id] || 'Unknown'}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${clerk.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {clerk.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {clerk.is_active && (
                      <button
                        onClick={() => dispatch(deactivateClerk(clerk.id))}
                        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                      >
                        Deactivate
                      </button>
                    )}
                    <button
                      onClick={() => dispatch(deleteClerk(clerk.id))}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Clerks;
