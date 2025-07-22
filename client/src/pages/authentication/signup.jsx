import React, { useState, useEffect } from "react";
// import './login.css'
import { Link, useNavigate } from "react-router-dom";
import Alert from "../../components/alert";

function Signup() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [gender, setGender] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [hiddenPassword, setHiddenPassword] = useState(true)
    const [error, setError] = useState('')
    const [isSignedUp, setisSignedUp] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate()

    function handleChange(event) {
        event.preventDefault();
        if(password === confirmPassword){
            fetch('http://127.0.0.1:5000/merchant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email: email,
                gender: gender,
                phone_number: phoneNumber,
                password: password
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.message) {
                    setError(data.message)
                } else {
                    setisSignedUp(true)
                }
            })
            .catch(err => {
                console.error(err);
                setError(err)
            })
        }else{
            setError('Wrong password confirmation')
        }
        
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


    return <>
        <div className="mydiv" >
            {showSuccess && < Alert message='Sign up successful'/>}
            <header>
                <h3 className="text-5xl p-px">Create merchant account</h3>
                <hr />
                <h2 className="text-xl">Welcome to MyDuka</h2>
            </header>

            <form onSubmit={handleChange}>
                {error && <p className="text-red-600">{error}</p>}
                <input type="name" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)}  required/> <br />

                <input type="name" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} required/> <br />

                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/> <br />

                <input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required/> <br />

                <select value={gender} onChange={e => setGender(e.target.value)}>
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>

                <div className="relative">
                    <input type={hiddenPassword ? "password" : 'text'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required/> <br />
                    <span className="absolute bottom-5 left-70" onClick={() => setHiddenPassword(!hiddenPassword)}>
                        <i className={`fa-solid ${hiddenPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                    </span>
                </div>

                <div className="relative">
                    <input type={hiddenPassword ? "password" : 'text'} placeholder="Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required/> <br />
                    <span className="absolute bottom-5 left-70" onClick={() => setHiddenPassword(!hiddenPassword)}>
                        <i className={`fa-solid ${hiddenPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                    </span>
                </div>

                <button type="submit">Create account</button>
            </form>
            <p>Already have an account? <Link className="text-blue-950" to='/login'><span>Log in</span></Link></p>
            <p>By creating an account, you agree to our <Link className="text-blue-950">Terms of Service</Link> and <Link className="text-blue-950">Privacy Policy</Link></p>
        </div>
    </>
}

export default Signup;