#! /usr/bin/env python3

from flask import request, jsonify, current_app
from mongoengine.errors import DoesNotExist
from src.models import FuelStation, Location, PetrolPrices, DieselPrices, FuelPrices, Users, FavoriteFuelStation
from src.models import ChargingStation, EVPrices
from src.middleware.api_key_middleware import require_api_key
from datetime import datetime
from mongoengine.queryset.visitor import Q
from src.utils.helper_utils import handle_api_error


# ! This is the route for sending fuel stations info to Frontend
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

#! This is the route for storing fuel stations info from Frontend


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


#! this route is for managing favorite fuel station (add/remove)
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


# ! This is the route for storing EV charging prices info from Frontend
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
