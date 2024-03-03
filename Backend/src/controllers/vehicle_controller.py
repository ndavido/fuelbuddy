from flask import Blueprint
from src.services.vehicle_service import get_vehicle_makes, get_models_for_make, get_years_for_model


vehicle_blueprint = Blueprint('vehicle', __name__)

# GET vehicle methods
vehicle_blueprint.route('/vehicle_makes', methods=['GET'])(get_vehicle_makes)
vehicle_blueprint.route('/vehicle_models/<make>', methods=['GET'])(get_models_for_make)
vehicle_blueprint.route('/vehicle_years/<model>', methods=['GET'])(get_years_for_model)
