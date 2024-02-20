#! /usr/bin/env python3

from flask import request, jsonify
from src.models import Trip, Location, Users
from src.middleware.api_key_middleware import require_api_key
from src.utils.helper_utils import handle_api_error
from flask_jwt_extended import jwt_required, get_jwt_identity

#! This route is for saving trips


@require_api_key
@jwt_required()
def save_trip():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        start_lat = data.get('start_latitude')
        start_long = data.get('start_longitude')
        end_lat = data.get('end_latitude')
        end_long = data.get('end_longitude')
        distance = data.get('distance')

        # Validate required fields
        if not all([start_lat, start_long, end_lat, end_long, distance]):
            return jsonify({"error": "Missing required trip data"}), 400

        # Create Location instances for start and end points
        start_location = Location(
            latitude=start_lat, longitude=start_long).save()
        end_location = Location(latitude=end_lat, longitude=end_long).save()

        # Create and save the trip
        new_trip = Trip(
            user=Users.objects.get(id=current_user_id),
            start_location=start_location,
            end_location=end_location,
            distance=distance
        ).save()

        return jsonify({"message": "Trip saved successfully"}), 200

    except Exception as e:
        return handle_api_error(e)
