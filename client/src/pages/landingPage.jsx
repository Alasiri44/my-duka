import React from "react";
import LandingNavBar from "../components/landing_navbar";
import { NavLink } from "react-router-dom";
import { GoGraph } from "react-icons/go";
import { FaUserLock, FaShieldAlt,FaChartArea  } from "react-icons/fa";
import mpesaLogo from "../assets/mpesaLogo.png";
import { MdAddBusiness } from "react-icons/md";
import { IoDiamond } from "react-icons/io5";
import dashScreenshot from "../assets/dashScreenshot.png";
import screenshot2 from "../assets/screenshot2.png";
import StockReportsDemo from "@/components/StockReportsDemo";



function LandingPage() {
    return (
        <>
            <div className="font-sans antialiased bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen text-gray-800 transition-all duration-300 ease-in-out">
                <LandingNavBar />

                <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-24 py-20 gap-10">
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight animate-fade-in-down">
                            Smart Inventory Management for Modern Retailers
                        </h1>
                        <p className="mt-6 text-gray-600 text-lg animate-fade-in-up">
                            Streamline procurement, manage suppliers and optimize stock levels across multiple stores with automated M-Pesa payments and real-time analytics.
                        </p>
                        <button className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition">
                            <NavLink to='/signup'>
                                Get started
                            </NavLink>
                        </button>
                    </div>
                    <div className="lg:w-3/4 animate-fade-in-right">
                        <img
                            src={screenshot2}
                            alt="Inventory Illustration"
                            className="w-full rounded-lg shadow-lg"
                        />
                    </div>
                </section>

                <section className="bg-white py-20 px-6 rounded-t-3xl shadow-inner-xl relative overflow-hidden">
                    <div className="absolute top-1/4 left-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                    <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>

                    <div className="max-w-6xl mx-auto text-center">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Everything you need to manage inventory
                        </h2>
                        <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto">
                            Powerful features designed for small and medium retail businesses to thrive in the modern market.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-left">
                            {[
                                {
                                    title: "Smart Inventory",
                                    desc: "Track stock levels, manage suppliers, and automate reordering across multiple stores.",
                                    icon: <GoGraph />

                                },
                                {
                                    title: "Role-Based Access",
                                    desc: "Merchant, Admin, and Clerk roles with tailored permissions and workflows.",
                                    icon: <FaUserLock />
                                },
                                {
                                    title: "M-Pesa Integration",
                                    desc: "Automated supplier payments through Daraja API for seamless transactions.",
                                    icon: <img src={mpesaLogo} alt="M-Pesa Logo" className="w-6 inline-block" style={{width:"80px"}}/>
                                },
                                {
                                    title: "Business Analytics",
                                    desc: "Comprehensive reporting on procurement, sales, and supplier performance.",
                                    icon: <FaChartArea />
                                },
                                {
                                    title: "Secure & Reliable",
                                    desc: "Enterprise-grade security with role-based access control and data encryption.",
                                    icon: <FaShieldAlt />
                                },
                                {
                                    title: "Multi-Store Support",
                                    desc: "Manage multiple businesses and stores from a single centralized platform.",
                                    icon: <MdAddBusiness />
                                },
                            ].map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="p-8 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:border-blue-400 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-purple-100 opacity-0 group-hover:opacity-75 transition-opacity duration-500 ease-in-out rounded-2xl"></div>
                                    <div className="relative z-10">
                                        <div className="text-4xl mb-4 transition-transform group-hover:scale-110 duration-300 ease-in-out">
                                            {feature.icon}
                                        </div>
                                        <h4 className="text-2xl font-semibold mb-3 text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                                            {feature.title}
                                        </h4>
                                        <p className="text-gray-600 leading-relaxed">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-gradient-to-tr from-green-50 to-teal-50 py-20 px-6 rounded-b-3xl">
                    <div className="max-w-5xl mx-auto text-center">
                        <h4 className="text-4xl font-bold text-gray-900 mb-6">Why choose <span className="text-green-600">myDuka</span></h4>
                        <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto">
                            Join hundreds of retailers who have transformed their inventory management with our comprehensive platform. Experience the future of retail with myDuka.
                        </p>

                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-left text-gray-800 list-none p-0 max-w-3xl mx-auto">
                            <li className="flex items-center space-x-3 text-lg font-medium p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 border border-green-200">
                                <span className="text-green-500 text-2xl"><IoDiamond /></span>
                                <span>Reduce inventory costs by up to 30%</span>
                            </li>
                            <li className="flex items-center space-x-3 text-lg font-medium p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 border border-green-200">
                                <span className="text-green-500 text-2xl"><IoDiamond /></span>
                                <span>Eliminate stockouts with smart alerts</span>
                            </li>
                            <li className="flex items-center space-x-3 text-lg font-medium p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 border border-green-200">
                                <span className="text-green-500 text-2xl"><IoDiamond /></span>
                                <span>Streamline supplier payments</span>
                            </li>
                            <li className="flex items-center space-x-3 text-lg font-medium p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 border border-green-200">
                                <span className="text-green-500 text-2xl"><IoDiamond /></span>
                                <span>Real-time inventory tracking</span>
                            </li>
                            <li className="flex items-center space-x-3 text-lg font-medium p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 border border-green-200">
                                <span className="text-green-500 text-2xl"><IoDiamond /></span>
                                <span>Automated supply request workflows</span>
                            </li>
                            <li className="flex items-center space-x-3 text-lg font-medium p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 border border-green-200">
                                <span className="text-green-500 text-2xl"><IoDiamond /></span>
                                <span>Mobile-first design for on-the-go management</span>
                            </li>
                        </ul>
                    </div>
                </section>

                <section>
                    <StockReportsDemo/>
                </section>

                <footer className="text-center py-6 bg-white text-gray-500 text-sm border-t">
                    © {new Date().getFullYear()} myDuka. All rights reserved.
                </footer>
            </div>
        </>
    );
}

export default LandingPage;