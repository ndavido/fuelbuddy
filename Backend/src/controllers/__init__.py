#! /usr/bin/env python3

from .account_controller import account_blueprint
from .auth_controller import auth_blueprint
from .budget_controller import budget_blueprint
from .friend_controller import friend_blueprint
from .fuel_station_controller import fuel_station_blueprint
from .ocr_controller import ocr_blueprint
from .trip_controller import trip_blueprint
from .user_admin_support_controller import user_admin_support_blueprint
from .vehicle_controller import vehicle_blueprint

__all__ = [account_blueprint, auth_blueprint, budget_blueprint, friend_blueprint,
           fuel_station_blueprint, ocr_blueprint, trip_blueprint, user_admin_support_blueprint, vehicle_blueprint]
