#! /usr/bin/env python3

from flask import request, jsonify, current_app
from mongoengine.errors import DoesNotExist
from src.models import Vehicle
from src.models import ChargingStation, EVPrices
from src.middleware.api_key_middleware import require_api_key
from datetime import datetime
from mongoengine.queryset.visitor import Q
from src.utils.helper_utils import handle_api_error


# ! This is the route for sending fuel stations info to Frontend
@require_api_key
def get_car_data():
    try:
        vehicle_all = Vehicle.objects.all()

        result = []
        for car_data in vehicle_all:
            vehicle_data = {
                'id': str(car_data.id),
                'make': car_data.make,
            }
            result.append(vehicle_data)

        return jsonify(result)
    except Exception as e:
        current_app.logger.error('An error occurred: %s', str(e))
        return handle_api_error(e)