import React, { useState } from "react";
import './login.css';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleChange(event) {
    event.preventDefault();
    setIsLoggingIn(true);

    try {
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
        toast.success("Login successful");
        navigate('/merchant', { replace: true });
      } else {
        // Try user login
        const userRes = await fetch(`http://127.0.0.1:5000/user/login`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const userData = await userRes.json();

        if (userRes.ok) {
          dispatch(setUser(userData));
          toast.success("Login successful");
          navigate(`/${userData.role}`, { replace: true });
        } else {
          toast.error(userData.message || "Login failed. Try again.");
        }
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <div className="mydiv mx-auto my-[200px]">
      <header>
        <h1 className="text-5xl p-px">MyDuka</h1>
        <hr />
        <h2 className="text-xl">Welcome back to MyDuka</h2>
      </header>

      <form onSubmit={handleChange}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        /> <br />
        <div className="relative">
          <input
            type={hiddenPassword ? "password" : 'text'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          /> <br />
          <span className="absolute bottom-5 right-30" onClick={() => setHiddenPassword(!hiddenPassword)}>
            <i className={`fa-solid ${hiddenPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
          </span>
        </div>

        <button type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <Link className="text-blue-950"><p>Forgot Password?</p></Link>
      <p>
        Don't have an account?{" "}
        <Link className="text-blue-950" to='/signup'>
          <span>Sign in</span>
        </Link>
      </p>
    </div>
  );
}

export default Login;
