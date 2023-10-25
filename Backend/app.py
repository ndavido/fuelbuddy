#! /usr/bin/python3

from flask import Flask, request, jsonify
from flask_cors import CORS
from database import db, collection
import bcrypt
from twilio.rest import Client
import random
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

account_sid = 'TWILIO_ACCOUNT_SID'
auth_token = 'TWILIO_AUTH_TOKEN'
twilio_number = 'TWILIO_PHONE_NUMBER'
twilio_client = Client(account_sid, auth_token)

tasks = []
users = {}

@app.route('/register', methods=['POST'])
def register():
    # Get JSON data from the request
    data = request.get_json()
    full_name = data.get('full_name')
    username = data.get('username')
    phone_number = data.get('phone_number')

    # Check if user already exists
    if username in users:
        return jsonify({"error": "Username already exists"}), 409

    # Generate a 6-digit verification code
    verification_code = str(random.randint(100000, 999999))

    # Hash the verification code using bcrypt for secure storage
    hashed_code = bcrypt.hashpw(verification_code.encode('utf-8'), bcrypt.gensalt())

    # Store user data in the users dictionary
    users[username] = {
        "full_name": full_name,
        "username": username,
        "phone_number": phone_number,
        "verification_code": hashed_code,
        "verified": False,
        "login_code": ""
    }

    # Send the verification code via SMS using Twilio
    message = twilio_client.messages.create(
        to=phone_number,
        from_=twilio_number,
        body=f"Your verification code is: {verification_code}"
    )

    return jsonify({"message": "Verification code sent successfully!"})

@app.route('/verify', methods=['POST'])
def verify():
    # Get JSON data from the request
    data = request.get_json()
    username = data.get('username')
    code = data.get('code')

    # Retrieve the user from the users dictionary
    user = users.get(username)
    
    # Check if the user exists and if the verification code matches
    if user and bcrypt.checkpw(code.encode('utf-8'), user['verification_code']):
        # Update the user's status to verified
        user['verified'] = True
        return jsonify({"message": "Verification successful!"})
    
    return jsonify({"error": "Verification failed"}), 401

if __name__ == '__main__':
    app.run(debug=True)
