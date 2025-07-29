import React from "react";

function sendStkPush({ phoneNumber, amount }) {
    // Generating the authorization token
    const consumerKey = import.meta.env.VITE_MPESA_CONSUMER_KEY;
    const consumerSecret = import.meta.env.VITE_MPESA_CONSUMER_SECRET;
    const passkey = import.meta.env.VITE_MPESA_PASSKEY;
    const short_code = "174379"

    const encodedauth = btoa(`${consumerKey}:${consumerSecret}`)
    let token;
    fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
        headers: {
            authorization: `Basic ${encodedauth}`
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            token = data.access_token
        })
        .catch(err => {
            console.error(err)
        })

    const cleanedNumber = phoneNumber.replace(/\D/g, "");

    const formattedPhone = `254${cleanedNumber.slice(-9)}`;

    const date = new Date();
    const timestamp =
        date.getFullYear() +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) +
        ("0" + date.getHours()).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) +
        ("0" + date.getSeconds()).slice(-2);
    const orderNumber = Math.floor(Math.random() * 1000) + 1;
    const password = btoa(short_code + passkey + timestamp)

    //Initiating online payment
    fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
        method: 'POST',
        body: {
            BusinessShortCode: short_code,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: formattedPhone,
            PartyB: short_code,
            PhoneNumber: "254708374149",
            CallBackURL: "https://2085acff5096.ngrok-free.app/api/mpesa/callback",
            AccountReference: phoneNumber,
            TransactionDesc: `Payment for the order number #${orderNumber}`
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            if (error instanceof Error) {
                console.log(error);
                return { error: error.message };
            }
            return { error: "something wrong happened" };
        })
}

export default sendStkPush;