import base64
import requests
from flask import Flask, request, jsonify, Blueprint
from datetime import datetime
import random
import os

mpesa_bp = Blueprint('mpesa_bp', __name__)

# Load from environment variables
CONSUMER_KEY = os.getenv("MPESA_CONSUMER_KEY", '86uk0x9KTzpSXJX53GAhV7TVKOrR87002D9Y8QZjLlotL3ga')
CONSUMER_SECRET = os.getenv("MPESA_CONSUMER_SECRET", 'okY9SVzZZzRqRfdsRzYiLJXd7GOr8jZSloE2Uw7wFypfCEPzQJbgxD4ZyVS2OGte')
PASSKEY = os.getenv("MPESA_PASSKEY", 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919')
SHORT_CODE = "174379"
CALLBACK_URL = "https://2085acff5096.ngrok-free.app/api/mpesa/callback"

@mpesa_bp.route("/api/stk", methods=["POST"])
def stk_push():
    try:
        # 1. Get data from frontend
        data = request.get_json()
        phone_number = data.get("phoneNumber")
        amount = data.get("amount")

        # 2. Generate token
        auth = f"{CONSUMER_KEY}:{CONSUMER_SECRET}"
        encoded_auth = base64.b64encode(auth.encode()).decode()
        token_res = requests.get(
            "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
            headers={"Authorization": f"Basic {encoded_auth}"}
        )
        token = token_res.json().get("access_token")

        # 3. Format phone number
        cleaned_number = ''.join(filter(str.isdigit, phone_number))
        formatted_phone = f"254{cleaned_number[-9:]}"  # ensure last 9 digits only

        # 4. Generate timestamp
        now = datetime.now()
        timestamp = now.strftime("%Y%m%d%H%M%S")

        # 5. Generate password
        raw_password = SHORT_CODE + PASSKEY + timestamp
        encoded_password = base64.b64encode(raw_password.encode()).decode()

        # 6. Order number
        order_number = random.randint(1, 1000)

        # 7. Prepare payload
        payload = {
            "BusinessShortCode": SHORT_CODE,
            "Password": encoded_password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": formatted_phone,
            "PartyB": SHORT_CODE,
            "PhoneNumber": "254708374149",  # keep fixed if you want
            "CallBackURL": CALLBACK_URL,
            "AccountReference": phone_number,
            "TransactionDesc": f"Payment for the order number #{order_number}"
        }

        # 8. Make STK Push
        res = requests.post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            json=payload,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )

        return jsonify(res.json()), res.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
