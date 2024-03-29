#! /usr/bin/env python3

from flask import jsonify

from ..models import Vehicle


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


def get_trim_info_by_year(model):
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
    return trim_info_by_year
