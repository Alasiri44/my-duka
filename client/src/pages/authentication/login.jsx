import React, { useState, useEffect } from "react";
import './login.css'
import { Link, useNavigate } from "react-router-dom";
import Alert from "../../components/alert";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/authSlice";
import merchantRoutes from "../../routes/merchant";

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const [hiddenPassword, setHiddenPassword] = useState(true)
    const [error, setError] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const dispatch = useDispatch();
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    async function handleChange(event) {
      event.preventDefault();
      setError('');
    
      // First, try to log in as a merchant
      const res = await fetch(`http://127.0.0.1:5000/merchant/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
    
      const data = await res.json();
    
      if (res.ok) {
        data.role = 'merchant';
        dispatch(setUser(data));
        navigate('/merchant', { replace: true });
      } else {

        // If merchant login fails, try admin login
        const userRes = await fetch(`http://127.0.0.1:5000/user/login`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
    
        const userData = await userRes.json();
    
        if (userRes.ok) {
          dispatch(setUser(userData));
         navigate(`/${userData.role}`, { replace: true });
        } else {
          setError(userData.message || "Login failed. Try again.");
        }
      }
    }


    useEffect(() => {
        if (isLoggedIn) {
            setShowSuccess(true);
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 2000); 

            return () => clearTimeout(timer);
        }
    }, [isLoggedIn]);

    return <>

        <div className="max-w-md mx-auto my-40 bg-white rounded-lg shadow-md px-8 py-10 space-y-6">
  {showSuccess && <Alert message="Login successful" />}
  
  <header className="text-center space-y-2">
    <h1 className="text-4xl font-bold text-[#011638]">MyDuka</h1>
    <hr className="border-t border-gray-200" />
    <h2 className="text-lg text-[#5e574d]">Welcome back to MyDuka</h2>
  </header>

  <form onSubmit={handleChange} className="space-y-4">
    {error && <p className="text-red-600 text-sm">{error}</p>}

    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={e => setEmail(e.target.value)}
      className="w-full p-3 border border-[#d7d0c8] rounded focus:outline-none focus:ring-2 focus:ring-[#011638]"
    />

    <div className="relative">
      <input
        type={hiddenPassword ? "password" : "text"}
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full p-3 border border-[#d7d0c8] rounded focus:outline-none focus:ring-2 focus:ring-[#011638]"
      />
      <span
        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-[#5e574d]"
        onClick={() => setHiddenPassword(!hiddenPassword)}
      >
        <i className={`fa-solid ${hiddenPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
      </span>
    </div>

    <button
      type="submit"
      className="w-full bg-[#011638] text-white py-3 rounded hover:bg-[#000f2a] transition"
    >
      {isLoggedIn ? "Logging in..." : "Log in"}
    </button>
  </form>

  <div className="text-sm text-center space-y-2">
    <Link to="/forgot-password" className="text-blue-800 hover:underline">Forgot Password?</Link>
    <p className="text-[#5e574d]">
      Don't have an account?
      <Link to="/signup" className="text-blue-800 hover:underline ml-1">Sign up</Link>
    </p>
  </div>
</div>

    </>
}

export default Login;