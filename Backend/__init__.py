#! /usr/bin/python3
import os

from bson import json_util
from flask import Flask, request, jsonify, session, abort
from flask_session import Session
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from database import Database, UserCollection, FuelStationsCollection, PetrolFuelPricesCollection
import bcrypt
from twilio.rest import Client
import random
from dotenv import load_dotenv
from datetime import datetime, timedelta
from functools import wraps
from models import FuelStation, Location, Users, FuelPrices
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import re
# from updated_user_monthly_predictions import main as nn


load_dotenv()
app = Flask(__name__)
CORS(app, resources={
     r"/*": {"origins": "http://localhost:19006"}}, supports_credentials=True)
app.secret_key = "production"  # os.random(24)
api_key = os.getenv('API_KEY')

# Change this to a secure secret key
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)

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
users_collection = UserCollection()
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
    """
    Standardize Irish phone numbers to include the country code.
    """
    if phone_number.startswith('353') and not phone_number.startswith('+353'):
        if len(phone_number) > 3 and phone_number[3] == '0':
            return '+353' + phone_number[4:]
        else:
            return '+353' + phone_number[3:]
    elif phone_number.startswith('+353'):
        return phone_number
    else:
        raise ValueError(
            "Invalid Irish phone number format. Number should start with '353' or '+353'.")


def validate_phone_number(phone_number):
    """
    Validate the phone number format.
    """
    pattern = re.compile(r"^\+?[1-9]\d{1,14}$")
    return bool(pattern.match(phone_number))


def validate_verification_code(code):
    """
    Validate the format of the verification code.
    """
    return code.isdigit() and len(code) == 6


def handle_api_error(e):
    """
    Centralized error handler for API routes.
    """
    error_message = "An error occurred while processing your request."
    if isinstance(e, ValueError):
        error_message = str(e)
    elif isinstance(e, KeyError):
        error_message = "Missing required data in the request."
    print(f"Error: {str(e)}")
    return jsonify({"error": error_message}), 500


'''
Login And Register Routes
'''


@app.route('/register', methods=['POST'])
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

        if Users.objects(username=username).first():
            return jsonify({"error": "Username already exists"}), 409
        if Users.objects(phone_number=full_phone_number).first():
            return jsonify({"error": "Phone number is already associated with another account"}), 409

        verification_code = str(random.randint(100000, 999999))
        hashed_code = bcrypt.hashpw(
            verification_code.encode('utf-8'), bcrypt.gensalt()
        )

        session['new_user'] = {
            "full_name": full_name,
            "username": username,
            "phone_number": full_phone_number,
            "verification_code": hashed_code,
            "verified": False,
            "login_code": "",
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


@app.route('/register/verify', methods=['POST'])
@require_api_key
def verify():
    try:
        data = request.get_json()
        username = data['username']
        code = data['code']

        if not validate_verification_code(code):
            return jsonify({"error": "Invalid code format"}), 400

        new_user = session.get('new_user')
        if not new_user or new_user['username'] != username:
            return jsonify({"error": "User data not found or session expired"}), 404

        if bcrypt.checkpw(code.encode('utf-8'), new_user['verification_code']):
            new_user_data = session.pop('new_user', None)
            if not new_user_data:
                return jsonify({"error": "User data not found or session expired"}), 404

            new_user_data.pop('verification_code', None)
            new_user = Users(**new_user_data)
            new_user.save()  # Save the verified user to the database
            session['current_user'] = {
                "username": new_user.username,
                "phone_number": new_user.phone_number
            }

            session.pop('new_user', None)
            access_token = create_access_token(
                identity=new_user["phone_number"])
            return jsonify({
                "message": "Verification successful!",
                "access_token": access_token
            }), 200
        else:
            return jsonify({"error": "Verification failed"}), 401
    except Exception as e:
        return handle_api_error(e)


@app.route('/login', methods=['POST'])
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

        user = Users.objects(phone_number=standardized_phone_number).first()

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


@app.route('/login_verify', methods=['POST'])
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

        user = Users.objects(phone_number=standardized_phone_number).first()

        if not user:
            return jsonify({"error": "User not found"}), 404
        stored_login_code = user.login_code
        stored_login_code_bytes = stored_login_code.encode('utf-8')
        if bcrypt.checkpw(code.encode('utf-8'), stored_login_code_bytes):
            user.update(unset__login_code=True)

            user_data_for_session = {
                "username": user.username,
                "phone_number": user.phone_number,
                # add other necessary fields here
            }
            session['current_user'] = user_data_for_session
            access_token = create_access_token(
                identity=standardized_phone_number)
            return jsonify({
                "message": "Login successful!",
                "access_token": access_token
            }), 200
        else:
            return jsonify({"error": "Login failed"}), 401

    except Exception as e:
        return handle_api_error(e)


@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


'''
User Account Routes
'''


@app.route('/account', methods=['POST'])
@require_api_key
def account():
    try:
        data = request.get_json()
        phone = data.get('phone_number')

        if not phone:
            return jsonify({"error": "Phone number not provided"}), 400

        user_info = Users.objects(phone_number=phone).first()

        if user_info:
            # Convert the user_info to a Python dictionary
            user_info_dict = user_info.to_mongo().to_dict()

            # Exclude some fields from the response if needed
            excluded_fields = ['_id', 'verification_code',
                               'verified', 'login_code', 'updated_at']
            for field in excluded_fields:
                user_info_dict.pop(field, None)

            return jsonify({"message": "User found", "user": user_info_dict}), 200
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        return jsonify({"error": f"Error fetching user account information: {str(e)}"}), 500


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
        return handle_api_error(e)


@app.route('/logout', methods=['POST'])
def logout():
    try:
        session.pop('username', None)
        return jsonify({"message": "Logout successful!"})
    except Exception as e:
        return handle_api_error(e)


@app.route('/edit_account', methods=['PATCH'])
@require_api_key
def edit_account():
    try:
        username = session.get('username')

        if not username:
            return jsonify({"error": "User not logged in"}), 401

        data = request.get_json()
        user = Users.objects(username=username).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        # Update user fields if they are in the request
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'phone_number' in data:
            user.phone_number = data['phone_number']
        if 'email' in data:
            user.email = data['email']

        user.save()

        return jsonify({"message": "Account updated successfully"}), 200

    except Exception as e:
        return handle_api_error(e)


'''
User Vehicle Routes
'''


# ! This is the route for sending fuel stations info to Frontend
@app.route('/fuel_stations', methods=['GET'])
def get_fuel_stations():
    try:
        stations = FuelStation.objects.all()
        result = []

        for station in stations:
            # Serialize FuelStation data
            station_data = {
                'name': station.name,
                'location': {
                    'latitude': station.location.latitude,
                    'longitude': station.location.longitude
                },
                'is_charging_station': station.is_charging_station,
                'charging_rates': station.charging_rates
            }

            # Fetch and serialize FuelPrices data
            prices = FuelPrices.objects(fuel_station=station).first()
            if prices:
                station_data['prices'] = {
                    'petrol_price': prices.petrol_price,
                    'diesel_price': prices.diesel_price,
                    'electricity_price': prices.electricity_price,
                    'updated_at': prices.updated_at.strftime('%Y-%m-%d %H:%M:%S')
                }
            else:
                station_data['prices'] = 'No prices available'

            result.append(station_data)

        return jsonify(result)
    except Exception as e:
        return handle_api_error(e)


# ! This is the route for storing fuel stations info from Frontend
@app.route('/store_fuel_stations', methods=['POST'])
def store_fuel_stations():
    try:
        data = request.get_json()
        station = data.get('fuelStation')  # Expecting a single station object

        if not station:
            return jsonify({"error": "Fuel station data not provided"}), 400

        # Create and save the location
        location_data = station.get('location', {})
        location = Location(latitude=location_data.get('latitude'),
                            longitude=location_data.get('longitude'))
        location.save()

        # Create the fuel station without saving it yet
        new_station = FuelStation(
            name=station.get('name'),
            location=location,
            is_charging_station=station.get('is_charging_station', False)
        )

        # Check for fuel price data
        if 'fuelPrices' in station:
            prices = station['fuelPrices']
            fuel_prices = FuelPrices(
                fuel_station=new_station,
                petrol_price=prices.get('petrol_price'),
                diesel_price=prices.get('diesel_price'),
                electricity_price=prices.get('electricity_price'),
                updated_at=datetime.utcnow()
            )
            fuel_prices.save()

            # Set charging_rates as a reference to FuelPrices
            new_station.charging_rates = fuel_prices

        new_station.save()

        return jsonify({"message": "Fuel stations and prices stored successfully"})
    except Exception as e:
        return handle_api_error(e)


# ! This is the route for storing petrol fuel prices info from Frontend
@app.route('/store_fuel_prices', methods=['POST'])
def store_fuel_prices():
    try:
        data = request.get_json()
        fuel_prices_data = data.get('fuelPrices', [])

        for price_data in fuel_prices_data:
            station_id = price_data.get('station_id')
            fuel_station = FuelStation.objects(id=station_id).first()

            if not fuel_station:
                continue  # Or handle the error as needed

            # Check if there's an existing price record for this station
            existing_price = FuelPrices.objects(
                fuel_station=fuel_station).first()

            if existing_price:
                # Update existing record
                if 'petrol_price' in price_data:
                    existing_price.petrol_price = price_data['petrol_price']
                if 'diesel_price' in price_data:
                    existing_price.diesel_price = price_data['diesel_price']
                if 'electricity_price' in price_data:
                    existing_price.electricity_price = price_data['electricity_price']
                existing_price.updated_at = price_data.get('timestamp')
                existing_price.save()
            else:
                # Create new price record
                new_price = FuelPrices(
                    fuel_station=fuel_station,
                    petrol_price=price_data.get('petrol_price'),
                    diesel_price=price_data.get('diesel_price'),
                    electricity_price=price_data.get('electricity_price'),
                    updated_at=price_data.get('timestamp')
                )
                new_price.save()

        return jsonify({"message": "Fuel prices stored successfully"})
    except Exception as e:
        return handle_api_error(e)


@app.route('/user_spending', methods=['POST'])
@require_api_key
def user_spending():
    nn()


if __name__ == '__main__':
    app.run(debug=True)
