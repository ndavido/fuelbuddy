from flask import Blueprint
from src.services.trip_service import save_trip

trip_blueprint = Blueprint('trip', __name__)

trip_blueprint.route('/save_trip', methods=['POST'])(save_trip)
