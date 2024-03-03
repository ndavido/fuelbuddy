#! /usr/bin/env python3

from flask import Blueprint
from src.services.vehicle_service import get_vehicle_makes

vehicle_blueprint = Blueprint('vehicle', __name__)

vehicle_blueprint.route('/vehicle_makes', methods=['GET'])(get_vehicle_makes)
