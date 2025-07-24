import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addClerk } from '../../store/clerksSlice'; 
import axios from 'axios';

const AddClerk = ({ onClerkAdded, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    store_id: '',
    password_hash: '',
    role: 'clerk',
    is_active: true,
  });

  const [stores, setStores] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/stores').then((res) => {
      setStores(res.data);
    });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.name === 'store_id'
        ? parseInt(e.target.value)
        : e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addClerk(formData));
    if (onClerkAdded) onClerkAdded();
    if (onClose) onClose();
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      store_id: '',
      password_hash: '',
      role: 'clerk',
      is_active: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-lg"
        >
          ✖
        </button>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <h2 className="text-xl col-span-2 font-semibold text-gray-700">Add Clerk</h2>

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
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>

          <input
            type="password"
            name="password_hash"
            placeholder="Password"
            value={formData.password_hash}
            onChange={handleChange}
            className="border p-2 rounded"
            required/>

          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700" >
            Add Clerk
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddClerk;
