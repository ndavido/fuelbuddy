#! /usr/bin/env python3

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from src.middleware.api_key_middleware import require_api_key
import bcrypt
import random
from datetime import datetime
from src.utils.helper_utils import standardize_irish_number, handle_api_error
from src.utils.validation_utils import validate_phone_number, validate_verification_code
from src.utils.encryption_utils import aes_encrypt, encryption_key
from src.models.user import Users, BudgetHistory
from twilio.rest import Client
from ..config import TWILIO_AUTH_TOKEN, TWILIO_SID, TWILIO_PHONE_NUMBER

account_sid = TWILIO_SID
auth_token = TWILIO_AUTH_TOKEN
twilio_number = TWILIO_PHONE_NUMBER
twilio_client = Client(account_sid, auth_token)

new_user_session = {}


@require_api_key
def register():
    try:
        data = request.get_json()
        full_name = data.get('full_name')
        username = data.get('username')
        phone_number = data.get('phone_number')

        full_phone_number = standardize_irish_number(phone_number)
        if not validate_phone_number(full_phone_number):
            return jsonify({"error": "Invalid phone number format"}), 400

        encrypted_phone_number = aes_encrypt(full_phone_number, encryption_key)

        if Users.objects(username=username).first():
            return jsonify({"error": "Username already exists"}), 409
        if Users.objects(phone_number=encrypted_phone_number).first():
            return jsonify({"error": "Phone number is already associated with another account"}), 409

        verification_code = str(random.randint(100000, 999999))
        hashed_code = bcrypt.hashpw(
            verification_code.encode('utf-8'), bcrypt.gensalt())

        new_user_session[username] = {
            "full_name": full_name,
            "username": username,
            "phone_number": encrypted_phone_number,
            "verification_code": hashed_code,
            "verified": False,
            "roles": ["user"],
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }

        twilio_client.messages.create(
            to=full_phone_number,
            from_=twilio_number,
            body=f"Your verification code is: {verification_code}"
        )

        return jsonify({"message": "Verification code sent successfully!"})

    except Exception as e:
        return handle_api_error(e)


@require_api_key
def verify():
    try:
        data = request.get_json()
        username = data['username']
        code = data['code']

        if not validate_verification_code(code):
            return jsonify({"error": "Invalid code format"}), 400

        if username not in new_user_session:
            return jsonify({"error": "User data not found or session expired"}), 404

        user_data = new_user_session[username]

        if bcrypt.checkpw(code.encode('utf-8'), user_data['verification_code']):
            new_user = Users(**user_data)
            new_user.save()  # Save the verified user to the database

            access_token = create_access_token(
                identity=new_user["phone_number"])
            new_user_session.pop(username, None)  # Clear the session data
            return jsonify({
                "message": "Verification successful!",
                "access_token": access_token
            }), 200
        else:
            return jsonify({"error": "Verification failed"}), 401
    except Exception as e:
        return handle_api_error(e)


@require_api_key
def login():
    try:
        data = request.get_json()
        phone_number = data['phone_number']

        if not phone_number:
            return jsonify({"error": "Phone number is required"}), 400

        try:
            standardized_phone_number = standardize_irish_number(phone_number)
        except ValueError as err:
            return jsonify({"error": str(err)}), 400

        if not validate_phone_number(standardized_phone_number):
            return jsonify({"error": "Invalid phone number format"}), 400

        login_code = str(random.randint(100000, 999999))
        hashed_login_code_bytes = bcrypt.hashpw(
            login_code.encode('utf-8'), bcrypt.gensalt())
        hashed_login_code_str = hashed_login_code_bytes.decode(
            'utf-8')  # Convert bytes to string

        encrypted_phone_number = aes_encrypt(
            standardized_phone_number, encryption_key)
        print("Encrypted Phone Number:", encrypted_phone_number)

        user = Users.objects(phone_number=encrypted_phone_number).first()

        if user:
            user.update(set__login_code=str(hashed_login_code_str))
        else:
            return jsonify({"error": "User not registered"}), 404

        message = twilio_client.messages.create(
            to=standardized_phone_number,
            from_=twilio_number,
            body=f"Your login code is: {login_code}"
        )

        return jsonify({"message": "Login code sent successfully!"})

    except Exception as e:
        return handle_api_error(e)


@require_api_key
def login_verify():
    try:
        data = request.get_json()
        phone_number = data['phone_number']
        code = data['code']

        if not phone_number or not code:
            return jsonify({"error": "Phone number and code are required"}), 400

        try:
            standardized_phone_number = standardize_irish_number(phone_number)
        except ValueError as ve:
            return jsonify({"error": str(ve)}), 400

        if not validate_phone_number(standardized_phone_number) or not validate_verification_code(code):
            return jsonify({"error": "Invalid phone number or code format"}), 400

        # Hash the phone number before querying the database
        encrypted_phone_number = aes_encrypt(
            standardized_phone_number, encryption_key)

        # Use the hashed phone number to find the user
        user = Users.objects(phone_number=encrypted_phone_number).first()

        if not user:
            return jsonify({"error": "User not found"}), 404
        stored_login_code = user.login_code
        stored_login_code_bytes = stored_login_code.encode('utf-8')
        if bcrypt.checkpw(code.encode('utf-8'), stored_login_code_bytes):
            user.update(unset__login_code=True)

            access_token = create_access_token(
                identity=encrypted_phone_number)
            return jsonify({
                "message": "Login successful!",
                "access_token": access_token
            }), 200
        else:
            return jsonify({"error": "Login failed"}), 401

    except Exception as e:
        return handle_api_error(e)
