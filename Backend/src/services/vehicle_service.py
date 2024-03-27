#! /usr/bin/env python3

from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from mongoengine.errors import DoesNotExist
from src.models import Vehicle
from src.models.vehicle import UserVehicle
from src.middleware.api_key_middleware import require_api_key
from datetime import datetime
from mongoengine.queryset.visitor import Q
from src.utils.helper_utils import get_trim_info_by_year



# ref: https://docs.python.org/3/tutorial/datastructures.html
# ref: https://www.geeksforgeeks.org/python-set-method/

# User Vehicle Routes
# CREATE
@require_api_key
@jwt_required()
def create_user_vehicle():
    try:
        current_user_id = get_jwt_identity()
        vehicle_data = request.get_json()

        make = vehicle_data.get('make')
        model = vehicle_data.get('model')
        year = vehicle_data.get('year')

        # Additional fields
        series = vehicle_data.get('series')
        trim = vehicle_data.get('trim')
        body_type = vehicle_data.get('body_type')
        engine_type = vehicle_data.get('engine_type')
        transmission = vehicle_data.get('transmission')
        fuel_tank_capacity = vehicle_data.get('fuel_tank_capacity_l')
        city_fuel_per_100km = vehicle_data.get('city_fuel_per_100km_l')
        co2_emissions = vehicle_data.get('co2_emissions_g_km')

        # Create the user vehicle object
        user_vehicle = UserVehicle(
            user_id=current_user_id,
            make=make,
            model=model,
            year=year,
            series=series,
            trim=trim,
            body_type=body_type,
            engine_type=engine_type,
            transmission=transmission,
            fuel_tank_capacity=fuel_tank_capacity,
            city_fuel_per_100km=city_fuel_per_100km,
            co2_emissions=co2_emissions
        )
        user_vehicle.save()

        return jsonify({'message': 'Vehicle added to user successfully'}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to add vehicle to user', 'details': str(e)}), 500

# READ
# Retrieve a vehicle from collection
@require_api_key
@jwt_required()
def get_user_vehicle():
    try:
        current_user_id = get_jwt_identity()

        vehicle = UserVehicle.objects.get(user_id=current_user_id)

        # Convert to a dictionary
        vehicle_dict = {
            'make': vehicle.make,
            'model': vehicle.model,
            'year': vehicle.year,
            'series': vehicle.series,
            'trim': vehicle.trim,
            'body_type': vehicle.body_type,
            'engine_type': vehicle.engine_type,
            'transmission': vehicle.transmission,
            'fuel_tank_capacity_l': vehicle.fuel_tank_capacity,
            'city_fuel_per_100km_l': vehicle.city_fuel_per_100km,
            'co2_emissions_g_km': vehicle.co2_emissions
        }

        return jsonify(vehicle_dict), 200

    except DoesNotExist:
        return jsonify({'error': 'Vehicle not found'}), 404
    except Exception as e:
        return jsonify({'error': 'Failed to retrieve vehicle', 'details': str(e)}), 500

# UPDATE
# Update user vehicle information
@require_api_key
@jwt_required()
def update_user_vehicle():
    try:
        current_user_id = get_jwt_identity()
        vehicle_data = request.get_json()

        user_vehicle = UserVehicle.objects.get(user_id=current_user_id)

        # Update fields if provided in the request data
        for key, value in vehicle_data.items():
            if hasattr(user_vehicle, key):
                setattr(user_vehicle, key, value)

        user_vehicle.save()

        return jsonify({'message': 'Vehicle information updated successfully'}), 200

    except DoesNotExist:
        return jsonify({'error': 'Vehicle not found'}), 404
    except Exception as e:
        return jsonify({'error': 'Failed to update vehicle information', 'details': str(e)}), 500

# DELETE
# Delete a vehicle
@require_api_key
@jwt_required()
def delete_user_vehicle():
    try:
        current_user_id = get_jwt_identity()

        vehicle = UserVehicle.objects.get(user_id=current_user_id)
        vehicle.delete()

        return jsonify({'message': 'Vehicle deleted successfully'}), 200

    except DoesNotExist:
        return jsonify({'error': 'Vehicle not found'}), 404
    except Exception as e:
        return jsonify({'error': 'Failed to delete vehicle', 'details': str(e)}), 500

# General Vehicle Routes for 'vehicles_data' collection

@require_api_key
@jwt_required()
def get_vehicle_makes():
    try:
        makes = Vehicle.objects.distinct('make')
        return jsonify({'makes': makes}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to retrieve all vehicle makes', 'details': str(e)}), 500


@require_api_key
@jwt_required()
def get_vehicle_models_for_makes(make):
    try:
        models = Vehicle.objects(make=make).distinct('models.model')
        return jsonify({'make': make, 'models': models}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to retrieve models for the make', 'details': str(e)}), 500

# Route to get all years for the selected model
@require_api_key
@jwt_required()
def get_vehicle_years_for_model(model):
    try:
        trim_info_by_year = get_trim_info_by_year(model)
        return jsonify(trim_info_by_year), 200
    except Exception as e:
        return jsonify({'error': 'Failed to retrieve years for the model', 'details': str(e)}), 500


