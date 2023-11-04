#! /usr/bin/python3
import os
from flask import Flask, request, jsonify, session, abort
from flask_cors import CORS
from database import Database, UserCollection, FuelStationsCollection
import bcrypt
from twilio.rest import Client
import random
from dotenv import load_dotenv
from datetime import datetime
from functools import wraps
from models import FuelStation


load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:19006"}})
app.secret_key = "production"  # os.random(24)
api_key = os.getenv('API_KEY')


def require_api_key(view_function):
    @wraps(view_function)
    def decorated_function(*args, **kwargs):
        if request.headers.get('X-API-KEY') and request.headers.get('X-API-KEY') == api_key:
            return view_function(*args, **kwargs)
        else:
            abort(401)
    return decorated_function


account_sid = os.getenv('TWILIO_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
twilio_number = os.getenv('TWILIO_PHONE_NUMBER')
twilio_client = Client(account_sid, auth_token)

db = Database()
users_collection = UserCollection(db)

tasks = []
users = {}
session = {}


@app.route('/register', methods=['POST'])
@require_api_key
def register():
    try:
        # Get JSON data from the request
        data = request.get_json()
        full_name = data.get('full_name')
        username = data.get('username')
        phone_number = "+" + data.get('phone_number')

        # Check if user with the same username already exists in the database
        existing_user_by_username = users_collection.find_user(
            {"username": username})
        if existing_user_by_username:
            return jsonify({"error": "Username already exists"}), 409

        # Check if user with the same phone number already exists in the database
        existing_user_by_phone = users_collection.find_user(
            {"phone_number": phone_number})
        if existing_user_by_phone:
            return jsonify({"error": "Phone number is already associated with another account"}), 409

        verification_code = str(random.randint(100000, 999999))
        hashed_code = bcrypt.hashpw(
            verification_code.encode('utf-8'), bcrypt.gensalt())

        # Temporarily store user data in the session
        session['temp_user'] = {
            "full_name": full_name,
            "username": username,
            "phone_number": phone_number,
            "verification_code": hashed_code,
            "verified": False,
            "login_code": "",
            "roles": ["user"],
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }

        # Send verification code via SMS using Twilio
        message = twilio_client.messages.create(
            to=phone_number,
            from_=twilio_number,
            body=f"Your verification code is: {verification_code}"
        )

        return jsonify({"message": "Verification code sent successfully!"})

    except Exception as e:
        # Log the exception for debugging
        print(f"Error: {str(e)}")
        return jsonify({"error": "An error occurred while processing your request."}), 500


@app.route('/register/verify', methods=['POST'])
@require_api_key
def verify():
    try:
        # Get JSON data from the request
        data = request.get_json()
        username = data.get('username')
        code = data.get('code')

        temp_user = session.get('temp_user')
        if not temp_user or temp_user['username'] != username:
            return jsonify({"error": "User data not found or session expired"}), 404

        if bcrypt.checkpw(code.encode('utf-8'), temp_user['verification_code']):
            # Add the user's data to the database
            users_collection.insert_user(temp_user)
            # Clear the temporary data from the session
            session.pop('temp_user', None)
            return jsonify({"message": "Verification successful!"})

        return jsonify({"error": "Verification failed"}), 401

    except Exception as e:
        # Log the exception for debugging
        print(f"Error: {str(e)}")
        return jsonify({"error": "An error occurred while verifying your code."}), 500


@app.route('/login', methods=['POST'])
@require_api_key
def login():
    try:
        # Get JSON data from the request
        data = request.get_json()
        phone_number = data.get('phone_number')
        phone_number = "+" + phone_number

        # Generate a 6-digit verification code
        login_code = str(random.randint(100000, 999999))
        hashed_login_code = bcrypt.hashpw(
            login_code.encode('utf-8'), bcrypt.gensalt())

        # Retrieve the user by phone number from the database
        user = users_collection.find_user({"phone_number": phone_number})
        if user:
            # Update the user's data with the hashed login code
            users_collection.update_user({"phone_number": phone_number}, {
                                         "$set": {"login_code": 000000}})
            print('User found')
        else:
            return jsonify({"error": "User not registered"}), 404

        # Send the login code via SMS using Twilio
        # message = twilio_client.messages.create(
        #     to=phone_number,
        #     from_=twilio_number,
        #     body=f"Your login code is: {login_code}"
        # )

        return jsonify({"message": "Login code sent successfully!"})

    except Exception as e:
        # Log the exception for debugging
        print(f"Error: {str(e)}")
        return jsonify({"error": "An error occurred while processing your request."}), 500


@app.route('/login_verify', methods=['POST'])
@require_api_key
def login_verify():
    try:
        # Get JSON data from the request
        data = request.get_json()
        phone_number = data.get('phone_number')
        phone_number = "+" + phone_number
        code = data.get('code')

        # Retrieve the user by phone number from the database
        user = users_collection.find_user({"phone_number": phone_number})
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Check if the login code matches ~ Commented out for now
        if user:
            # if bcrypt.checkpw(code.encode('utf-8'), user.get('login_code', '')):
            # Remove the login code from the database after verification
            # users_collection.update_user({"phone_number": phone_number}, {
            #                              "$unset": {"login_code": 1}})

            # Store the user's username in session
            session['username'] = user

            return jsonify({"message": "Login successful!"})

        return jsonify({"error": "Login failed"}), 401

    except Exception as e:
        # Log the exception for debugging
        print(f"Error: {str(e)}")
        return jsonify({"error": "An error occurred while verifying your code."}), 500


@app.route('/account', methods=['POST'])
@require_api_key
def account():
    try:
        username = session.get('username')
        
        if not username:
            return jsonify({"error": "User not found"}), 404 
        
        user_info = users_collection.find_user({"username": username})
        
        if user_info:
            user_info.pop('_id', None)
            user_info.pop('verification_code', None)
            user_info.pop('verified', None)
            user_info.pop('login_code', None)
            user_info.pop('updated_at', None)

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

if __name__ == '__main__':
    app.run(debug=True)
