import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../../../redux/slices/authSlice";
import axios from "@/utils/axiosConfig";
import MydukaLogoSmall from"../../../assets/MydukaLogoSmall.png"

const MerchantProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const merchantId = user.id;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    phone_number: user.phone_number || "",
    gender: user.gender || "",
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchMerchantData = async () => {
      try {
        const res = await axios.get(`/merchant/${merchantId}`);
        const data = res.data;
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          gender: data.gender || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
      }
    };
    fetchMerchantData();
  }, [merchantId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.first_name || !formData.last_name || !formData.email) {
      setError("Please fill in all required fields (First Name, Last Name, Email)");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.patch(`/merchant/${merchantId}`, formData);
      setIsEditing(false);
      dispatch({
        type: "auth/updateUser",
        payload: { ...user, ...formData },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      return;
    }
    setIsDeleting(true);
    setError(null);

    try {
      await axios.delete(`/merchant/${merchantId}`);
      dispatch(clearUser());
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] px-6 md:px-8 lg:px-12 py-12 space-y-12">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        {/* Branding Header */}
        <div className="flex items-center justify-between mb-6 border-b border-[#d7d0c8] pb-4">
          <div className="flex items-center gap-2">
            <img src={MydukaLogoSmall} alt="Myduka logo" width={100}/>
            <div>
              <h1 className="text-2xl font-bold text-[#011638]">Duka Smart</h1>
              <p className="text-sm text-[#5e574d]">Manage your business with ease</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/merchant")}
            className="px-4 py-2 text-sm text-white bg-[#011638] rounded hover:bg-[#000f2a]"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Profile Content */}
        <h2 className="text-xl font-semibold text-[#011638] mb-4">Merchant Profile</h2>
        <p className="text-sm text-[#5e574d] mb-6">View and manage your account details</p>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#5e574d] mb-1" htmlFor="first_name">
              First Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-2 border border-[#d7d0c8] rounded text-sm text-[#011638] focus:outline-none focus:ring-2 focus:ring-[#011638] ${
                !isEditing ? "bg-[#f2f0ed]" : ""
              }`}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#5e574d] mb-1" htmlFor="last_name">
              Last Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-2 border border-[#d7d0c8] rounded text-sm text-[#011638] focus:outline-none focus:ring-2 focus:ring-[#011638] ${
                !isEditing ? "bg-[#f2f0ed]" : ""
              }`}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#5e574d] mb-1" htmlFor="email">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-2 border border-[#d7d0c8] rounded text-sm text-[#011638] focus:outline-none focus:ring-2 focus:ring-[#011638] ${
                !isEditing ? "bg-[#f2f0ed]" : ""
              }`}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#5e574d] mb-1" htmlFor="phone_number">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-2 border border-[#d7d0c8] rounded text-sm text-[#011638] focus:outline-none focus:ring-2 focus:ring-[#011638] ${
                !isEditing ? "bg-[#f2f0ed]" : ""
              }`}
            />
          </div>
          <div>
            <label className="block text-sm text-[#5e574d] mb-1" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-2 border border-[#d7d0c8] rounded text-sm text-[#011638] focus:outline-none focus:ring-2 focus:ring-[#011638] ${
                !isEditing ? "bg-[#f2f0ed]" : ""
              }`}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex justify-between items-center mt-6">
            <div>
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 text-sm text-white bg-[#011638] rounded hover:bg-[#000f2a] ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm text-[#5e574d] border border-[#d7d0c8] rounded hover:bg-[#f2f0ed]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm text-white bg-[#011638] rounded hover:bg-[#000f2a]"
                >
                  Edit Profile
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className={`px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 ${
                isDeleting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MerchantProfile;