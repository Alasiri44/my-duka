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

        <div className="mydiv mx-auto my-[200px]" >
            {showSuccess && < Alert message='login successful' />}
            <header>
                <h1 className="text-5xl p-px">MyDuka</h1>
                <hr />
                <h2 className="text-xl">Welcome back to MyDuka</h2>
            </header>

            <form onSubmit={handleChange}>
                {error && <p className="text-red-600">{error}</p>}
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /> <br />
                <div className="relative">
                    <input type={hiddenPassword ? "password" : 'text'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /> <br />
                    <span className="absolute bottom-5 right-30" onClick={() => setHiddenPassword(!hiddenPassword)}>
                        <i className={`fa-solid ${hiddenPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                    </span>
                </div>
                <select value={role} onChange={e => setRole(e.target.value)}
                >
                    <option value="">Choose your role</option>
                    <option value="merchant">Merchant</option>
                    <option value="admin">Admin</option>
                    <option value="clerk">Clerk</option>
                </select>

                <button type="submit">{isLoggedIn ? 'Logging in... ' : 'Log in'}</button>
            </form>
            <Link className="text-blue-950"><p>Forgot Password?</p></Link>
            <p>Don't have an account? <Link className="text-blue-950" to='/signup'><span>Sign in</span></Link></p>
        </div>
    </>
}

export default Login;