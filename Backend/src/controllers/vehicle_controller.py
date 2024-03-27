from flask import Blueprint
from src.services.vehicle_service import (get_vehicle_makes, get_models_for_make, get_years_for_model,
                                          create_user_vehicle, get_user_vehicle, delete_user_vehicle, update_user_vehicle)


vehicle_blueprint = Blueprint('vehicle', __name__)

# GET vehicle methods
vehicle_blueprint.route('/vehicle_makes', methods=['GET'])(get_vehicle_makes)
vehicle_blueprint.route('/vehicle_models/<make>', methods=['GET'])(get_models_for_make)
vehicle_blueprint.route('/vehicle_years/<model>', methods=['GET'])(get_years_for_model)


# GET User Vehicle method
vehicle_blueprint.route('/get_user_vehicle/', methods=['GET'])(get_user_vehicle)
# POST User vehicle method
vehicle_blueprint.route('/create_user_vehicle/', methods=['POST'])(create_user_vehicle)
# DELETE User vehicle method
vehicle_blueprint.route('/delete_user_vehicle/', methods=['DELETE'])(delete_user_vehicle)
# UPDATE User vehicle method
vehicle_blueprint.route('/update_user_vehicle/', methods=['PATCH'])(update_user_vehicle)

