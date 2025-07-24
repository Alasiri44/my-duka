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

    function handleChange(event) {
        event.preventDefault();
        let apiRole;
        if (role != 'merchant') {
            apiRole = 'user'
        } else {
            apiRole = role;
        }
        fetch(`http://127.0.0.1:5000/${apiRole}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    setError(data.message)
                } else {
                    setIsLoggedIn(true)
                    data.role = role
                    const timer = setTimeout(() => {
                        navigate(`/${data.role}`, { replace: true });
                        dispatch(setUser(data))
                    }, 2000);
                    
                    

                }
            })
            .catch(err => {
                console.error(err);
                setError(err)
            })
    }

    useEffect(() => {
        if (isLoggedIn) {
            setShowSuccess(true);
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 2000); // wait for 2 seconds

            return () => clearTimeout(timer);
        }
    }, [isLoggedIn]);

    return <>

        <div className="mydiv" >
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
                    <span className="absolute bottom-5 left-70" onClick={() => setHiddenPassword(!hiddenPassword)}>
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