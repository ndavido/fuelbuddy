#! /usr/bin/env python3

from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from mongoengine.errors import DoesNotExist
from ..models import Vehicle, UserVehicle
from ..middleware import require_api_key
from datetime import datetime
from mongoengine.queryset.visitor import Q
from ..utils import handle_api_error
from ..utils.vehicle_utils import get_trim_info_by_year, extract_vehicle_data, create_user_vehicle_object, vehicle_to_dict



# ref: https://docs.python.org/3/tutorial/datastructures.html
# ref: https://www.geeksforgeeks.org/python-set-method/

# User Vehicle Routes
# CREATE
@require_api_key
@jwt_required()
def create_user_vehicle():
    try:
        current_user_id = get_jwt_identity()
        vehicle_data = extract_vehicle_data(request)

        user_vehicle = create_user_vehicle_object(current_user_id, vehicle_data)
        user_vehicle.save()

        return jsonify({'message': 'Vehicle added to user successfully'}), 200

    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400

    except Exception as e:
        handle_api_error(e)

# READ
# Retrieve a vehicle from collection


@require_api_key
@jwt_required()
def get_user_vehicle():
    try:
        current_user_id = get_jwt_identity()

        vehicle = UserVehicle.objects.get(user_id=current_user_id)

        vehicle_dict = vehicle_to_dict(vehicle)

        return jsonify(vehicle_dict), 200

    except DoesNotExist:
        return jsonify({'error': 'Vehicle not found'}), 404
    except Exception as e:
        handle_api_error(e)

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
        handle_api_error(e)

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
        handle_api_error(e)

# General Vehicle Routes for 'vehicles_data' collection
@require_api_key
@jwt_required()
def get_vehicle_makes():
    try:
        makes = Vehicle.objects.distinct('make')
        return jsonify({'makes': makes}), 200
    except Exception as e:
        handle_api_error(e)


@require_api_key
@jwt_required()
def get_vehicle_models_for_makes(make):
    try:
        models = Vehicle.objects(make=make).distinct('models.model')
        return jsonify({'make': make, 'models': models}), 200
    except Exception as e:
        handle_api_error(e)

# Route to get all years for the selected model


@require_api_key
@jwt_required()
def get_vehicle_years_for_model(model):
    try:
        trim_info_by_year = get_trim_info_by_year(model)
        return jsonify(trim_info_by_year), 200
    except Exception as e:
        handle_api_error(e)
