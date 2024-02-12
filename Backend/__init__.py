#! /usr/bin/python3
# From System
import io
import os
# Flask Related Imports
from flask import Flask, request, jsonify, abort, current_app
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS

# Database Related Imports
from database import Database
from models import FuelStation, Location, Users, FuelPrices, BudgetHistory, FriendRequest, Friends, Notification, \
    ChargingStation, EVPrices, Trip, PetrolPrices, DieselPrices, FavoriteFuelStation, Deduction, WeeklyBudget
from mongoengine.queryset.visitor import Q
from mongoengine.errors import DoesNotExist, ValidationError

# Ecryption Related Imports
import binascii
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import bcrypt

# Twilio Related Imports
from twilio.rest import Client
import random
from datetime import datetime
from functools import wraps
import re


import numpy as np
from sklearn.preprocessing import MinMaxScaler
import pandas as pd

# loading environment variables
from dotenv import load_dotenv
load_dotenv()

# Flask configuration
app = Flask(__name__)
CORS(app, resources={
    r"/*": {"origins": "http://localhost:19006"}}, supports_credentials=True)
app.secret_key = "production"  # os.random(24)
api_key = os.getenv('API_KEY')

# Change this to a secure secret key
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)

# Twilio configuration
account_sid = os.getenv('TWILIO_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
twilio_number = os.getenv('TWILIO_PHONE_NUMBER')
twilio_client = Client(account_sid, auth_token)

# MongoDB Configuration
db = Database()
new_user_session = {}

# API Key Configuration
def require_api_key(view_function):
    @wraps(view_function)
    def decorated_function(*args, **kwargs):
        if request.headers.get('X-API-KEY') and request.headers.get('X-API-KEY') == api_key:
            return view_function(*args, **kwargs)
        else:
            abort(401)

    return decorated_function

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

def radius_logic(coord1, coord2):
    # Haversine formula to calculate distance between two points on the Earth
    import math

    lat1, lon1 = coord1
    lat2, lon2 = coord2
    R = 6371  # Radius of the Earth in kilometers

    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat / 2) * math.sin(dLat / 2) + math.cos(math.radians(lat1)) \
        * math.cos(math.radians(lat2)) * math.sin(dLon / 2) * math.sin(dLon / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c

    return distance

# Phone number standardization and validation
def standardize_phone_number(phone_number):
    """
    Standardize UK and Irish phone numbers to include the country code.
    """
    if phone_number.startswith('353') and not phone_number.startswith('+353'):
        if len(phone_number) > 3 and phone_number[3] == '0':
            return '+353' + phone_number[4:]
        else:
            return '+353' + phone_number[3:]
    elif phone_number.startswith('+353'):
        return phone_number
    elif phone_number.startswith('44') and not phone_number.startswith('+44'):
        return '+44' + phone_number[2:]
    elif phone_number.startswith('+44'):
        return phone_number
    else:
        raise ValueError(
            "Invalid Irish or UK phone number format. Number should start with '353' or '+353', '44' or '+44'.")


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


# AES Encryption and Decryption
def get_aes_key():
    key_hex = os.environ.get('ENCRYPTION_KEY')
    iv_hex = os.environ.get('AES_FIXED_IV')

    key = binascii.unhexlify(key_hex)
    iv = binascii.unhexlify(iv_hex)

    return key, iv


encryption_key, fixed_iv = get_aes_key()

def aes_encrypt(plaintext, key):
    cipher = AES.new(key, AES.MODE_CBC, fixed_iv)
    padded_text = pad(plaintext.encode(), AES.block_size)
    return cipher.encrypt(padded_text).hex()


def aes_decrypt(ciphertext, key):
    cipher = AES.new(key, AES.MODE_CBC, fixed_iv)
    decrypted_data = unpad(cipher.decrypt(
        bytes.fromhex(ciphertext)), AES.block_size)
    return decrypted_data.decode()


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

        full_phone_number = standardize_phone_number(phone_number)
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


@app.route('/register/verify', methods=['POST'])
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


@app.route('/login', methods=['POST'])
@require_api_key
def login():
    try:
        data = request.get_json()
        phone_number = data['phone_number']

        if not phone_number:
            return jsonify({"error": "Phone number is required"}), 400

        try:
            standardized_phone_number = standardize_phone_number(phone_number)
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
            standardized_phone_number = standardize_phone_number(phone_number)
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


@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


'''
User Account Routes
Consists of the following routes: account, delete_account, logout, edit_account, update_budget, get_deductions
'''


# TODO Display issue with phone numbers on account screen
@app.route('/account', methods=['POST'])
@require_api_key
def account():
    try:
        data = request.get_json()
        encrypted_phone = data.get('phone_number')

        print("Encrypted Phone Number:", encrypted_phone)

        if not encrypted_phone:
            return jsonify({"error": "Phone number not provided"}), 400

        try:
            decrypted_phone = aes_decrypt(encrypted_phone, encryption_key)
            print("Decrypted Phone Number:", decrypted_phone)
        except Exception as e:
            return jsonify({"error": f"Error decrypting phone number: {str(e)}"}), 500

        user_info = Users.objects(phone_number=encrypted_phone).first()

        if user_info:
            # Convert the user_info to a Python dictionary
            user_info_dict = user_info.to_mongo().to_dict()

            # Replace the encrypted phone number with the decrypted one
            user_info_dict['phone_number'] = decrypted_phone

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
        data = request.get_json()
        encrypted_phone = data.get('phone_number')

        if not encrypted_phone:
            return jsonify({"error": "Phone number not provided"}), 400

        user_info = Users.objects(phone_number=encrypted_phone).first()

        if user_info:
            user_info.delete()
            return jsonify({"message": "Account deleted successfully!"})
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        return handle_api_error(e)


@app.route('/logout', methods=['POST'])
@require_api_key
def logout():
    try:
        return jsonify({"message": "Logout successful!"})
    except Exception as e:
        return handle_api_error(e)


# TODO Fix standardising phone number/ hashing phone number
@app.route('/edit_account', methods=['PATCH'])
@require_api_key
def edit_account():
    try:
        data = request.get_json()
        username = data.get('username')

        user = Users.objects(username=username).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        if 'phone_number' in data:
            decrypted_phone = aes_encrypt(data['phone_number'], encryption_key)
            user.phone_number = decrypted_phone

        # Update user fields if they are in the request
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'email' in data:
            user.email = data['email']

        user.save()

        return jsonify({"message": "Account updated successfully"}), 200

    except Exception as e:
        return handle_api_error(e)


# Modify update_budget route
@app.route('/update_budget', methods=['POST'])
@require_api_key
def update_budget():
    try:
        data = request.get_json()
        username = data.get('username')

        # Check if either weekly_budget or deductions is provided
        if 'weekly_budget' not in data and 'deductions' not in data:
            return jsonify({"error": "Weekly budget or deductions not provided"}), 400

        try:
            user = Users.objects.get(username=username)

            budget_history = BudgetHistory.objects(user=user).first()

            if budget_history is None:
                budget_history = BudgetHistory(user=user)

            if 'weekly_budget' in data:
                try:
                    weekly_budget = float(data['weekly_budget'])
                    budget_history.weekly_budgets.append(
                        WeeklyBudget(amount=weekly_budget))
                    user.weekly_budget = weekly_budget
                except ValueError:
                    return jsonify({"error": "Invalid weekly budget format"}), 400

            if 'deductions' in data:
                deductions = data['deductions']
                if isinstance(deductions, list):
                    budget_history.deductions.extend(
                        [Deduction(amount=d) for d in deductions])
                else:
                    budget_history.deductions.append(
                        Deduction(amount=deductions))

            budget_history.change_date = datetime.now()

            # Save the updated document
            budget_history.save()
            user.save()

            return jsonify({"message": "Budget updated successfully"})
        except DoesNotExist:
            return jsonify({"error": "User not found"}), 404
        except ValidationError as e:
            return jsonify({"error": str(e)}), 400

    except Exception as e:
        return handle_api_error(e)

@app.route('/get_deductions', methods=['POST'])
@require_api_key
def get_deductions():
    try:
        data = request.get_json()
        username = data.get('username')

        user = Users.objects.get(username=username)
        budget_history = BudgetHistory.objects(user=user).first()

        if budget_history is None:
            return jsonify({"error": "No budget history found for the user"}), 404

        deductions = [{
            "amount": deduction.amount,
            "updated_at": deduction.updated_at.strftime("%Y-%m-%d %H:%M:%S") if deduction.updated_at else None
        } for deduction in budget_history.deductions]

        return jsonify({"deductions": deductions})

    except DoesNotExist:
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return handle_api_error(e)
'''
Gas Station Routes
consists of the following routes: fuel_stations, store_fuel_stations, store_fuel_prices, search_fuel_stations
'''
# ! This is the route for sending fuel stations info to Frontend


@app.route('/fuel_stations', methods=['GET'])
@require_api_key
def get_fuel_stations():
    try:
        fuel_stations = FuelStation.objects.all()

        result = []
        for fuel_station in fuel_stations:
            station_data = {
                'id': str(fuel_station.id),
                'name': fuel_station.name,
                'address': fuel_station.address,
                'location': {
                    'latitude': fuel_station.latitude,
                    'longitude': fuel_station.longitude
                },
                # handle null values and have -1 to ensure to get the latest price (may change this after frontend is done)
                'prices': {
                    'petrol_price': fuel_station.petrol_prices[-1].price if fuel_station.petrol_prices else None,
                    'petrol_updated_at': fuel_station.petrol_prices[-1].updated_at.strftime('%Y-%m-%d %H:%M:%S') if fuel_station.petrol_prices else None,
                    'diesel_price': fuel_station.diesel_prices[-1].price if fuel_station.diesel_prices else None,
                    'diesel_updated_at': fuel_station.diesel_prices[-1].updated_at.strftime('%Y-%m-%d %H:%M:%S') if fuel_station.diesel_prices else None
                },
            }

            result.append(station_data)

        return jsonify(result)
    except Exception as e:
        current_app.logger.error('An error occurred: %s', str(e))
        return handle_api_error(e)

# ! This is the route for storing fuel stations info from Frontend
@app.route('/store_fuel_stations', methods=['POST'])
@require_api_key
def store_fuel_stations():
    try:
        data = request.get_json()
        station = data.get('fuelStation')

        if not station:
            return jsonify({"error": "Fuel station data not provided"}), 400

        location = Location(latitude=station['latitude'],
                            longitude=station['longitude'])
        location.save()

        new_station = FuelStation(
            name=station['name'],
            address=station['address'],
            location=location,
            is_charging_station=station.get('is_charging_station', False),
            is_fuel_station=station.get(
                'is_fuel_station', True)  # Default to True
        )
        new_station.save()

        return jsonify({"message": "Fuel station stored successfully"})
    except Exception as e:
        return handle_api_error(e)

# individually finds favorite fuel stations for a user
# got the username sent from response body, then find the user object, searched FavoriteFuelStation collection for the user object
# then got the favorite_stations field which is a list of fuel station objects, then got the id of each fuel station object
# ref: https://www.mongodb.com/docs/v6.2/reference/method/ObjectId/
# ref: https://www.mongodb.com/docs/manual/reference/database-references/
@app.route('/get_favorite_fuel_stations/', methods=['GET'])
@require_api_key
def get_favorite_fuel_stations():
    try:
        username = request.args.get('username')

        if username:
            user = Users.objects(username=username).first()
            if user:
                favorite_doc = FavoriteFuelStation.objects(
                    user=user.id).first()
                if favorite_doc:
                    favorite_stations = favorite_doc.favorite_stations

                    fuel_stations = FuelStation.objects(
                        id__in=[dbref.id for dbref in favorite_stations])

                    station_list = [
                        {
                            "station_id": str(station.id),
                            "name": station.name,
                            "phone_number": station.phone_number,
                            "location": {
                                "latitude": station.latitude,
                                "longitude": station.longitude,
                            }
                        } for station in fuel_stations
                    ]
                    return jsonify({"favorite_stations": station_list}), 200
                else:
                    return jsonify({"message": "No favorite fuel stations found for the user."}), 200
            else:
                return jsonify({"error": "User not found with the provided username."}), 404
        else:
            return jsonify({"error": "Username not provided."}), 400

    except Exception as e:
        return handle_api_error(e)


# this route is for managing favorite fuel station (add/remove)
@app.route('/manage_favorite_fuel_station', methods=['POST'])
@require_api_key
def favorite_fuel_station():
    try:
        data = request.get_json()
        username = data.get('username')

        user = Users.objects(username=username).first()

        if user:
            user_id = user.id
        else:
            return jsonify({"error": "User not found."}), 404

        station_id = data.get('station_id')

        # checks both collections to ensure user and station exists
        user = Users.objects(id=user_id).first()
        station = FuelStation.objects(id=station_id).first()

        # goes through some cases for adding or removing favorite fuel station
        if user and station:
            favorite_doc = FavoriteFuelStation.objects(user=user).first()

            if not favorite_doc:
                favorite_doc = FavoriteFuelStation(
                    user=user, favorite_stations=[station])
                favorite_doc.save()
                return jsonify({"message": f"Fuel station '{station.name}' has been added to favorites. user: '{user_id}'"}), 200

            elif station in favorite_doc.favorite_stations:
                favorite_doc.favorite_stations.remove(station)
                favorite_doc.save()
                return jsonify({"message": f"Fuel station '{station.name}' has been removed from favorites. user: '{user_id}'"}), 200

            else:
                favorite_doc.favorite_stations.append(station)
                favorite_doc.save()
                return jsonify({"message": f"Fuel station '{station.name}' has been added to favorites. user: '{user_id}'"}), 200

        else:
            return jsonify({"error": "User or fuel station not found."}), 404

    except Exception as e:
        return handle_api_error(e)

# ! This is the route for storing petrol fuel prices info from Frontend


@app.route('/store_fuel_prices', methods=['POST'])
@require_api_key
def store_fuel_prices():
    try:
        data = request.get_json()
        fuel_prices_data = data.get('fuelPrices', [])

        for price_data in fuel_prices_data:
            station_id = price_data.get('station_id')
            fuel_station = FuelStation.objects(id=station_id).first()

            if not fuel_station:
                continue

            # used pop to remove the last element in the list
            if fuel_station.petrol_prices:
                fuel_station.petrol_prices.pop()
            if fuel_station.diesel_prices:
                fuel_station.diesel_prices.pop()

            petrol_price = price_data.get('petrol_price')
            diesel_price = price_data.get('diesel_price')

            fuel_station.petrol_prices.append(PetrolPrices(
                price=petrol_price, updated_at=datetime.utcnow()))
            fuel_station.diesel_prices.append(DieselPrices(
                price=diesel_price, updated_at=datetime.utcnow()))
            fuel_station.save()

            new_price = FuelPrices(
                station=fuel_station,
                petrol_prices=[PetrolPrices(
                    price=petrol_price, updated_at=datetime.utcnow())],
                diesel_prices=[DieselPrices(
                    price=diesel_price, updated_at=datetime.utcnow())],
                updated_at=datetime.utcnow()
            )
            print('new_price', new_price)
            new_price.save()

        return jsonify({"message": "Fuel prices stored successfully"})
    except DoesNotExist:
        return jsonify({"error": "Fuel station not found"}), 404
    except Exception as e:
        return handle_api_error(e)


@app.route('/store_ev_prices', methods=['POST'])
@require_api_key
def store_ev_prices():
    try:
        data = request.get_json()
        ev_prices_data = data.get('evPrices', [])

        for price_data in ev_prices_data:
            station_id = price_data.get('station_id')
            charging_station = ChargingStation.objects(id=station_id).first()

            if not charging_station:
                continue

            existing_price = EVPrices.objects(
                charging_station=charging_station).first()

            if existing_price:
                existing_price.charging_price = price_data.get(
                    'charging_price', existing_price.charging_price)
                existing_price.updated_at = datetime.strptime(
                    price_data.get('timestamp'), '%Y-%m-%d %H:%M:%S')
                existing_price.save()
            else:
                new_price = EVPrices(
                    charging_station=charging_station,
                    charging_price=price_data.get('charging_price'),
                    updated_at=datetime.strptime(
                        price_data.get('timestamp'), '%Y-%m-%d %H:%M:%S')
                )
                new_price.save()

        return jsonify({"message": "EV charging prices stored successfully"})
    except Exception as e:
        return handle_api_error(e)


# ! This is the route for searching fuel stations
@app.route('/search_fuel_stations', methods=['GET'])
@require_api_key
def search_fuel_stations():
    try:
        query_params = request.args
        name = query_params.get('name')

        if not name:
            return jsonify({'error': 'Name is required for the search.'})

        query = Q(name__icontains=name)
        stations = FuelStation.objects(query)

        result = [{'name': station.name, 'address': station.address,
                   'latitude': station.latitude, 'longitude': station.longitude} for station in stations]

        return jsonify(result)
    except Exception as e:
        return handle_api_error(e)


'''
Friends Routes
'''
@app.route('/send_friend_request', methods=['POST'])
@require_api_key
def send_friend_request():
    try:
        data = request.get_json()
        current_user = data['phone_number']
        recipient_user = data['friend_number']
        message = data.get('message', '')

        print("Current User:", current_user)
        print("Recipient User:", recipient_user)

        sender = Users.objects.get(phone_number=current_user)
        recipient = Users.objects.get(phone_number=recipient_user)

        if not recipient:
            return jsonify({"error": "Recipient not found"}), 404

        existing_request = FriendRequest.objects(
            sender=sender, recipient=recipient).first()
        if existing_request:
            return jsonify({"error": "Friend request already sent"}), 400

        print("Sender:", sender)
        print("Recipient:", recipient)
        print(existing_request)

        friend_request = FriendRequest(
            sender=sender,
            recipient=recipient,
            message=message,
            status='pending'
        )
        friend_request.save()

        return jsonify({"message": "Friend request sent successfully"}), 200

    except Exception as e:
        return handle_api_error(e)


# ! This route is for displaying user's friends
@app.route('/list_friends', methods=['GET', 'POST'])
@require_api_key
def list_friends():
    try:
        data = request.get_json()
        current_user = data['phone_number']

        print("Current User:", current_user)

        sender = Users.objects.get(phone_number=current_user)

        print(sender)

        friends = Friends.objects(Q(user1=sender) | Q(user2=sender))

        friends_list = []
        for friend in friends:
            friend_user = friend.user1 if friend.user2.id == sender.id else friend.user2
            friends_list.append({
                'friend_id': str(friend_user.id),
                'friend_name': friend_user.full_name
            })

        return jsonify({"friends": friends_list}), 200

    except Exception as e:
        return handle_api_error(e)


@app.route('/requested_friends', methods=['POST'])
@require_api_key
def requested_friends():
    try:
        data = request.get_json()
        current_user = data['phone_number']

        print("Current User:", current_user)

        recipient = Users.objects.get(phone_number=current_user)

        print(recipient)

        # Only include friend requests that are not accepted
        friend_requests = FriendRequest.objects(
            recipient=recipient, status='pending')

        requested_friends_list = []
        for friend_request in friend_requests:
            requested_friend_user = friend_request.sender
            requested_friends_list.append({
                'friend_id': str(requested_friend_user.id),
                'friend_name': requested_friend_user.full_name,
                'request_id': str(friend_request.id),  # Include the request_id
            })

        return jsonify({"requested_friends": requested_friends_list}), 200

    except Exception as e:
        return handle_api_error(e)


# ! This route is for accepting or rejecting friend requests


@app.route('/respond_friend_request', methods=['POST'])
@require_api_key
def respond_friend_request():
    try:
        data = request.get_json()
        current_user = data['phone_number']
        request_id = data['request_id']
        action = data['action']

        print("Current User:", current_user)
        print("Request ID:", request_id)
        print("Action:", action)

        if action not in ['accept', 'reject']:
            return jsonify({"error": "Invalid action"}), 400

        friend_request = FriendRequest.objects.get(id=request_id)

        if friend_request.recipient.phone_number != current_user:
            return jsonify({"error": "Unauthorized action"}), 403

        if action == 'accept':
            friend_request.change_status('accepted')
            Friends(
                user1=friend_request.sender,
                user2=friend_request.recipient
            ).save()

            Notification(
                user=friend_request.sender,
                message=f"Your friend request to {friend_request.recipient.full_name} has been accepted.",
                type='friend_request_accepted',
                related_document=friend_request
            ).save()

            message = "Friend request accepted"
        else:
            friend_request.change_status('rejected')

            Notification(
                user=friend_request.sender,
                message=f"Your friend request to {friend_request.recipient.full_name} has been rejected.",
                type='friend_request_rejected',
                related_document=friend_request
            ).save()

            message = "Friend request rejected"

        return jsonify({"message": message}), 200

    except DoesNotExist:
        return jsonify({"error": "Friend request not found"}), 404
    except Exception as e:
        return handle_api_error(e)

# ! This route is for canceling friend requests
@app.route('/cancel_friend_request', methods=['POST'])
@require_api_key
@jwt_required()
def cancel_friend_request():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        request_id = data['request_id']

        friend_request = FriendRequest.objects.get(id=request_id)

        if friend_request.sender.id != current_user_id:
            return jsonify({"error": "Unauthorized action"}), 403

        friend_request.update(status='canceled')

        Notification(
            user=friend_request.recipient,
            message=f"Friend request from {friend_request.sender.full_name} has been canceled",
            type='friend_request_canceled',
            related_document=friend_request
        ).save()

        return jsonify({"message": "Friend request canceled"}), 200

    except Exception as e:
        return handle_api_error(e)


# ! This route is for removing friends
@app.route('/remove_friend', methods=['POST'])
@require_api_key
@jwt_required()
def remove_friend():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        friend_id = data['friend_id']

        current_user = Users.objects.get(id=current_user_id)
        friend_user = Users.objects.get(id=friend_id)

        if not friend_user:
            return jsonify({"error": "Friend not found"}), 404

        friendship = Friends.objects(
            (Q(user1=current_user) & Q(user2=friend_user)) |
            (Q(user1=friend_user) & Q(user2=current_user))
        ).first()

        if not friendship:
            return jsonify({"error": "Friendship does not exist"}), 404

        friendship.delete()

        return jsonify({"message": "Friend removed successfully"}), 200

    except DoesNotExist:
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return handle_api_error(e)


#! This route is for searching friends
@app.route('/search_users', methods=['GET', 'POST'])
@require_api_key
def search_users():
    try:
        data = request.get_json()
        phone_number = data.get('phone_number')
        search_term = data.get('search_term')

        if not search_term:
            return jsonify({"error": "Search term is required"}), 400

        # Exclude the current user and search for others
        users = Users.objects(
            (Q(username__icontains=search_term) | Q(phone_number__icontains=search_term)) &
            Q(phone_number__ne=phone_number)
        )

        users_list = [{'user_id': str(user.id), 'username': user.username, 'phone_number': user.phone_number}
                      for user in users]

        return jsonify({"users": users_list}), 200

    except Exception as e:
        return handle_api_error(e)

#! This route is for sending friend requests
@app.route('/send_friend_request2', methods=['POST'])
@require_api_key
@jwt_required()
def sending_friend_request2():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        recipient_id = data.get('recipient_id')

        if not recipient_id:
            return jsonify({"error": "Recipient ID is required"}), 400

        sender = Users.objects.get(id=current_user_id)
        recipient = Users.objects(id=recipient_id).first()

        if not recipient:
            return jsonify({"error": "Recipient not found"}), 404

        # Check for existing friend request
        existing_request = FriendRequest.objects(
            (Q(sender=sender) & Q(recipient=recipient)) |
            (Q(sender=recipient) & Q(recipient=sender))
        ).first()

        if existing_request:
            return jsonify({"error": "Friend request already sent or exists"}), 400

        friend_request = FriendRequest(
            sender=sender, recipient=recipient, status='pending').save()

        return jsonify({"message": "Friend request sent successfully"}), 200

    except Exception as e:
        return handle_api_error(e)


'''
Trip Routes
consists of the following routes: save_trip, user_suggested_budget
'''

#! This route is for saving trips


@app.route('/save_trip', methods=['POST'])
@require_api_key
@jwt_required()
def save_trip():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        start_lat = data.get('start_latitude')
        start_long = data.get('start_longitude')
        end_lat = data.get('end_latitude')
        end_long = data.get('end_longitude')
        distance = data.get('distance')

        # Validate required fields
        if not all([start_lat, start_long, end_lat, end_long, distance]):
            return jsonify({"error": "Missing required trip data"}), 400

        # Create Location instances for start and end points
        start_location = Location(
            latitude=start_lat, longitude=start_long).save()
        end_location = Location(latitude=end_lat, longitude=end_long).save()

        # Create and save the trip
        new_trip = Trip(
            user=Users.objects.get(id=current_user_id),
            start_location=start_location,
            end_location=end_location,
            distance=distance
        ).save()

        return jsonify({"message": "Trip saved successfully"}), 200

    except Exception as e:
        return handle_api_error(e)


@app.route('/user_suggested_budget', methods=['POST'])
@require_api_key
def user_suggested_budget():
    from keras.models import load_model

    def load_saved_model(model_path):
        return load_model(model_path)

# Define the make_prediction function
    def make_prediction(model, scaler, last_weeks_data, look_back):
        # Reshape and scale the input data
        last_weeks_data = np.array(last_weeks_data).reshape(-1, 1)
        last_weeks_data_scaled = scaler.transform(last_weeks_data)
        last_weeks_data_scaled = last_weeks_data_scaled.reshape(
            1, look_back, 1)

        # Make the prediction
        predicted_price = model.predict(last_weeks_data_scaled)
        predicted_price = scaler.inverse_transform(predicted_price)
        return predicted_price[0][0]

    # Define the model path and look_back period
    look_back = 10
    model_path = 'Backend/Updated_user_model.h5'

    # Load the pre-trained model
    model = load_saved_model(model_path)

    # Initialize the scaler
    scaler = MinMaxScaler(feature_range=(0, 1))
    df = pd.read_csv('Backend/unseen_spending_data.csv')
    data = df['Total'].values.reshape(-1, 1)
    scaler.fit(data)

    current_user = request.get_json()
    username = current_user['username']

    user_budget_history = BudgetHistory.objects(user=Users.objects(
        username=username).first()).order_by('-date_created')

    if user_budget_history:
        for budget_history in user_budget_history:
            print(budget_history.new_budget)
    else:
        print('Budget not set')

    def round_to_nearest_10(predicted_price):
        # Round the predicted price to the nearest 10
        adjusted_predicted_price = round(predicted_price / 10) * 10
        return adjusted_predicted_price

    # Get the last week's data
    last_weeks_data = [
        budget_history.new_budget for budget_history in user_budget_history][:look_back]

    # Make the prediction
    predicted_price = make_prediction(
        model, scaler, last_weeks_data, look_back)

    # Adjust the prediction to the nearest 10
    adjusted_predicted_price = round_to_nearest_10(predicted_price)

    print("Next Week's Predicted Price is: ", predicted_price)
    print("Adjusted Predicted Price to the nearest 10 is: ",
          adjusted_predicted_price)


'''
OCR Routes
consists of the following routes: ocr_uploaded_image
'''

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg'}


def extract_receipt_info_single(receipt_text):
    import re
    from fuzzywuzzy import process
    # Convert all text to lowercase to simplify matching
    text_lower = receipt_text.lower()

    # Initialize the result dictionary
    info = {
        'fuel_type': None,
        'volume': None,
        'price_per_litre': None,
        'total': None
    }

    # https://stackoverflow.com/questions/1547574/regex-for-prices
    volume_pattern = r"(?i)(?:volume|;|:|diesel|unleaded|pump\s*([a-z]|[0-9])|\))\s*(\d+(?:[.,]\d{2}))\s*°?\s*(ltr|l|net)?"

    price_per_litre_pattern = r"(?:price|€)\s*([1-9][.,]\d{3})\s*(eur/l|/l|/)?\s*"

    # Define fuel type choices for fuzzy matching
    fuel_type_choices = ["unleaded", "diesel"]

    # Search for fuel type with fuzzy match
    fuel_type_match = process.extractOne(
        text_lower, fuel_type_choices, score_cutoff=50)
    if fuel_type_match:
        info['fuel_type'] = fuel_type_match[0]

    # Search for volume
    volume_match = re.search(volume_pattern, text_lower)
    if volume_match:
        info['volume'] = next((m for m in volume_match.groups() if m), None)
        if info['volume'] is not None:
            info['volume'] = info['volume'].replace(',', '.')

    # Search for price per litre
    price_per_litre_match = re.search(price_per_litre_pattern, text_lower)
    if price_per_litre_match:
        info['price_per_litre'] = next(
            (m for m in price_per_litre_match.groups() if m), None)
        if info['price_per_litre'] is not None:
            info['price_per_litre'] = info['price_per_litre'].replace(',', '.')

    if info['volume'] is not None and info['price_per_litre'] is not None:
        total = float(info['volume']) * float(info['price_per_litre'])
        total = round(total, 2)
        info['total'] = total
    else:
        info['total'] = None

    return info


@app.route('/ocr_uploaded_image', methods=['POST'])
def upload_file():
    import cv2
    import numpy as np
    import pytesseract

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        try:
            # Read the file's content into a numpy array
            in_memory_file = io.BytesIO()
            file.save(in_memory_file)
            data = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)
            image = cv2.imdecode(data, cv2.IMREAD_COLOR)

            # Process the image
            image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            image = cv2.threshold(
                image, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
            text = pytesseract.image_to_string(image)
            filtered_text = '\n'.join(
                line for line in text.split('\n') if line.strip() != '')

            extracted_info_single = extract_receipt_info_single(filtered_text)

            return jsonify(extracted_info_single)
        except Exception as e:
            # Handle general exceptions
            return jsonify({'error': 'Failed to process image', 'details': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid file format'}), 400


if __name__ == '__main__':
    app.run(debug=True)
