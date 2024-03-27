#! /usr/bin/env python3

from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from mongoengine.errors import DoesNotExist
from src.models import FuelStation, Location, PetrolPrices, DieselPrices, FuelPrices, Users, FavoriteFuelStation, UserActivity
from src.models import ChargingStation, EVPrices
from src.middleware.api_key_middleware import require_api_key
from datetime import datetime
from mongoengine.queryset.visitor import Q
from src.utils.helper_utils import handle_api_error
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from geopy.distance import geodesic


# ! This is the route for sending fuel stations info to Frontend
from flask import request, jsonify

# ref: https://medium.com/@rahulmallah785671/geopy-library-in-python-how-to-calculate-distance-between-two-locations-with-precision-f29e95175f28
@require_api_key
@jwt_required()
def get_fuel_stations():
    try:
        if request.content_type != 'application/json':
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
                    'prices': {
                        'petrol_price': fuel_station.petrol_prices[-1].price if fuel_station.petrol_prices else None,
                        'petrol_updated_at': fuel_station.petrol_prices[-1].updated_at.strftime('%Y-%m-%d %H:%M:%S') if fuel_station.petrol_prices else None,
                        'petrol_price_verified': fuel_station.petrol_prices[-1].price_verified if fuel_station.petrol_prices else None,
                        'diesel_price': fuel_station.diesel_prices[-1].price if fuel_station.diesel_prices else None,
                        'diesel_updated_at': fuel_station.diesel_prices[-1].updated_at.strftime('%Y-%m-%d %H:%M:%S') if fuel_station.diesel_prices else None,
                        'diesel_price_verified': fuel_station.diesel_prices[-1].price_verified if fuel_station.diesel_prices else None,
                    },
                    'facilities': {
                        'car_wash': fuel_station.facilities.car_wash,
                        'car_repair': fuel_station.facilities.car_repair,
                        'car_service': fuel_station.facilities.car_service,
                        'car_parking': fuel_station.facilities.car_parking,
                        'atm': fuel_station.facilities.atm,
                        'convenience_store': fuel_station.facilities.convenience_store,
                        'food': fuel_station.facilities.food,
                        'phone_number': fuel_station.phone_number
                    }
                }
                result.append(station_data)

            return jsonify(result)

        data = request.json
        user_latitude = data.get('user_latitude')
        user_longitude = data.get('user_longitude')
        radius = data.get('radius')

        if user_latitude is None or user_longitude is None or radius is None:
            return jsonify({'error': 'Missing required parameters: user_latitude, user_longitude, and radius'}), 400

        user_latitude = float(user_latitude)
        user_longitude = float(user_longitude)
        radius = float(radius)

        user_location = (user_latitude, user_longitude)
        fuel_stations = FuelStation.objects.all()

        result = []
        for fuel_station in fuel_stations:
            station_location = (fuel_station.latitude, fuel_station.longitude)
            distance = geodesic(user_location, station_location).kilometers
            if distance <= radius:
                station_data = {
                    'id': str(fuel_station.id),
                    'name': fuel_station.name,
                    'address': fuel_station.address,
                    'location': {
                        'latitude': fuel_station.latitude,
                        'longitude': fuel_station.longitude
                    },
                    'distance_from_user': distance,
                    'prices': {
                        'petrol_price': fuel_station.petrol_prices[-1].price if fuel_station.petrol_prices else None,
                        'petrol_updated_at': fuel_station.petrol_prices[-1].updated_at.strftime('%Y-%m-%d %H:%M:%S') if fuel_station.petrol_prices else None,
                        'petrol_price_verified': fuel_station.petrol_prices[-1].price_verified if fuel_station.petrol_prices else None,
                        'diesel_price': fuel_station.diesel_prices[-1].price if fuel_station.diesel_prices else None,
                        'diesel_updated_at': fuel_station.diesel_prices[-1].updated_at.strftime('%Y-%m-%d %H:%M:%S') if fuel_station.diesel_prices else None,
                        'diesel_price_verified': fuel_station.diesel_prices[-1].price_verified if fuel_station.diesel_prices else None,
                    },
                    'facilities': {
                        'car_wash': fuel_station.facilities.car_wash,
                        'car_repair': fuel_station.facilities.car_repair,
                        'car_service': fuel_station.facilities.car_service,
                        'car_parking': fuel_station.facilities.car_parking,
                        'atm': fuel_station.facilities.atm,
                        'convenience_store': fuel_station.facilities.convenience_store,
                        'food': fuel_station.facilities.food,
                        'phone_number': fuel_station.phone_number
                    }
                }
                result.append(station_data)

        return jsonify(result)
    except (ExpiredSignatureError, InvalidTokenError) as e:
        current_app.logger.error('JWT Token Error: %s', str(e))
        return jsonify({'error': 'JWT Token Error'}), 401
    except Exception as e:
        return handle_api_error(e)




#! This is the route for storing fuel stations info from Frontend


@require_api_key
@jwt_required()
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

# ? individually finds favorite fuel stations for a user
# ? got the username sent from response body, then find the user object, searched FavoriteFuelStation collection for the user object
# ? then got the favorite_stations field which is a list of fuel station objects, then got the id of each fuel station object
# ? ref: https://www.mongodb.com/docs/v6.2/reference/method/ObjectId/
# ? ref: https://www.mongodb.com/docs/manual/reference/database-references/


@require_api_key
@jwt_required()
def get_favorite_fuel_stations():
    try:
        user_id = get_jwt_identity()

        user = Users.objects.get(id=user_id)

        favorite_doc = FavoriteFuelStation.objects(user=user.id).first()
        if favorite_doc:
            favorite_stations = favorite_doc.favorite_stations

            fuel_stations = FuelStation.objects(id__in=[dbref.id for dbref in favorite_stations])

            station_list = [
                {
                    "station_id": str(station.id),
                    "name": station.name,
                    "phone_number": station.phone_number,
                    "location": {
                        "latitude": station.latitude,
                        "longitude": station.longitude,
                    },
                    "prices": {
                        "petrol_price": station.petrol_prices[-1].price if station.petrol_prices else None,
                        "petrol_updated_at": station.petrol_prices[-1].updated_at.strftime('%Y-%m-%d %H:%M:%S') if station.petrol_prices else None,
                        "diesel_price": station.diesel_prices[-1].price if station.diesel_prices else None,
                        "diesel_updated_at": station.diesel_prices[-1].updated_at.strftime('%Y-%m-%d %H:%M:%S') if station.diesel_prices else None
                    },
                } for station in fuel_stations
            ]
            return jsonify({"favorite_stations": station_list}), 200
        else:
            return jsonify({"message": "No favorite fuel stations found for the user."}), 200

    except (ExpiredSignatureError, InvalidTokenError) as e:
        current_app.logger.error('JWT Token Error: %s', str(e))
        return jsonify({'error': 'JWT Token Error'}), 401
    except DoesNotExist:
        return jsonify({"error": "User not found with the provided token."}), 404
    except Exception as e:
        return handle_api_error(e)


#! this route is for managing favorite fuel station (add/remove)
@require_api_key
@jwt_required()
def favorite_fuel_station():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()

        user = Users.objects(id=user_id).first()

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

                # ? Marked as favorite station activity
                UserActivity(user=user, activity_type="favorite_station",
                             details=f"{user.username} marked {station.name} as a favorite.", station=station).save()

                return jsonify({"message": f"Fuel station '{station.name}' has been added to favorites. user: '{user_id}'"}), 200

            elif station in favorite_doc.favorite_stations:
                favorite_doc.favorite_stations.remove(station)
                favorite_doc.save()

                # ? UnMarked as favorite station activity
                UserActivity(user=user, activity_type="favorite_station",
                             details=f"{user.username} unmarked {station.name} as a favorite.", station=station).save()

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


@require_api_key
@jwt_required()
def store_fuel_prices():
    try:
        user = Users.objects(id=get_jwt_identity()).first()
        data = request.get_json()
        print('user', user.username, user.roles, user.id, user.email)
        print('data', data)
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

            price_verified = False

            if set(user.roles) & {'admin', 'Developer', 'Station_Owner'}:
                price_verified = True

            fuel_station.petrol_prices.append(PetrolPrices(
                price=petrol_price, price_verified=price_verified, updated_at=datetime.utcnow()))
            fuel_station.diesel_prices.append(DieselPrices(
                price=diesel_price, price_verified=price_verified, updated_at=datetime.utcnow()))
            fuel_station.save()

            new_price = FuelPrices(
                station=fuel_station,
                petrol_prices=[PetrolPrices(
                    price=petrol_price, price_verified=price_verified, updated_at=datetime.utcnow())],
                diesel_prices=[DieselPrices(
                    price=diesel_price, price_verified=price_verified, updated_at=datetime.utcnow())],
                updated_at=datetime.utcnow()
            )
            print('new_price', new_price)
            new_price.save()

            UserActivity(user=user, activity_type="fuel_price_update",
                         details=f"{user.username} updated fuel price at {fuel_station.name}", station=fuel_station).save()

        return jsonify({"message": "Fuel prices stored successfully"})
    except DoesNotExist:
        return jsonify({"error": "Fuel station not found"}), 404
    except Exception as e:
        return handle_api_error(e)


# ! This is the route for storing EV charging prices info from Frontend
@require_api_key
@jwt_required()
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
@require_api_key
@jwt_required()
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
