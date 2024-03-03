#! /usr/bin/env python3

from flask import request, jsonify, current_app
from mongoengine.errors import DoesNotExist
from src.models import Vehicle
from src.middleware.api_key_middleware import require_api_key
from datetime import datetime
from mongoengine.queryset.visitor import Q
from src.utils.helper_utils import handle_api_error

# ref: https://docs.python.org/3/tutorial/datastructures.html
# ref: https://www.geeksforgeeks.org/python-set-method/

# Get all vehicle makes from the database
@require_api_key
def get_vehicle_makes():
    try:
        makes = Vehicle.objects.distinct('make')

        return jsonify({'makes': makes})
    except Exception as e:
        return handle_api_error(e)

@require_api_key
def get_models_for_make(make):
    try:
        models = set()
        vehicles = Vehicle.objects(make=make)
        for vehicle in vehicles:
            for model_info in vehicle.models:
                models.add(model_info.model)
        return jsonify({'models': list(models)})
    except Exception as e:
        return handle_api_error(e)


# Route to get all years for the selected model
@require_api_key
def get_years_for_model(model):
    try:
        years = set()
        vehicles = Vehicle.objects(models__model=model)
        for vehicle in vehicles:
            for model_info in vehicle.models:
                if model_info.model == model:
                    for year_info in model_info.years:
                        years.add(year_info.year)
        return jsonify({'years': list(years)})
    except Exception as e:
        return handle_api_error(e)