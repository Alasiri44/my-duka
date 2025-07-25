import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../../components/alert";
import { motion } from "framer-motion";

function Signup() {
<<<<<<< HEAD
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [hiddenPassword, setHiddenPassword] = useState(true);
    const [error, setError] = useState('');
    const [isSignedUp, setIsSignedUp] = useState(false);
=======
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [gender, setGender] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [hiddenPassword, setHiddenPassword] = useState(true)
    const [hiddenConfirmPassword, setHiddenConfirmPassword] = useState(true)
    const [error, setError] = useState('')
    const [isSignedUp, setisSignedUp] = useState(false)
>>>>>>> origin
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    function handleChange(event) {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        fetch('http://127.0.0.1:5000/merchant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email,
                gender,
                phone_number: phoneNumber,
                password
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    setError(data.message);
                } else {
                    setIsSignedUp(true);
                }
            })
            .catch(err => {
                console.error(err);
                setError("Signup failed. Try again.");
            });
    }

    useEffect(() => {
        if (isSignedUp) {
            setShowSuccess(true);
            const timer = setTimeout(() => {
                setShowSuccess(false);
                navigate('/login');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isSignedUp, navigate]);

<<<<<<< HEAD
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8"
            >
                <h3 className="text-3xl font-semibold text-blue-900 mb-2 text-center">Create Merchant Account</h3>
                <p className="text-gray-600 text-center mb-4">Welcome to MyDuka</p>
                <hr className="mb-6" />
=======
    return <>
        <div className="mydiv mx-auto my-[20px]" >
            {showSuccess && < Alert message='Sign up successful'/>}
            <header>
                <h3 className="text-5xl p-px">Create merchant account</h3>
                <hr />
                <h2 className="text-xl">Welcome to MyDuka</h2>
            </header>
>>>>>>> origin

                {showSuccess && <Alert message="Sign up successful" />}
                {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

                <form onSubmit={handleChange} className="space-y-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="First name"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
                        />
                        <input
                            type="text"
                            placeholder="Last name"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
                    />

                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
                    />

                    <select
                        value={gender}
                        onChange={e => setGender(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>

<<<<<<< HEAD
                    {/* Password */}
                    <div className="relative">
                        <input
                            type={hiddenPassword ? "password" : "text"}
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
                        />
                        <span
                            className="absolute right-4 top-2.5 text-gray-500 cursor-pointer"
                            onClick={() => setHiddenPassword(!hiddenPassword)}
                        >
                            <i className={`fa-solid ${hiddenPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
                        </span>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <input
                            type={hiddenPassword ? "password" : "text"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
                        />
                        <span
                            className="absolute right-4 top-2.5 text-gray-500 cursor-pointer"
                            onClick={() => setHiddenPassword(!hiddenPassword)}
                        >
                            <i className={`fa-solid ${hiddenPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
                        </span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition duration-300"
                    >
                        {isSignedUp ? "Creating account..." : "Create Account"}
                    </motion.button>
                </form>

                <div className="mt-6 text-sm text-gray-600 text-center space-y-1">
                    <p>
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-900 hover:underline">
                            Log in
                        </Link>
                    </p>
                    <p>
                        By signing up, you agree to our{" "}
                        <Link to="#" className="text-blue-900 hover:underline">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="#" className="text-blue-900 hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </motion.div>
=======
                <div className="relative">
                    <input type={hiddenPassword ? "password" : 'text'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required/> <br />
                    <span className="absolute bottom-5 right-29" onClick={() => setHiddenPassword(!hiddenPassword)}>
                        <i className={`fa-solid ${hiddenPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                    </span>
                </div>

                <div className="relative">
                    <input type={hiddenConfirmPassword ? "password" : 'text'} placeholder="Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required/> <br />
                    <span className="absolute bottom-5 right-29" onClick={() => setHiddenConfirmPassword(!hiddenConfirmPassword)}>
                        <i className={`fa-solid ${hiddenConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                    </span>
                </div>

                <button type="submit">{isSignedUp ? 'Creating account... ' : 'Create account'}</button>
            </form>
            <p>Already have an account? <Link className="text-blue-950" to='/login'><span>Log in</span></Link></p>
            <p>By creating an account, you agree to our <Link className="text-blue-950">Terms of Service</Link> and <Link className="text-blue-950">Privacy Policy</Link></p>
>>>>>>> origin
        </div>
    );
}

export default Signup;
