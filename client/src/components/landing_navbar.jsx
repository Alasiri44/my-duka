import React from "react";
import { NavLink } from "react-router-dom"; 
function LandingNavBar() {
    return (
        <>

            <div className="relative py-4 px-6 md:px-8 flex justify-end items-center bg-white bg-opacity-90 shadow-md sticky top-0 z-50 backdrop-blur-sm">

                <nav className="flex items-center space-x-6">

                    <NavLink
                        className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300 px-3 py-2 rounded-md"
                        to='/login'
                    >
                        Login
                    </NavLink>

                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        <NavLink to='/signup'>
                            Get started
                        </NavLink>
                    </button>
                </nav>
            </div>

        </>
    );
}

export default LandingNavBar;