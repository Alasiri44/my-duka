import React from "react";
import { Link, NavLink } from "react-router-dom";

function LandingNavBar() {
    return (
        <>
            <div className="relative m-2 min-h-8">
                < nav className="absolute top-0 right-0">
                    < NavLink className='login' to='/login'>Login</NavLink>
                    <button>< NavLink to='/signup'>Get started</NavLink></button>
                </nav>
            </div>
            <hr />
        </>
    )
}

export default LandingNavBar;