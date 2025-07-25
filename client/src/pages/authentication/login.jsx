import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/authSlice";
import Alert from "../../components/alert";
import { motion, AnimatePresence } from "framer-motion";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [hiddenPassword, setHiddenPassword] = useState(true);
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const dispatch = useDispatch();
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    function handleChange(event) {
        event.preventDefault();
        const apiRole = role !== 'merchant' ? 'user' : role;

        fetch(`http://127.0.0.1:5000/${apiRole}/login`, {
            method: 'POST',
<<<<<<< HEAD
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
=======
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
>>>>>>> origin
        })
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    setError(data.message);
                } else {
                    setIsLoggedIn(true);
                    data.role = role;
                    setTimeout(() => {
                        dispatch(setUser(data));
                        navigate(`/${data.role}`, { replace: true });
                    }, 2000);
                }
            })
            .catch(err => {
                console.error(err);
                setError(err.message || "Something went wrong.");
            });
    }

    useEffect(() => {
        if (isLoggedIn) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isLoggedIn]);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white shadow-xl rounded-xl p-8"
            >
                <h1 className="text-4xl font-bold text-center text-blue-900 mb-2">MyDuka</h1>
                <h2 className="text-center text-gray-500 mb-6">Welcome back</h2>

<<<<<<< HEAD
                {showSuccess && <Alert message="Login successful" />}
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <form onSubmit={handleChange} className="space-y-5">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />

                    <div className="relative">
                        <input
                            type={hiddenPassword ? "password" : "text"}
                            placeholder="Password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <span
                            className="absolute right-4 top-2 text-gray-500 cursor-pointer"
                            onClick={() => setHiddenPassword(!hiddenPassword)}
                        >
                            <i className={`fa-solid ${hiddenPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                        </span>
                    </div>

                    <select
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Choose your role</option>
                        <option value="merchant">Merchant</option>
                        <option value="admin">Admin</option>
                        <option value="clerk">Clerk</option>
                    </select>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.03 }}
                        type="submit"
                        className="w-full bg-blue-900 text-white py-2 rounded-md transition duration-300 hover:bg-blue-800"
                    >
                        {isLoggedIn ? "Logging in..." : "Log in"}
                    </motion.button>
                </form>

                <div className="mt-4 flex flex-col items-center text-sm text-gray-600">
                    <Link to="#" className="hover:underline mb-1">Forgot Password?</Link>
                    <p>
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-blue-900 hover:underline">Sign up</Link>
                    </p>
=======
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
>>>>>>> origin
                </div>
            </motion.div>
        </div>
    );
}

export default Login;
