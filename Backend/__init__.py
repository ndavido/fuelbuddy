#! /usr/bin/python3
import os

from bson import json_util
from flask import Flask, request, jsonify, session, abort
from flask_session import Session
from flask_cors import CORS
from database import Database, UserCollection, FuelStationsCollection, PetrolFuelPricesCollection
import bcrypt
from twilio.rest import Client
import random
from dotenv import load_dotenv
from datetime import datetime, timedelta
from functools import wraps
from models import FuelStation
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import re


load_dotenv()
app = Flask(__name__)
CORS(app, resources={
     r"/*": {"origins": "http://localhost:19006"}}, supports_credentials=True)
app.secret_key = "production"  # os.random(24)
api_key = os.getenv('API_KEY')

# Flask-Session Configuration
app.config["SESSION_TYPE"] = "mongodb"
app.config["SESSION_MONGODB"] = MongoClient(
    os.getenv('MONGO_URI'), server_api=ServerApi('1'))
app.config["SESSION_MONGODB_DB"] = os.getenv('MONGO_DB_NAME')
app.config["SESSION_MONGODB_COLLECT"] = "flask_sessions"
app.config["SESSION_USE_SIGNER"] = True
app.config["SESSION_PERMANENT"] = False
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

Session(app)
session = {}

account_sid = os.getenv('TWILIO_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
twilio_number = os.getenv('TWILIO_PHONE_NUMBER')
twilio_client = Client(account_sid, auth_token)

db = Database()
users_collection = UserCollection(db)
new_user = None


def require_api_key(view_function):
    @wraps(view_function)
    def decorated_function(*args, **kwargs):
        if request.headers.get('X-API-KEY') and request.headers.get('X-API-KEY') == api_key:
            return view_function(*args, **kwargs)
        else:
            abort(401)
    return decorated_function


def standardize_irish_number(phone_number):
    if phone_number.startswith('+3530'):
        return '+353' + phone_number[5:]  # Remove leading '0'
    return phone_number


def validate_phone_number(phone_number):
    pattern = re.compile(r"^\+[1-9]\d{1,14}$")
    return bool(pattern.match(phone_number))


def validate_verification_code(code):
    return code.isdigit() and len(code) == 6


@app.route('/register', methods=['POST'])
@require_api_key
def register():
    try:
        data = request.get_json()
        full_name = data.get('full_name')
        username = data.get('username')
        # Assume this is the number without +353
        phone_number = data.get('phone_number')

        # Validate and standardize phone number
        standardized_phone_number = standardize_irish_number(phone_number)
        full_phone_number = "+" + standardized_phone_number  # Prefix with +353
        if not validate_phone_number(full_phone_number):
            return jsonify({"error": "Invalid phone number format"}), 400

        print("Full phone number:", full_phone_number)
        # Check for existing users with the same username or phone number
        if users_collection.find_user({"username": username}):
            return jsonify({"error": "Username already exists"}), 409
        if users_collection.find_user({"phone_number": full_phone_number}):
            return jsonify({"error": "Phone number is already associated with another account"}), 409

        # Generate verification code and hash it
        verification_code = str(random.randint(100000, 999999))
        hashed_code = bcrypt.hashpw(
            verification_code.encode('utf-8'), bcrypt.gensalt()
        )

        # Set session data for the new user
        session['new_user'] = {
            "full_name": full_name,
            "username": username,
            "phone_number": full_phone_number,  # Use the full phone number including +353
            "verification_code": hashed_code,  # Store the hashed verification code
            "verified": False,
            "login_code": "",
            "roles": ["user"],
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }

        # Send the verification code via SMS using Twilio
        twilio_client.messages.create(
            to=full_phone_number,
            from_=twilio_number,
            body=f"Your verification code is: {verification_code}"
        )

        return jsonify({"message": "Verification code sent successfully!"})

    except Exception as e:
        print(f"Error in /register: {str(e)}")
        return jsonify({"error": "An error occurred while processing your request."}), 500


@app.route('/register/verify', methods=['POST'])
@require_api_key
def verify():
    try:
        data = request.get_json()
        username = data.get('username')
        code = data.get('code')

        # Validate the verification code format
        if not validate_verification_code(code):
            return jsonify({"error": "Invalid code format"}), 400

        # Retrieve the session data for the new user
        new_user = session.get('new_user')
        print("Retrieved from session in /verify:", new_user)

        # Check if the session data exists and the username matches
        if not new_user or new_user['username'] != username:
            return jsonify({"error": "User data not found or session expired"}), 404

        # Verify the provided code against the stored hashed code
        if bcrypt.checkpw(code.encode('utf-8'), new_user['verification_code']):
            # If the code is correct, remove the verification code and add the user to the database
            new_user.pop('verification_code', None)
            users_collection.insert_user(new_user)

            # Store relevant user information in the session to indicate they are now logged in
            user_data_for_session = {
                "username": new_user["username"],
                "phone_number": new_user["phone_number"]
            }
            session['current_user'] = user_data_for_session

            # Clear the new user data from the session
            session.pop('new_user', None)

            return jsonify({"message": "Verification successful!"})
        else:
            # If the code does not match, return a verification failed message
            return jsonify({"error": "Verification failed"}), 401
    except Exception as e:
        print(f"Error in /register/verify: {str(e)}")
        return jsonify({"error": "An error occurred while verifying your code."}), 500


@app.route('/login', methods=['POST'])
@require_api_key
def login():
    try:
        # Get JSON data from the request
        data = request.get_json()
        phone_number = data.get('phone_number')
        if not phone_number:
            return jsonify({"error": "Phone number is required"}), 400

        standardized_phone_number = "+" + \
            standardize_irish_number(phone_number)
        if not validate_phone_number(standardized_phone_number):
            return jsonify({"error": "Invalid phone number format"}), 400
        print("Standardized phone number:", standardized_phone_number)

        # Generate a 6-digit verification code
        login_code = str(random.randint(100000, 999999))
        hashed_login_code = bcrypt.hashpw(
            login_code.encode('utf-8'), bcrypt.gensalt())

        # Retrieve the user by phone number from the database
        user = users_collection.find_user(
            {"phone_number": standardized_phone_number})
        if user:
            # Update the user's data with the hashed login code
            users_collection.update_user({"phone_number": standardized_phone_number}, {
                                         "$set": {"login_code": hashed_login_code}})
        else:
            return jsonify({"error": "User not registered"}), 404

        # Send the login code via SMS using Twilio
        message = twilio_client.messages.create(
            to=standardized_phone_number,
            from_=twilio_number,
            body=f"Your login code is: {login_code}"
        )

        return jsonify({"message": "Login code sent successfully!"})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "An error occurred while processing your request."}), 500


@app.route('/login_verify', methods=['POST'])
@require_api_key
def login_verify():
    try:
        # Get JSON data from the request
        data = request.get_json()

        phone_number = data.get('phone_number')
        code = data.get('code')
        if not phone_number or not code:
            return jsonify({"error": "Phone number and code are required"}), 400

        standardized_phone_number = "+" + \
            standardize_irish_number(phone_number)
        if not validate_phone_number(standardized_phone_number) or not validate_verification_code(code):
            return jsonify({"error": "Invalid phone number or code format"}), 400

        # Retrieve the user by phone number from the database
        user = users_collection.find_user(
            {"phone_number": standardized_phone_number})
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Check if the login code matches
        if bcrypt.checkpw(code.encode('utf-8'), user.get('login_code', b'')):
            # Remove the login code from the database after verification
            users_collection.update_user({"phone_number": standardized_phone_number}, {
                                         "$unset": {"login_code": 1}})

            # Store relevant user information in session
            user_data_for_session = {
                "username": user.get("username"),
                "phone_number": user.get("phone_number"),
                # add other necessary fields here
            }
            session['current_user'] = user_data_for_session
            return jsonify({"message": "Login successful!"})
        else:
            return jsonify({"error": "Login failed"}), 401

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "An error occurred while verifying your code."}), 500


@app.route('/account', methods=['POST'])
@require_api_key
def account():
    try:
        data = request.get_json()
        username = data.get('username')

        if not username:
            return jsonify({"error": "User not found"}), 404

        user_info = users_collection.find_user({"username": username})

        if user_info:
            user_info.pop('_id', None)
            user_info.pop('verification_code', None)
            user_info.pop('verified', None)
            user_info.pop('login_code', None)
            user_info.pop('updated_at', None)

            user_info_json = json_util.dumps(user_info)
            return jsonify({"message": "User found", "user": user_info_json}), 200
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving your account."}), 500


@app.route('/delete_account', methods=['POST'])
@require_api_key
def delete_account():
    try:
        username = session.get('username')

        if not username:
            return jsonify({"error": "User not found"}), 404

        users_collection.delete_user({"username": username})
        session.pop('username', None)

        return jsonify({"message": "Account deleted successfully!"})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "An error occurred while deleting your account."}), 500


@app.route('/logout', methods=['POST'])
@require_api_key
def logout():
    try:
        session.pop('username', None)
        return jsonify({"message": "Logout successful!"})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "An error occurred while logging out."}), 500


# Neural Network Connection Commented out for now
@app.route('/store_fuel_stations', methods=['POST'])
def store_fuel_stations():
    try:
        data = request.get_json()

        fuel_stations = data.get('fuelStation', [])

        fuel_station_data_list = []

        # Create an instance of the FuelStationsCollection class
        db = Database()
        fuel_station_collection = FuelStationsCollection(db)

        for station in fuel_stations:
            fuel_station_data = {
                "name": station.get('name'),
                "location": station.get('location'),
            }
            fuel_station_data_list.append(fuel_station_data)

        # Insert the fuel station data into the MongoDB collection using FuelStationsCollection
        for fuel_station_data in fuel_station_data_list:
            fuel_station_collection.insert_fuel_station(fuel_station_data)

        return jsonify({"message": "Fuel stations stored successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/store_petrol_fuel_prices', methods=['POST'])
def store_petrol_fuel_prices():
    try:
        data = request.get_json()

        petrol_prices = data.get('petrol_fuel_prices', [])

        petrol_price_data_list = []

        # Create an instance of the PetrolPricesCollection class
        db = Database()
        petrol_price_collection = PetrolFuelPricesCollection(db)

        for station in petrol_prices:
            petrol_price_data = {
                "station_id": station.get('station_id'),
                "location": station.get('location'),
                "price_per_liter": station.get('price_per_liter'),
                "timestamp": station.get('timestamp')
            }
            petrol_price_data_list.append(petrol_price_data)

        # using insert from PetrolFuelPricesCollection
        for petrol_price_data in petrol_price_data_list:
            petrol_price_collection.insert_fuel_price(petrol_price_data)

        return jsonify({"message": "Petrol fuel prices stored successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
