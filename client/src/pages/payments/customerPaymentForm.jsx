import React, { useState } from "react";
import axios from "@/utils/axiosConfig";

function CustomerPaymentForm() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amount, setAmount] = useState(5);
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        setLoading(true)
        e.preventDefault();
        const kenyanPhoneNumberRegex =
            /^(07\d{8}|01\d{8}|2547\d{8}|2541\d{8}|\+2547\d{8}|\+2541\d{8})$/;

        if (!kenyanPhoneNumberRegex.test(phoneNumber)) {
            setLoading(false);
            return alert("Invalid mpesa number");
        }
        console.log(phoneNumber, amount)

        try {
            const res = await axios.post("/api/stk", {
                phoneNumber,
                amount
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = res.data;
            console.log(data)
            if (!res.status === 200) throw new Error(data.error || "STK Push Failed");
            return { data };
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    };

    return <>
        <div>
            <form className="m-4">
                <div className="space-y-6 overflow-hidden rounded-md bg-white">
                    <div>
                        <label className="text-base font-medium text-gray-900">
                            {" "}
                            Customer Mpesa Number{" "}
                        </label>
                        <div className="relative mt-2.5">
                            <input
                                type="text"
                                name="mpesa_number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Enter customer mpesa phone number"
                                className="block w-full rounded-md border border-gray-200 bg-white px-4 py-4 text-black placeholder-gray-500 caret-orange-500 transition-all duration-200 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-base font-medium text-gray-900">
                            {" "}
                            Amount to be paid{" "}
                        </label>
                        <div className="relative mt-2.5">
                            <input
                                type="number"
                                name="amount"
                                min="5"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter the amount to be paid"
                                className="block w-full rounded-md border border-gray-200 bg-white px-4 py-4 text-black placeholder-gray-500 caret-orange-500 transition-all duration-200 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-orange-500 px-4 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-orange-600 focus:bg-orange-600 focus:outline-none"
                        >
                            {loading ? "Processing.." : "Proceed With Payment"}
                        </button>;
                    </div>
                </div>
            </form>
        </div>
    </>
}

export default CustomerPaymentForm;