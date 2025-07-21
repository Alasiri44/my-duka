import React, { useState } from "react";
import './login.css'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')

    function handleChange(event) {
        event.preventDefault();
        fetch()
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.error(err))
    }
    return <>
        <div className="mydiv" >
            <h1>MyDuka</h1>
            <h2>Welcome back to MyDuka</h2>
            <form onSubmit={handleChange}>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /> <br />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /> <br />
                <select value={password} onChange={e => setPassword(e.target.value)}
                 >
                    <option value="">Choose your role</option>
                    <option value="merchant">Merchant</option>
                    <option value="admin">Admin</option>
                    <option value="client">Client</option>
                 </select>
            </form>
        </div>
    </>
}

export default Login;