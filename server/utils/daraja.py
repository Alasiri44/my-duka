import requests
from base64 import b64encode
from datetime import datetime



def get_access_token(settings):
    auth = (settings.daraja_consumer_key, settings.daraja_consumer_secret)
    url = f"{settings.base_url}/oauth/v1/generate?grant_type=client_credentials"
    print("Using KEY:", settings.daraja_consumer_key)
    print("Using SECRET:", settings.daraja_consumer_secret)
    res = requests.get(url, auth=auth)
    
    if res.status_code != 200:
        print("❌ Token request failed")
        print("Status Code:", res.status_code)
        print("Response:", res.text)  
    return res.json().get("access_token")


def initiate_stk_push(business_settings, phone_number, amount, reference):
    access_token = get_access_token(business_settings)
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    password = b64encode(
        (business_settings.daraja_short_code + business_settings.daraja_passkey + timestamp).encode()
    ).decode()

    payload = {
        "BusinessShortCode": business_settings.daraja_short_code,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone_number,
        "PartyB": business_settings.daraja_short_code,
        "PhoneNumber": phone_number,
        "CallBackURL": business_settings.callback_url,
        "AccountReference": reference,
        "TransactionDesc": "MyDuka Payment"
    }

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    url = f"{business_settings.base_url}/mpesa/stkpush/v1/processrequest"
    response = requests.post(url, json=payload, headers=headers)

    return response.json()
