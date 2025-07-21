import React, { useState } from "react";
// import './login.css'
import { Link, useNavigate } from "react-router-dom";

function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const [hiddenPassword, setHiddenPassword] = useState(true)
    const [error, setError] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()

    function handleChange(event) {
        event.preventDefault();
        fetch('http://127.0.0.1:5000/merchant/Signup', {
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
                console.log(data)
                if (data.message) {
                    setError(data.message)
                } else {
                    setIsLoggedIn(true)
                }
            })
            .catch(err => {
                console.error(err);
                setError(err)
            })
    }


    return <>
        <div className="mydiv" >
            {isLoggedIn && navigate('/landing_page')}
            <header>
                <h1 className="text-5xl p-px">MyDuka</h1>
                <hr />
                <h2 className="text-xl">Welcome to MyDuka</h2>
            </header>

            <form onSubmit={handleChange}>
                {error && <p className="text-red-600">{error}</p>}
                <input type="name" placeholder="First name" value={email} onChange={e => setEmail(e.target.value)} /> <br />

                <input type="name" placeholder="Last name" value={email} onChange={e => setEmail(e.target.value)} /> <br />

                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /> <br />

                <input type="email" placeholder="Phone Number" value={email} onChange={e => setEmail(e.target.value)} /> <br />

                <select name="" id="">
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>

                <div className="relative">
                    <input type={hiddenPassword ? "password" : 'text'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /> <br />
                    <span className="absolute bottom-5 left-70" onClick={() => setHiddenPassword(!hiddenPassword)}>
                        <i className={`fa-solid ${hiddenPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                    </span>
                </div>

                <div className="relative">
                    <input type={hiddenPassword ? "password" : 'text'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /> <br />
                    <span className="absolute bottom-5 left-70" onClick={() => setHiddenPassword(!hiddenPassword)}>
                        <i className={`fa-solid ${hiddenPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                    </span>
                </div>

                <button>Sign Up</button>
            </form>
            <p>Already have an account? <Link className="text-blue-950" to='/login'><span>Log in</span></Link></p>
        </div>
    </>
}

export default Signup;