from flask import Blueprint
from src.services.vehicle_service import (get_vehicle_makes, get_models_for_make, get_years_for_model,
                                          create_user_vehicle, get_vehicle, delete_vehicle)


vehicle_blueprint = Blueprint('vehicle', __name__)

# GET vehicle methods
vehicle_blueprint.route('/vehicle_makes', methods=['GET'])(get_vehicle_makes)
vehicle_blueprint.route('/vehicle_models/<make>', methods=['GET'])(get_models_for_make)
vehicle_blueprint.route('/vehicle_years/<model>', methods=['GET'])(get_years_for_model)
vehicle_blueprint.route('/vehicle_get/', methods=['GET'])(get_vehicle)
# POST vehicle methods
vehicle_blueprint.route('/create_user_vehicle/', methods=['POST'])(create_user_vehicle)
# DELETE vehicle methods
vehicle_blueprint.route('/delete_user_vehicle/', methods=['DELETE'])(delete_vehicle)

