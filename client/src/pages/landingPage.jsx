import React from "react";
import LandingNavBar from "../components/landing_navbar";

function LandingPage() {
    return (
        <>
            <div className="landingpage-div">
                < LandingNavBar />
            <div >
                <h1 class="text-9x1">Smart Inventory Management for Modern Retailers</h1>
                <p>Streamline procurement, manage suppliers and optimize stock levels across multiple stores with automated M-pesa payments and real-time analytics.</p>
            </div>
            <section>
                <h2>Everything you need to manage inventory</h2>
                <p>Powerful feaures designed for small and medium retail businesses</p>
                <div>
                    <div>
                        <h4>Smart Inventory</h4>
                        <p>Track stock levels, manage suppliers, and automate reordering across multiple stores.</p>
                    </div>
                    <div>
                        <h4>Role-Based Access</h4>
                        <p>Merchant, Admin, and Clerk roles with tailored permissions and workflows.</p>
                    </div>
                    <div>
                        <h4>M-Pesa Integration</h4>
                        <p>Automated supplier payments through Daraja API for seamless transactions.</p>
                    </div>
                    <div>
                        <h4>Business Analytics</h4>
                        <p>Comprehensive reporting on procurement, sales, and supplier performance.</p>
                    </div>
                    <div>
                        <h4>Secure & Reliable</h4>
                        <p>Enterprise-grade security with role-based access control and data encryption.</p>
                    </div>
                    <div>
                        <h4>Multi-Store Support</h4>
                        <p>Manage multiple businesses and stores from a single centralized platform.</p>
                    </div>
                </div>
            </section>

            <section>
                <h4>Why choose myDuka</h4>
                <p>Join hundreds of retailers who have transformed their inventory management with our comprehensive platform.</p>
                <div>
                    <ul>
                        <li>Reduce inventory costs by up to 30%</li>
                        <li>Eliminate stockouts with smart alerts</li>
                        <li>Streamline supplier payments</li>
                        <li>Real-time inventory tracking</li>
                        <li>Automated supply request workflows</li>
                        <li>Mobile-first design for on-the-go management</li>
                    </ul>
                </div>

            </section>
            </div>
        </>
    )
}

export default LandingPage;