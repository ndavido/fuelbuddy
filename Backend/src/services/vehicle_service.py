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
        trim_info_by_year = {}
        vehicles = Vehicle.objects(models__model=model)
        for vehicle in vehicles:
            for model_info in vehicle.models:
                if model_info.model == model:
                    for year_info in model_info.years:
                        year = year_info.year
                        if year not in trim_info_by_year:
                            trim_info_by_year[year] = []
                        for trim_info in year_info.trims:
                            trim_data = {
                                "series": trim_info.series,
                                "trim": trim_info.trim,
                                "body_type": trim_info.body_type,
                                "engine_type": trim_info.engine_type,
                                "turnover_of_maximum_torque_rpm": trim_info.turnover_of_maximum_torque_rpm,
                                "capacity_cm3": trim_info.capacity_cm3,
                                "engine_hp": trim_info.engine_hp,
                                "engine_hp_rpm": trim_info.engine_hp_rpm,
                                "transmission": trim_info.transmission,
                                "mixed_fuel_consumption_per_100_km_l": trim_info.mixed_fuel_consumption_per_100_km_l,
                                "range_km": trim_info.range_km,
                                "emission_standards": trim_info.emission_standards,
                                "fuel_tank_capacity_l": trim_info.fuel_tank_capacity_l,
                                "city_fuel_per_100km_l": trim_info.city_fuel_per_100km_l,
                                "co2_emissions_g_km": trim_info.co2_emissions_g_km,
                                "car_class": trim_info.car_class
                            }
                            trim_info_by_year[year].append(trim_data)
        return jsonify(trim_info_by_year)
    except Exception as e:
        return handle_api_error(e)