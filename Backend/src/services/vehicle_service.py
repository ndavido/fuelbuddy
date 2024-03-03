#! /usr/bin/env python3

from flask import request, jsonify, current_app
from mongoengine.errors import DoesNotExist
from src.models import Vehicle
from src.middleware.api_key_middleware import require_api_key
from datetime import datetime
from mongoengine.queryset.visitor import Q
from src.utils.helper_utils import handle_api_error

# Get all vehicle makes from the database
@require_api_key
def get_vehicle_makes():
    try:
        makes = Vehicle.objects.distinct('make')

        return jsonify({'makes': makes})
    except Exception as e:
        return handle_api_error(e)

