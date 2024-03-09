#! /usr/bin/env python3

from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from mongoengine.errors import DoesNotExist
from src.models import Vehicle
from src.middleware.api_key_middleware import require_api_key
from datetime import datetime
from mongoengine.queryset.visitor import Q
from src.utils.helper_utils import get_trim_info_by_year

# ref: https://docs.python.org/3/tutorial/datastructures.html
# ref: https://www.geeksforgeeks.org/python-set-method/

# Get all vehicle makes from the database


@require_api_key
@jwt_required()
def get_vehicle_makes():
    try:
        makes = Vehicle.objects.distinct('make')
        return jsonify({'makes': makes}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to retrieve vehicle makes', 'details': str(e)}), 500

@require_api_key
@jwt_required()
def get_models_for_make(make):
    try:
        vehicles = Vehicle.objects(make=make)
        models = set()
        for vehicle in vehicles:
            for model_info in vehicle.models:
                models.add(model_info.model)
        return jsonify({'make': make, 'models': list(models)}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to retrieve models for the make', 'details': str(e)}), 500

# Route to get all years for the selected model
@require_api_key
@jwt_required()
def get_years_for_model(model):
    try:
        trim_info_by_year = get_trim_info_by_year(model)
        return jsonify(trim_info_by_year), 200
    except Exception as e:
        return jsonify({'error': 'Failed to retrieve years for the model', 'details': str(e)}), 500