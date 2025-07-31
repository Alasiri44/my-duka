from flask import Blueprint
from flask_mail import Message
from __init__ import mail
from random import randint

email_bp = Blueprint('email_bp', __name__)

@email_bp.route('/backend/send')
def send_email():
    email = 'austin.pamba@student.moringaschool.com'
    otp = str(randint(100000, 999999))
    msg = Message(
        subject="Admin Account Creation Successful",
        sender='austinalasiri44@gmail.com',
        recipients=['austin.pamba@student.moringaschool.com'],
                body=f"""Dear Austin,

Your admin account has been successfully created on MyDuka.

Login details:
- Email: {email}
- Password: {otp} (valid for 48 hours)

Use this OTP to log in and complete your setup. You will be prompted to create a new password:
 Login here: http://localhost:5173/login

If you did not request this account, please ignore this email and contact our support team immediately..

Regards,  
Austin Alasiri
MyDuka Team
"""
    )
    mail.send(msg)
    return "Sent!"
