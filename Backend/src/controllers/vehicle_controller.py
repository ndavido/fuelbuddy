from flask import Blueprint
from src.services.vehicle_service import get_vehicle_makes, get_models_for_make, get_years_for_model, add_vehicle_to_user


vehicle_blueprint = Blueprint('vehicle', __name__)

# GET vehicle methods
vehicle_blueprint.route('/vehicle_makes', methods=['GET'])(get_vehicle_makes)
vehicle_blueprint.route('/vehicle_models/<make>', methods=['GET'])(get_models_for_make)
vehicle_blueprint.route('/vehicle_years/<model>', methods=['GET'])(get_years_for_model)

# POST vehicle methods
vehicle_blueprint.route('/add_vehicle_to_user/', methods=['post'])(add_vehicle_to_user)
